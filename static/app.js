const socket = io();
const canvas = document.getElementById('c');
const info = document.getElementById('info');
const escBtn = document.getElementById('esc-btn');
const enterBtn = document.getElementById('enter-btn');
const backspaceBtn = document.getElementById('backspace-btn');
const deleteBtn = document.getElementById('delete-btn');
const modeSelect = document.getElementById('mode-select');
const osuOverlay = document.getElementById('osu-overlay');
const osuZones = document.querySelectorAll('.osu-zone');

let currentMode = "rizline";
const osuKeyStates = { d: false, f: false, j: false, k: false };
// OSU 模式：记录每个按键对应的 touch ID，用于区分有效和无效的触摸
const osuKeyTouchIds = { d: null, f: null, j: null, k: null };

// 画布尺寸调整
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 阻止默认触摸行为
['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(ev => {
  canvas.addEventListener(ev, e => e.preventDefault(), { passive: false });
});

// ==================== Socket 事件 ====================
socket.on('connect', () => {
  info.textContent = '✓ 已连接';
  info.className = 'text-emerald-400 text-sm font-medium';
});

socket.on('disconnect', () => {
  info.textContent = '✗ 连接断开';
  info.className = 'text-red-400 text-sm font-medium';
});

socket.on('status', d => {
  info.textContent = d.message;
  info.className = 'text-zinc-400 text-sm font-medium';
});

socket.on('error', d => {
  info.textContent = `⚠ ${d.message}`;
  info.className = 'text-amber-400 text-sm font-medium';
  setTimeout(() => {
    info.textContent = `模式: ${currentMode}`;
    info.className = 'text-zinc-400 text-sm font-medium';
  }, 2000);
});

socket.on('mode_update', d => {
  currentMode = d.mode;
  modeSelect.value = d.mode;
  info.textContent = `模式: ${d.mode}`;
  info.className = 'text-zinc-400 text-sm font-medium';

  // 切换OSU模式UI
  if (d.mode === 'osu') {
    osuOverlay.classList.add('active');
    canvas.style.pointerEvents = 'none';
  } else {
    osuOverlay.classList.remove('active');
    canvas.style.pointerEvents = 'auto';
    // 释放所有按键
    osuZones.forEach(zone => {
      const key = zone.dataset.key;
      if (osuKeyStates[key]) {
        osuKeyStates[key] = false;
        zone.classList.remove('pressed');
        socket.emit('osu_key_up', { key });
      }
    });
  }
});

// ==================== 模式切换 ====================
modeSelect.onchange = () => {
  socket.emit('set_mode', { mode: modeSelect.value });
};

// ==================== 按钮点击 ====================
escBtn.onclick = () => {
  socket.emit('key_press', { key: 'esc' });
};

enterBtn.onclick = () => {
  socket.emit('key_press', { key: 'enter' });
};

backspaceBtn.onclick = () => {
  socket.emit('key_press', { key: 'backspace' });
};

deleteBtn.onclick = () => {
  socket.emit('key_press', { key: 'delete' });
};

// ==================== OSU 区域处理 ====================
// 使用全局触摸事件处理，而不是区域级别的事件
// 这样可以正确处理多点触摸和跨区域移动

osuOverlay.addEventListener('touchstart', (e) => {
  e.preventDefault();

  for (let touch of e.changedTouches) {
    const zone = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!zone || !zone.classList.contains('osu-zone')) {
      continue;
    }

    const key = zone.dataset.key;

    // 如果这个按键已经被按下，忽略新的触摸
    if (osuKeyStates[key]) {
      continue;
    }

    // 记录这个按键对应的 touch ID
    osuKeyTouchIds[key] = touch.identifier;
    osuKeyStates[key] = true;
    zone.classList.add('pressed');
    socket.emit('osu_key_down', { key });
  }
});

osuOverlay.addEventListener('touchend', (e) => {
  e.preventDefault();

  for (let touch of e.changedTouches) {
    // 检查这个 touch ID 是否对应某个按键
    for (let key in osuKeyTouchIds) {
      if (osuKeyTouchIds[key] === touch.identifier) {
        // 这是有效的 touch，释放按键
        osuKeyStates[key] = false;
        osuKeyTouchIds[key] = null;
        const zone = document.querySelector(`[data-key="${key}"]`);
        if (zone) {
          zone.classList.remove('pressed');
        }
        socket.emit('osu_key_up', { key });
        break;
      }
    }
  }
});

osuOverlay.addEventListener('touchcancel', (e) => {
  e.preventDefault();

  for (let touch of e.changedTouches) {
    // 检查这个 touch ID 是否对应某个按键
    for (let key in osuKeyTouchIds) {
      if (osuKeyTouchIds[key] === touch.identifier) {
        // 这是有效的 touch，释放按键
        osuKeyStates[key] = false;
        osuKeyTouchIds[key] = null;
        const zone = document.querySelector(`[data-key="${key}"]`);
        if (zone) {
          zone.classList.remove('pressed');
        }
        socket.emit('osu_key_up', { key });
        break;
      }
    }
  }
});

// ==================== 触摸反馈 ====================
socket.on('touch_feedback', d => {
  const dot = document.createElement('div');
  dot.className = 'touch-dot';

  if (currentMode === 'musedash') {
    dot.classList.add(d.side === 'left' ? 'left-side' : 'right-side');
  } else {
    // rizline 模式使用统一配色
    dot.style.background = 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.05) 70%)';
    dot.style.border = '2px solid rgba(168,85,247,0.6)';
    dot.style.boxShadow = '0 0 15px rgba(168,85,247,0.4)';
  }

  dot.style.left = (d.x_percent * 100) + 'vw';
  dot.style.top = (d.y_percent * 100) + 'vh';
  dot.style.display = 'block';

  document.body.appendChild(dot);

  // 简洁的淡出动画
  setTimeout(() => {
    dot.style.opacity = '0';
    dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
  }, 50);

  setTimeout(() => dot.remove(), 400);
});

// ==================== 触摸事件处理 ====================
function send(type, touch) {
  const rect = canvas.getBoundingClientRect();
  const x_pct = (touch.clientX - rect.left) / rect.width;
  const y_pct = (touch.clientY - rect.top) / rect.height;

  socket.emit('touch_event', {
    type,
    id: touch.identifier,
    ts: Date.now(),
    x_percent: x_pct,
    y_percent: y_pct
  });
}

canvas.addEventListener('touchstart', e => {
  for (let t of e.changedTouches) send('down', t);
});

canvas.addEventListener('touchend', e => {
  for (let t of e.changedTouches) send('up', t);
});

canvas.addEventListener('touchcancel', e => {
  for (let t of e.changedTouches) send('cancel', t);
});

