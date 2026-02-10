# 快速开始 🚀

## 5 分钟上手

### 1️⃣ 开发环境

```bash
# 一键启动（推荐）
./dev.sh        # macOS/Linux
dev.bat         # Windows

# 访问 http://localhost:5173
```

### 2️⃣ 生产打包

```bash
# 一键打包
./build.sh      # macOS/Linux
build.bat       # Windows

# 运行 dist/Touch2Keys.exe
```

### 3️⃣ 连接手机

```bash
# 查看电脑 IP
ipconfig        # Windows
ifconfig        # macOS/Linux

# 手机浏览器访问
http://<电脑IP>:5000
```

---

## 常用命令

| 操作 | 命令 |
|------|------|
| 🔧 开发环境 | `./dev.sh` 或 `dev.bat` |
| 📦 完整打包 | `./build.sh` 或 `build.bat` |
| 🎨 仅构建前端 | `cd frontend && pnpm run build:prod` |
| 🐍 仅启动后端 | `python server.py` |
| 📱 USB 连接 | `adb reverse tcp:5000 tcp:5000` |

---

## 项目结构

```
touch2keys/
├── frontend/          # Vue3 + TS + Tailwind
│   ├── src/          # 源代码
│   └── scripts/      # 构建脚本
├── static/           # 静态资源（自动生成）
├── templates/        # HTML 模板（自动生成）
├── server.py         # Flask 后端
├── requirements.txt  # Python 依赖
└── build.sh/bat      # 打包脚本
```

---

## 技术栈

**前端**
- Vue 3 + TypeScript
- Vite (构建)
- Tailwind CSS v4
- Socket.IO Client

**后端**
- Flask + SocketIO
- pydirectinput
- PyInstaller

---

## 游戏模式

| 模式 | 按键 | 说明 |
|------|------|------|
| **Rizline** | 26 键 | 9 区域横向分布 |
| **Muse Dash** | 6 键 | 左右分屏 (d/f/s + j/k/l) |
| **OSU** | 4 键 | 网格布局 (d/f/j/k) |

---

## 故障排查

### ❌ 手机无法连接
- 检查防火墙（开放 5000 端口）
- 确认同一网络
- 尝试 USB 连接（adb reverse）

### ❌ 按键无反应
- 游戏窗口需激活
- 尝试管理员权限运行

### ❌ 构建失败
```bash
# 清理并重试
rm -rf build dist frontend/dist
./build.sh
```

---

## 更多文档

- 📖 [完整文档](README.md)
- 🔨 [构建指南](BUILD.md)
- 📱 [使用说明](USAGE.md)
- 📝 [更新日志](CHANGELOG.md)

