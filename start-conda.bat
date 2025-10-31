@echo off
echo ========================================
echo AI Travel Planner - 启动脚本 (Conda)
echo ========================================
echo.

echo [提示] 请确保已配置 backend/.env 文件
echo.

echo [1/2] 启动后端服务 (FastAPI)...
start cmd /k "conda activate ai-travel-planner && cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo.
echo [2/2] 启动前端服务 (Vite)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo 后端 API: http://localhost:8000
echo API 文档: http://localhost:8000/docs
echo 前端界面: http://localhost:5173
echo ========================================
echo.
echo 提示：
echo 1. 如果后端报错，请检查 backend/.env 配置
echo 2. 需要配置 Supabase 和 OpenAI API Keys
echo 3. 按 Ctrl+C 可以停止服务
echo.
pause
