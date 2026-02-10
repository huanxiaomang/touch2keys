# Touch2Keys

> 将手机触摸屏转换为节奏游戏键盘输入的 Web 应用

[English](#english) | [中文](#中文)

---

## 中文

将手机触摸屏转换为节奏游戏键盘输入的 Web 应用。

## 功能特性

- 🎮 **多游戏模式支持**
  - **Rizline**: 9 区域横向分布，26 键智能分配
  - **Muse Dash**: 左右分屏，6 键固定布局
  - **OSU**: 4 键网格布局

- 🎨 **现代化前端**
  - Vue 3 + TypeScript + Tailwind CSS
  - 实时触摸反馈和可视化
  - 响应式设计，适配各种屏幕

- ⚡ **低延迟**
  - WebSocket 实时通信
  - 优化的键盘模拟（~5ms 延迟）
  - 多点触控支持

- 📦 **一键打包**
  - 打包成独立 exe 文件
  - 无需安装 Python 环境
  - 包含所有依赖

## 快速开始

### 开发环境

#### 前置要求
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Python 3.8+
- Windows 系统（pydirectinput 限制）

#### 启动开发服务器

**方式 1: 使用开发脚本（推荐）**

```bash
# Windows
dev.bat

# macOS/Linux
./dev.sh
```

**方式 2: 手动启动**

```bash
# 终端 1: 启动后端
pip install -r requirements.txt
python server.py

# 终端 2: 启动前端
cd frontend
pnpm install
pnpm run dev
```

访问 `http://localhost:5173` 进行开发。

### 生产构建

#### 打包成可执行文件

```bash
# Windows
build.bat

# macOS/Linux
./build.sh
```

打包完成后，可执行文件位于 `dist/Touch2Keys.exe`（Windows）或 `dist/Touch2Keys`（macOS/Linux）。

#### 仅构建前端

```bash
cd frontend
pnpm run build:prod
```

构建产物会自动复制到 `static/` 和 `templates/` 目录。

## 使用方法

1. **启动服务器**
   - 开发环境：运行 `dev.bat` 或 `./dev.sh`
   - 生产环境：运行打包后的 exe 文件

2. **连接手机**
   - 确保手机和电脑在同一局域网
   - 手机浏览器访问：`http://<电脑IP>:5000`
   - 或使用 adb 反向代理：`adb reverse tcp:5000 tcp:5000`

3. **选择游戏模式**
   - 点击顶部按钮切换模式
   - 触摸屏幕即可触发键盘输入

## 项目结构

```
touch2keys/
├── frontend/              # Vue3 前端项目
│   ├── src/              # 源代码
│   ├── scripts/          # 构建脚本
│   └── package.json      # 前端依赖
├── static/               # 静态资源（构建输出）
├── templates/            # HTML 模板（构建输出）
├── server.py             # Flask 后端服务器
├── requirements.txt      # Python 依赖
├── touch2keys.spec       # PyInstaller 配置
├── build.sh / build.bat  # 打包脚本
├── dev.sh / dev.bat      # 开发脚本
└── BUILD.md              # 详细构建文档
```

## 技术栈

**前端**
- Vue 3 (Composition API + TypeScript)
- Vite (构建工具)
- Tailwind CSS v4 (样式)
- Socket.IO Client (实时通信)

**后端**
- Flask (Web 框架)
- Flask-SocketIO (WebSocket)
- pydirectinput (键盘模拟)
- PyInstaller (打包工具)

## 开发指南

详细的构建和开发文档请查看 [BUILD.md](./BUILD.md)。

## 常见问题

**Q: 为什么只支持 Windows？**  
A: pydirectinput 库仅支持 Windows 系统的键盘模拟。

**Q: 如何调试延迟问题？**  
A: 在 `server.py` 中设置 `DEBUG = True` 启用详细日志。

**Q: 手机无法连接？**  
A: 检查防火墙设置，确保 5000 端口开放。

## License

MIT

