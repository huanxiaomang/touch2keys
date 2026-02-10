#!/bin/bash

# 开发环境启动脚本

echo "======================================"
echo "Touch2Keys 开发环境"
echo "======================================"

# 检查是否安装了依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend && pnpm install && cd ..
fi

# 启动后端服务器（后台）
echo "🚀 启动后端服务器 (http://localhost:5000)..."
python3.14 server.py &
BACKEND_PID=$!

# 等待后端启动
sleep 2

# 启动前端开发服务器
echo "🚀 启动前端开发服务器 (http://localhost:5173)..."
cd frontend
pnpm run dev

# 清理：当前端服务器停止时，也停止后端
kill $BACKEND_PID 2>/dev/null

