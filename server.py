from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import pydirectinput
import time
import threading
from collections import deque

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# ==================== 配置 ====================
DEBUG = False  # 设置为 True 启用日志输出

# pydirectinput 配置
pydirectinput.PAUSE = 0.005
pydirectinput.FAILSAFE = False

# ==================== 全局状态 ====================
current_mode = "rizline"           # 默认模式
occupied = set()
touch_to_key = {}                  # touch_id -> key
touch_to_down_time = {}            # touch_id -> timestamp

# 延迟统计
latency_samples = deque(maxlen=300)
duration_samples = deque(maxlen=300)
event_count = 0
last_stat_time = time.time()

# 模式按键池
MODE_KEYS = {
    "rizline":  list("qwertyuiopasdfghjklzxcvbnm"),   # 所有可用键
    "musedash": ["d", "f", "s", "j", "k", "l"],       # 固定6个键
    "osu":      ["d", "f", "j", "k"]                  # OSU 4个键
}

# Rizline 模式的按键分配策略
RIZLINE_PRIMARY = list("asdfghjkl")           # 9个主键（竖向9个区域）
RIZLINE_LEFT = list("qwerzxc")                # 左侧备用键
RIZLINE_RIGHT = list("iopnmtyuvb")            # 右侧备用键

def log_stats():
    global last_stat_time
    while True:
        time.sleep(10)
        now = time.time()
        if DEBUG:
            if latency_samples:
                avg = sum(latency_samples)/len(latency_samples)*1000
                mx  = max(latency_samples)*1000
                print(f"[STAT {time.strftime('%H:%M:%S')}] 延迟 avg {avg:.1f}ms | max {mx:.1f}ms | 样本 {len(latency_samples)}")
            if duration_samples:
                avg_dur = sum(duration_samples)/len(duration_samples)*1000
                print(f"  按住时长 avg {avg_dur:.1f}ms | 样本 {len(duration_samples)}")
        last_stat_time = now

threading.Thread(target=log_stats, daemon=True).start()

def release_all():
    global occupied
    for touch_id, key in list(touch_to_key.items()):
        try:
            pydirectinput.keyUp(key)
        except:
            pass
        if touch_id in touch_to_down_time:
            del touch_to_down_time[touch_id]
    touch_to_key.clear()
    occupied.clear()
    if DEBUG:
        print("[释放] 所有按键已释放")

def get_key_for_mode(x_percent, y_percent, mode):
    """根据模式和触摸位置决定使用哪个键"""
    if mode == "rizline":
        # 横向均分成9个区域，每个区域对应一个主键
        zone_index = int(x_percent * 9)  # 0-8
        zone_index = min(zone_index, 8)  # 确保不超过8

        primary_key = RIZLINE_PRIMARY[zone_index]

        # 如果主键未被占用，直接使用
        if primary_key not in occupied:
            occupied.add(primary_key)
            return primary_key

        # 主键被占用，根据触摸的上下位置选择备用键
        if y_percent < 0.5:
            # 上侧，从左侧备用键中找未被占用的
            for k in RIZLINE_LEFT:
                if k not in occupied:
                    occupied.add(k)
                    return k
        else:
            # 下侧，从右侧备用键中找未被占用的
            for k in RIZLINE_RIGHT:
                if k not in occupied:
                    occupied.add(k)
                    return k

        # 所有备用键都被占用，返回None
        return None

    elif mode == "musedash":
        # 左右分割
        if x_percent < 0.5:
            # 左侧 → d f s
            candidates = ["d", "f", "s"]
            color_side = "left"
        else:
            # 右侧 → j k l
            candidates = ["j", "k", "l"]
            color_side = "right"

        for k in candidates:
            if k not in occupied:
                occupied.add(k)
                return k, color_side
        return None, color_side

    elif mode == "osu":
        # OSU 模式：4个固定按键，按触摸位置分配
        # 左侧两个键 (d, f)，右侧两个键 (j, k)
        if x_percent < 0.5:
            candidates = ["d", "f"]
            color_side = "left"
        else:
            candidates = ["j", "k"]
            color_side = "right"

        for k in candidates:
            if k not in occupied:
                occupied.add(k)
                return k, color_side
        return None, color_side

    return None

