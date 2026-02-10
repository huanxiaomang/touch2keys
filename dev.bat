@echo off
chcp 65001 >nul

echo ======================================
echo Touch2Keys 开发环境
echo ======================================

REM 检查是否安装了依赖
if not exist "frontend\node_modules" (
    echo 📦 安装前端依赖...
    cd frontend
    call pnpm install
    cd ..
)

REM 启动后端服务器（新窗口）
echo 🚀 启动后端服务器 (http://localhost:5000)...
start "Touch2Keys Backend" python server.py

REM 等待后端启动
timeout /t 2 /nobreak >nul

REM 启动前端开发服务器
echo 🚀 启动前端开发服务器 (http://localhost:5173)...
cd frontend
call pnpm run dev

