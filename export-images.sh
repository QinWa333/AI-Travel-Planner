#!/bin/bash

# 导出 Docker 镜像为文件

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI 旅行规划师 - 导出 Docker 镜像${NC}"
echo -e "${GREEN}========================================${NC}"
echo

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}错误: Docker 未运行，请先启动 Docker${NC}"
    exit 1
fi

# 1. 构建镜像
echo -e "${YELLOW}步骤 1: 构建 Docker 镜像...${NC}"
docker-compose build
echo

# 2. 导出镜像
echo -e "${YELLOW}步骤 2: 导出镜像到文件...${NC}"
echo "正在导出，请稍候（可能需要几分钟）..."

docker save -o ai-travel-planner.tar \
    ai-travel-planner-backend:latest \
    ai-travel-planner-frontend:latest

echo

# 3. 显示文件信息
echo -e "${YELLOW}步骤 3: 检查文件...${NC}"
if [ -f ai-travel-planner.tar ]; then
    size=$(du -h ai-travel-planner.tar | cut -f1)
    echo -e "${GREEN}导出成功！${NC}"
    echo "文件: ai-travel-planner.tar"
    echo "大小: $size"
else
    echo -e "${RED}文件未生成${NC}"
    exit 1
fi
echo

# 4. 压缩文件（可选）
echo -e "${YELLOW}步骤 4: 压缩文件（可选）...${NC}"
read -p "是否压缩文件以减小体积？(y/n): " compress
if [ "$compress" = "y" ] || [ "$compress" = "Y" ]; then
    echo "正在压缩..."
    gzip -k ai-travel-planner.tar
    if [ -f ai-travel-planner.tar.gz ]; then
        zipsize=$(du -h ai-travel-planner.tar.gz | cut -f1)
        echo -e "${GREEN}压缩成功！${NC}"
        echo "文件: ai-travel-planner.tar.gz"
        echo "大小: $zipsize"
    fi
fi
echo

# 5. 完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}导出完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo
echo "生成的文件:"
[ -f ai-travel-planner.tar ] && echo "  - ai-travel-planner.tar"
[ -f ai-travel-planner.tar.gz ] && echo "  - ai-travel-planner.tar.gz"
echo
echo "下一步:"
echo "1. 上传文件到网盘（百度网盘/阿里云盘等）"
echo "2. 在 README.md 中添加下载链接"
echo "3. 助教下载后使用: docker load -i ai-travel-planner.tar"
echo
echo -e "${GREEN}========================================${NC}"
