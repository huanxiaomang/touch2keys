# Touch2Keys 构建指南

## 项目结构

```
touch2keys/
├── frontend/           # Vue3 + TypeScript + Tailwind 前端
│   ├── src/
│   ├── scripts/        # 构建脚本
│   └── package.json
├── static/             # Flask 静态文件目录（前端构建输出）
├── templates/          # Flask 模板目录（前端构建输出）
├── server.py           # Flask + SocketIO 后端服务器
├── requirements.txt    # Python 依赖
├── touch2keys.spec     # PyInstaller 配置
├── build.sh            # Linux/macOS 打包脚本
└── build.bat           # Windows 打包脚本
```

## 开发环境

### 前端开发

```bash
cd frontend
pnpm install
pnpm run dev
```

前端开发服务器会在 `http://localhost:5173` 启动，并自动代理 Socket.IO 请求到后端。

### 后端开发

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 启动后端服务器
python server.py
```

后端服务器会在 `http://localhost:5000` 启动。

## 生产构建

### 仅构建前端

```bash
cd frontend
pnpm run build:prod
```

这会：
1. 编译 TypeScript 和 Vue 组件
2. 使用 Vite 打包优化
3. 将构建产物复制到 `../static` 和 `../templates`

### 完整打包（前端 + 后端 → exe）

#### Windows

```bash
build.bat
```

#### Linux/macOS

```bash
./build.sh
```

打包脚本会自动：
1. 安装前端依赖并构建
2. 安装 Python 依赖
3. 使用 PyInstaller 打包成单个可执行文件

最终产物：`dist/Touch2Keys.exe` (Windows) 或 `dist/Touch2Keys` (Linux/macOS)

## 技术栈

### 前端
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **实时通信**: Socket.IO Client
- **包管理器**: pnpm

### 后端
- **框架**: Flask
- **实时通信**: Flask-SocketIO + eventlet
- **键盘模拟**: pydirectinput
- **打包工具**: PyInstaller

## 注意事项

1. **pnpm**: 前端项目使用 pnpm 作为包管理器，请确保已安装
2. **Python 版本**: 建议使用 Python 3.8+
3. **Windows**: pydirectinput 仅支持 Windows 系统
4. **打包**: 打包后的 exe 文件包含所有依赖，可独立运行

## 常用命令

```bash
# 前端开发
cd frontend && pnpm run dev

# 前端构建
cd frontend && pnpm run build:prod

# 后端运行
python server.py

# 完整打包
./build.sh        # macOS/Linux
build.bat         # Windows
```

