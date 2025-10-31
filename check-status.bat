@echo off
echo ========================================
echo AI Travel Planner - 状态检查
echo ========================================
echo.

echo [1] 检查 Conda 环境...
conda env list | findstr "ai-travel-planner"
if errorlevel 1 (
    echo ❌ Conda 环境未创建
) else (
    echo ✅ Conda 环境已创建
)
echo.

echo [2] 检查后端配置...
if exist backend\.env (
    echo ✅ .env 文件存在
    findstr /C:"your-project.supabase.co" backend\.env > nul
    if errorlevel 1 (
        echo ✅ Supabase 已配置
    ) else (
        echo ❌ Supabase 未配置 - 需要编辑 backend\.env
    )
    
    findstr /C:"sk-your-openai-api-key" backend\.env > nul
    if errorlevel 1 (
        echo ✅ OpenAI 已配置
    ) else (
        echo ❌ OpenAI 未配置 - 需要编辑 backend\.env
    )
) else (
    echo ❌ .env 文件不存在 - 需要从 .env.example 复制
)
echo.

echo [3] 检查前端依赖...
if exist frontend\node_modules (
    echo ✅ 前端依赖已安装
) else (
    echo ❌ 前端依赖未安装 - 运行: cd frontend ^&^& npm install
)
echo.

echo [4] 检查服务状态...
netstat -ano | findstr ":8000" > nul
if errorlevel 1 (
    echo ❌ 后端未运行 (端口 8000)
) else (
    echo ✅ 后端正在运行 (端口 8000)
)

netstat -ano | findstr ":5173" > nul
if errorlevel 1 (
    echo ❌ 前端未运行 (端口 5173)
) else (
    echo ✅ 前端正在运行 (端口 5173)
)
echo.

echo ========================================
echo 下一步操作：
echo ========================================
echo.
echo 如果配置未完成：
echo   1. 编辑 backend\.env 文件
echo   2. 配置 Supabase 和 OpenAI API Keys
echo   3. 参考 TODO.md 或 QUICK_CONFIG.md
echo.
echo 如果配置已完成：
echo   1. 运行 start-conda.bat 启动项目
echo   2. 访问 http://localhost:5173
echo   3. 注册账号并测试功能
echo.
pause
