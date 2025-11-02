@echo off
REM 导出 Docker 镜像为文件

echo ========================================
echo AI 旅行规划师 - 导出 Docker 镜像
echo ========================================
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)

REM 1. 构建镜像
echo 步骤 1: 构建 Docker 镜像...
docker-compose build
if errorlevel 1 (
    echo 构建失败
    pause
    exit /b 1
)
echo.

REM 2. 导出镜像
echo 步骤 2: 导出镜像到文件...
echo 正在导出，请稍候（可能需要几分钟）...

docker save -o ai-travel-planner.tar ^
    ai-travel-planner-backend:latest ^
    ai-travel-planner-frontend:latest

if errorlevel 1 (
    echo 导出失败
    pause
    exit /b 1
)
echo.

REM 3. 显示文件信息
echo 步骤 3: 检查文件...
if exist ai-travel-planner.tar (
    for %%A in (ai-travel-planner.tar) do (
        set size=%%~zA
        set /a sizeMB=!size! / 1048576
    )
    echo 导出成功！
    echo 文件: ai-travel-planner.tar
    echo 大小: 约 %sizeMB% MB
) else (
    echo 文件未生成
    pause
    exit /b 1
)
echo.

REM 4. 压缩文件（可选）
echo 步骤 4: 压缩文件（可选）...
set /p compress="是否压缩文件以减小体积？(y/n): "
if /i "%compress%"=="y" (
    echo 正在压缩...
    powershell -Command "Compress-Archive -Path ai-travel-planner.tar -DestinationPath ai-travel-planner.zip -Force"
    if exist ai-travel-planner.zip (
        for %%A in (ai-travel-planner.zip) do (
            set zipsize=%%~zA
            set /a zipsizeMB=!zipsize! / 1048576
        )
        echo 压缩成功！
        echo 文件: ai-travel-planner.zip
        echo 大小: 约 %zipsizeMB% MB
    )
)
echo.

REM 5. 完成
echo ========================================
echo 导出完成！
echo ========================================
echo.
echo 生成的文件:
if exist ai-travel-planner.tar echo   - ai-travel-planner.tar
if exist ai-travel-planner.zip echo   - ai-travel-planner.zip
echo.
echo 下一步:
echo 1. 上传文件到网盘（百度网盘/阿里云盘等）
echo 2. 在 README.md 中添加下载链接
echo 3. 助教下载后使用: docker load -i ai-travel-planner.tar
echo.
echo ========================================

pause
