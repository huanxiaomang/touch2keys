# Touch2Keys 使用指南

## 快速开始

### 开发模式

#### 方式 1：一键启动（推荐）

```bash
# Windows
dev.bat

# macOS/Linux
./dev.sh
```

这会自动启动前端开发服务器（http://localhost:5173）和后端服务器（http://localhost:5000）。

#### 方式 2：分别启动

**终端 1 - 后端服务器：**
```bash
# 首次运行需要安装依赖
pip install -r requirements.txt

# 启动后端
python server.py
```

**终端 2 - 前端开发服务器：**
```bash
cd frontend

# 首次运行需要安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

### 生产模式

#### 打包成可执行文件

```bash
# Windows
build.bat

# macOS/Linux
./build.sh
```

打包完成后：
- Windows: `dist/Touch2Keys.exe`
- macOS/Linux: `dist/Touch2Keys`

直接运行即可，无需安装 Python 或 Node.js。

#### 仅构建前端

如果只需要更新前端代码：

```bash
cd frontend
pnpm run build:prod
```

然后直接运行 `python server.py` 即可。

## 连接手机

### 方式 1：局域网连接（推荐）

1. 确保手机和电脑在同一 WiFi 网络
2. 查看电脑的局域网 IP 地址
   - Windows: `ipconfig`
   - macOS/Linux: `ifconfig` 或 `ip addr`
3. 手机浏览器访问：`http://<电脑IP>:5000`

例如：`http://192.168.1.100:5000`

### 方式 2：USB 调试（Android）

使用 adb 反向代理：

```bash
# 确保已安装 adb 并启用 USB 调试
adb reverse tcp:5000 tcp:5000
```

然后手机浏览器访问：`http://localhost:5000`

## 使用说明

### 选择游戏模式

点击顶部的模式按钮切换：

- **Rizline**: 9 区域横向分布，适合多键位游戏
- **Muse Dash**: 左右分屏，6 键固定布局
- **OSU**: 4 键网格布局

### 触摸操作

- **触摸屏幕**: 自动触发对应键盘按键
- **多点触控**: 支持同时按下多个键
- **释放**: 抬起手指自动释放按键

### 实用按键

底部提供常用功能键：
- **ESC**: 退出/返回
- **Enter**: 确认
- **Backspace**: 删除
- **Delete**: 删除

## 调试模式

如需查看延迟统计和详细日志：

1. 编辑 `server.py`
2. 将 `DEBUG = False` 改为 `DEBUG = True`
3. 重启服务器

控制台会每 10 秒输出延迟统计信息。

## 常见问题

### 手机无法连接？

1. 检查防火墙设置，确保 5000 端口开放
2. 确认手机和电脑在同一网络
3. 尝试关闭电脑的防火墙测试

### 按键没有反应？

1. 确保游戏窗口处于激活状态
2. 检查游戏是否需要管理员权限运行
3. 尝试以管理员身份运行 Touch2Keys

### 延迟太高？

1. 使用 USB 连接（adb reverse）而非 WiFi
2. 关闭其他占用网络的程序
3. 确保手机和电脑性能充足

### 打包失败？

1. 确保已安装所有依赖：
   ```bash
   pip install -r requirements.txt
   pip install pyinstaller
   ```
2. 清理之前的构建：
   ```bash
   rm -rf build dist
   ```
3. 重新运行打包脚本

## 项目命令速查

```bash
# 开发
./dev.sh              # 启动开发环境
python server.py      # 仅启动后端
cd frontend && pnpm run dev  # 仅启动前端

# 构建
./build.sh            # 完整打包
cd frontend && pnpm run build:prod  # 仅构建前端

# 依赖管理
pip install -r requirements.txt     # 安装 Python 依赖
cd frontend && pnpm install         # 安装前端依赖
```

## 技术支持

如遇到问题，请检查：
1. Python 版本 >= 3.8
2. Node.js 版本 >= 18
3. pnpm 已正确安装
4. Windows 系统（pydirectinput 限制）

