# 🌍 AI 旅行规划师

基于 AI 的智能旅行规划系统，支持语音输入、自动生成行程、地图可视化等功能。

## ✨ 功能特性

- 🤖 AI 智能生成行程（阿里云通义千问）
- 🎤 语音输入支持
- 🗺️ 地图可视化（支持国内80+城市）
- 💰 费用管理
- 👤 用户系统

## 🚀 快速开始（使用 Docker）

### 前置要求

安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 方法一：使用预构建镜像（推荐，更快）

```bash
# 1. 下载镜像文件
# 下载地址: https://pan.baidu.com/s/xxxxx (提取码: xxxx)
# 或: https://drive.google.com/xxxxx

# 2. 加载镜像
docker load -i ai-travel-planner.tar
# 或解压后加载: gunzip ai-travel-planner.tar.gz && docker load -i ai-travel-planner.tar

# 3. 克隆项目（只需要配置文件）
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入配置（见下方）

# 5. 启动服务（直接使用加载的镜像，1分钟启动）
docker-compose up -d

# 6. 访问应用
# 前端: http://localhost
# 后端: http://localhost:8000
# API文档: http://localhost:8000/docs
```

### 方法二：从源码构建

```bash
# 1. 克隆项目
git clone https://github.com/your-username/AI-Travel-Planner.git
cd AI-Travel-Planner

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入配置（见下方）

# 3. 构建并启动（首次需要 5-10 分钟）
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 访问应用
# 前端: http://localhost
# 后端: http://localhost:8000
# API文档: http://localhost:8000/docs
```

### 停止服务

```bash
docker-compose down
```

## 🔑 配置说明

### 环境变量 (.env)

编辑 `.env` 文件，填入以下配置：

```env
# Supabase 配置（需要自己注册 https://supabase.com）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# 阿里云通义千问 API Key（供助教使用，有效期至 2025-05-01）
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# JWT 密钥（可以使用默认值）
JWT_SECRET=ai-travel-planner-secret-key-2024
```

### Supabase 数据库设置

1. 注册 https://supabase.com（免费）
2. 创建新项目
3. 在 SQL Editor 执行 `backend/migrations/init.sql`
4. 复制项目 URL 和 anon key 到 `.env`

## 🔧 本地开发（不使用 Docker）

```bash
# 后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

## 🛠️ 技术栈

- **后端**: Python, FastAPI, Supabase
- **前端**: React, Ant Design, 高德地图
- **AI**: 阿里云通义千问
- **部署**: Docker, Docker Compose

## 🏗️ 项目结构

```
AI-Travel-Planner/
├── backend/              # FastAPI 后端
│   ├── app/
│   │   ├── main.py      # 应用入口
│   │   ├── models.py    # 数据模型
│   │   ├── routers/     # API 路由
│   │   └── ...
│   ├── Dockerfile       # 后端 Docker 配置
│   └── requirements.txt
├── frontend/            # React 前端
│   ├── src/
│   ├── Dockerfile       # 前端 Docker 配置
│   ├── nginx.conf       # Nginx 配置
│   └── package.json
├── docker-compose.yml   # Docker Compose 配置
├── .env.example         # 环境变量模板
└── README.md
```

## 🐛 常见问题

### 端口被占用

修改 `docker-compose.yml` 中的端口：
```yaml
frontend:
  ports:
    - "8080:80"  # 改用 8080 端口
```

### 查看日志

```bash
docker-compose logs -f
```

### 重启服务

```bash
docker-compose restart
```

### 重新构建镜像

```bash
docker-compose build
docker-compose up -d
```

## 📦 生成镜像文件（开发者使用）

如果你想生成可分享的镜像文件：

```bash
# Windows
export-images.bat

# Linux/Mac
chmod +x export-images.sh
./export-images.sh
```

生成的文件可以上传到网盘供他人下载。

## 📄 许可证

MIT License

## 👥 作者

- 课程: AI4SE
- 学期: 2024-2025
