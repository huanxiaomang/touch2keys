# 更新日志

## [1.0.0] - 2026-02-10

### 新增
- ✨ 项目工程化重构
  - 前端使用 Vue 3 + TypeScript + Tailwind CSS + Vite
  - 后端使用 Flask + SocketIO
  - 支持 pnpm workspace monorepo 结构
  
- 📦 打包系统
  - 添加 PyInstaller 配置，支持打包成独立 exe
  - 前端自动构建并复制到 Flask 目录
  - Windows/macOS/Linux 打包脚本
  
- 🛠️ 开发工具
  - 一键启动开发环境脚本（dev.sh / dev.bat）
  - 一键打包脚本（build.sh / build.bat）
  - 前端热重载开发服务器
  - Socket.IO 代理配置
  
- 📝 文档
  - README.md - 项目介绍
  - BUILD.md - 构建指南
  - USAGE.md - 使用说明
  - CHANGELOG.md - 更新日志

### 技术栈
- **前端**: Vue 3, TypeScript, Vite, Tailwind CSS v4, Socket.IO Client
- **后端**: Flask, Flask-SocketIO, pydirectinput, eventlet
- **工具**: pnpm, PyInstaller

### 项目结构
```
touch2keys/
├── frontend/           # Vue3 前端
├── static/             # 静态资源（构建输出）
├── templates/          # HTML 模板（构建输出）
├── server.py           # Flask 后端
├── requirements.txt    # Python 依赖
├── touch2keys.spec     # PyInstaller 配置
├── build.sh/bat        # 打包脚本
└── dev.sh/bat          # 开发脚本
```