# ==================== SocketIO 事件 ====================
@socketio.on('connect')
def handle_connect():
    emit('mode_update', {'mode': current_mode})
    emit('status', {'message': f'已连接 | 模式: {current_mode}'})

@socketio.on('set_mode')
def handle_set_mode(data):
    global current_mode
    new_mode = data.get('mode')
    if new_mode in MODE_KEYS:
        if new_mode != current_mode:
            release_all()
            current_mode = new_mode
            emit('mode_update', {'mode': current_mode}, broadcast=True)
            emit('status', {'message': f'已切换到 {new_mode} 模式'}, broadcast=True)
            if DEBUG:
                print(f"[模式切换] → {new_mode}")

@socketio.on('touch_event')
def handle_touch_event(data):
    global event_count
    touch_type = data.get('type')
    touch_id = data.get('id')
    x_percent = data.get('x_percent')   # 0~1
    y_percent = data.get('y_percent')   # 0~1
    now = time.time()
    event_count += 1

    if touch_type == 'down':
        if touch_id in touch_to_key:
            return

        if current_mode == "rizline":
            key = get_key_for_mode(x_percent, y_percent, "rizline")
            side = None
        else:
            key, side = get_key_for_mode(x_percent, y_percent, "musedash")

        if not key:
            emit('error', {'message': '该模式按键已满'})
            return

        touch_to_key[touch_id] = key
        touch_to_down_time[touch_id] = now

        try:
            pydirectinput.keyDown(key)
        except Exception as e:
            if DEBUG:
                print(f"keyDown 失败 {key}: {e}")

        # 回传触摸视觉反馈（可选）
        emit('touch_feedback', {
            'id': touch_id,
            'key': key,
            'side': side,
            'x_percent': x_percent,
            'y_percent': data.get('y_percent', 0.5)
        }, room=request.sid)

    elif touch_type in ('up', 'cancel'):
        if touch_id in touch_to_key:
            key = touch_to_key.pop(touch_id)
            try:
                pydirectinput.keyUp(key)
            except:
                pass
            if key in occupied:
                occupied.remove(key)
            if touch_id in touch_to_down_time:
                dur = now - touch_to_down_time[touch_id]
                duration_samples.append(dur)
                del touch_to_down_time[touch_id]

@socketio.on('key_press')
def handle_key_press(data):
    key = data.get('key', 'esc')
    try:
        pydirectinput.press(key)
        if DEBUG:
            print(f"[{key.upper()}] 触发")
    except Exception as e:
        if DEBUG:
            print(f"{key.upper()} 失败: {e}")

@socketio.on('osu_key_down')
def handle_osu_key_down(data):
    key = data.get('key')
    try:
        pydirectinput.keyDown(key)
        if DEBUG:
            print(f"[OSU] {key.upper()} 按下")
    except Exception as e:
        if DEBUG:
            print(f"OSU {key.upper()} 按下失败: {e}")

@socketio.on('osu_key_up')
def handle_osu_key_up(data):
    key = data.get('key')
    try:
        pydirectinput.keyUp(key)
        if DEBUG:
            print(f"[OSU] {key.upper()} 释放")
    except Exception as e:
        if DEBUG:
            print(f"OSU {key.upper()} 释放失败: {e}")

# ==================== 网页 ====================
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    print("服务器启动...")
    print("手机访问: http://你的局域网IP:5000")
    if DEBUG:
        print("统计信息每10秒输出一次")
    else:
        print("DEBUG 模式已关闭，日志输出已禁用")
    release_all()           # 启动前清理
    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)