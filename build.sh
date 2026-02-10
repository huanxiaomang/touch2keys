#!/bin/bash

set -e

echo "======================================"
echo "Touch2Keys 打包脚本"
echo "======================================"

# 1. 构建前端
echo ""
echo "📦 步骤 1/3: 构建前端..."
cd frontend
pnpm install
pnpm run build:prod
cd ..

# 2. 安装 Python 依赖
echo ""
echo "📦 步骤 2/3: 安装 Python 依赖..."
pip install -r requirements.txt
pip install pyinstaller

# 3. 打包成 exe
echo ""
echo "📦 步骤 3/3: 打包成可执行文件..."
pyinstaller touch2keys.spec --clean

echo ""
echo "======================================"
echo "✅ 打包完成！"
echo "======================================"
echo "可执行文件位置: dist/Touch2Keys"
echo ""

