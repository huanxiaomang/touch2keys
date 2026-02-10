@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ======================================
echo Touch2Keys 打包脚本
echo ======================================

REM 1. 构建前端
echo.
echo 📦 步骤 1/3: 构建前端...
cd frontend
call pnpm install
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    exit /b 1
)
call pnpm run build:prod
if errorlevel 1 (
    echo ❌ 前端构建失败
    exit /b 1
)
cd ..

REM 2. 安装 Python 依赖
echo.
echo 📦 步骤 2/3: 安装 Python 依赖...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Python 依赖安装失败
    exit /b 1
)
pip install pyinstaller
if errorlevel 1 (
    echo ❌ PyInstaller 安装失败
    exit /b 1
)

REM 3. 打包成 exe
echo.
echo 📦 步骤 3/3: 打包成可执行文件...
pyinstaller touch2keys.spec --clean
if errorlevel 1 (
    echo ❌ 打包失败
    exit /b 1
)

echo.
echo ======================================
echo ✅ 打包完成！
echo ======================================
echo 可执行文件位置: dist\Touch2Keys.exe
echo.

pause

