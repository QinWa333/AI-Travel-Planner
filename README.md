# 🌍 AI 旅行规划师

基于 AI 的智能旅行规划系统，支持语音输入、自动生成行程、地图可视化等功能。

## ✨ 功能特性

### 核心功能

#### 1. 🤖 AI 智能行程生成
- **调用服务**: 阿里云通义千问 API (qwen-plus)
- **实现功能**:
  - 根据用户需求（目的地、天数、预算、偏好）自动生成完整行程
  - 智能安排每日活动（景点、餐饮、住宿、交通）
  - 自动计算预算分配（交通、住宿、餐饮、门票等）
  - 生成的日期从明天开始，避免过期行程
- **技术实现**: FastAPI + OpenAI SDK（兼容通义千问）

#### 2. 🎤 语音输入
- **调用服务**: 
  - 主要：科大讯飞语音听写 API (WebSocket)
  - 备选：浏览器原生 Web Speech API
- **实现功能**:
  - 语音描述旅行需求，自动转文字
  - 语音记录费用，AI 自动解析类别和金额
  - 实时流式识别，边说边显示
- **技术实现**: WebSocket + AudioContext + 实时音频流处理

#### 3. 🗺️ 地图可视化
- **调用服务**: 高德地图 JavaScript API v2.0
- **实现功能**:
  - 自动标注行程中的所有景点位置
  - 支持国内 80+ 主要城市（北京、上海、成都、西安等）
  - 点击标记显示详细信息（时间、费用、描述）
  - 自动调整视野，显示所有景点
  - 按天筛选显示景点
  - 地理编码：地址转坐标
- **技术实现**: 高德地图 API + Geocoder 插件

#### 4. 💰 费用管理
- **调用服务**: Supabase PostgreSQL 数据库
- **实现功能**:
  - 记录每笔支出（类别、金额、日期、描述）
  - 自动统计总支出和分类支出
  - 计算预算剩余
  - 语音快速记账（AI 自动解析）
- **技术实现**: FastAPI + Supabase Client

#### 5. 👤 用户系统
- **调用服务**: Supabase Auth + JWT
- **实现功能**:
  - 用户注册和登录
  - JWT Token 认证
  - 用户行程隔离（只能查看自己的行程）
  - 会话管理
- **技术实现**: FastAPI + JWT + Supabase Auth

#### 6. ✏️ 行程编辑
- **调用服务**: Supabase PostgreSQL 数据库
- **实现功能**:
  - 编辑活动信息（名称、地点、时间、费用）
  - 删除活动
  - 实时更新地图显示
  - 删除整个行程
- **技术实现**: React + Ant Design + RESTful API

### 界面优化

- **分屏布局**: 左侧地图 + 右侧时间轴，信息一目了然
- **时间轴展示**: 清晰的每日行程安排，带图标分类
- **响应式设计**: 适配桌面端和平板
- **美观的卡片**: 首页行程卡片自动匹配城市主题图片

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
# 请在此处填写你的真实 API Key
DASHSCOPE_API_KEY=sk-your-actual-api-key-here

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

## 🛠️ 技术栈详解

### 后端技术
- **Python 3.11** - 编程语言
- **FastAPI** - 现代化的 Web 框架，支持异步、自动生成 API 文档
- **Pydantic** - 数据验证和设置管理
- **Supabase** - 开源的 Firebase 替代品，提供 PostgreSQL 数据库和认证服务
- **JWT** - JSON Web Token，用于用户认证和授权
- **Uvicorn** - ASGI 服务器，运行 FastAPI 应用

### 前端技术
- **React 18** - 用户界面库
- **Vite** - 现代化的前端构建工具，快速的开发服务器
- **Ant Design 5** - 企业级 UI 组件库
- **React Router v6** - 前端路由管理
- **Axios** - HTTP 客户端，用于 API 调用
- **Day.js** - 轻量级日期处理库

### 地图服务
- **高德地图 API** - 提供地图展示、地理编码、路线规划等功能
  - 支持国内 80+ 主要城市的地图展示
  - 自动标注景点位置
  - 信息窗口展示详细信息

### AI 服务
- **阿里云通义千问（Qwen）** - 大语言模型
  - 模型：qwen-plus
  - 用于智能生成旅行计划
  - 解析语音输入的费用记录

### 语音识别
- **科大讯飞语音听写 API** - 实时语音转文字
  - WebSocket 流式识别
  - 支持中文普通话
  - 备选方案：浏览器原生 Web Speech API

### 部署工具
- **Docker** - 容器化应用
- **Docker Compose** - 多容器编排
- **Nginx** - 前端静态文件服务器和反向代理

## 🏗️ 项目结构

```
AI-Travel-Planner/
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── main.py            # 应用入口，CORS 配置
│   │   ├── config.py          # 配置管理（环境变量）
│   │   ├── models.py          # Pydantic 数据模型
│   │   ├── database.py        # Supabase 数据库连接
│   │   ├── auth.py            # JWT 认证中间件
│   │   └── routers/           # API 路由
│   │       ├── ai.py          # AI 生成行程、解析费用
│   │       ├── trips.py       # 行程 CRUD
│   │       ├── expenses.py    # 费用管理
│   │       └── auth.py        # 用户认证
│   ├── migrations/
│   │   └── init.sql           # 数据库初始化脚本
│   ├── Dockerfile             # 后端 Docker 配置
│   └── requirements.txt       # Python 依赖
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── App.jsx            # 应用主组件，路由配置
│   │   ├── main.jsx           # 应用入口
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home.jsx       # 首页（行程列表）
│   │   │   ├── Login.jsx      # 登录/注册
│   │   │   ├── CreateTrip.jsx # 创建行程（AI 生成）
│   │   │   └── TripDetail.jsx # 行程详情（地图+编辑）
│   │   ├── components/        # 可复用组件
│   │   │   ├── MapView.jsx    # 高德地图组件
│   │   │   └── VoiceInput.jsx # 语音输入组件
│   │   └── services/          # API 服务
│   │       ├── api.js         # Axios 封装，API 调用
│   │       ├── speech.js      # 语音识别服务切换
│   │       └── xfyun-speech.js # 科大讯飞实现
│   ├── public/
│   │   └── index.html         # HTML 模板（高德地图 API Key）
│   ├── Dockerfile             # 前端 Docker 配置
│   ├── nginx.conf             # Nginx 配置
│   └── package.json           # Node.js 依赖
├── docker-compose.yml         # Docker Compose 编排
├── .env.example               # 环境变量模板
├── .gitignore                 # Git 忽略文件
└── README.md                  # 项目文档
```

## 📡 API 接口说明

### 认证相关 (`/api/auth`)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录（返回 JWT Token）

### AI 相关 (`/api/ai`)
- `POST /api/ai/generate-trip` - AI 生成行程
  - 调用：阿里云通义千问 API
  - 输入：用户需求描述
  - 输出：完整行程 JSON
- `POST /api/ai/parse-expense` - AI 解析费用
  - 调用：阿里云通义千问 API
  - 输入：语音转文字结果
  - 输出：结构化费用数据

### 行程相关 (`/api/trips`)
- `GET /api/trips/` - 获取用户所有行程
- `GET /api/trips/{id}` - 获取行程详情
- `POST /api/trips/` - 创建行程
- `PUT /api/trips/{id}` - 更新行程（编辑活动）
- `DELETE /api/trips/{id}` - 删除行程

### 费用相关 (`/api/expenses`)
- `GET /api/expenses/trip/{trip_id}` - 获取行程费用列表
- `GET /api/expenses/trip/{trip_id}/summary` - 获取费用统计
- `POST /api/expenses/` - 添加费用记录
- `DELETE /api/expenses/{id}` - 删除费用记录

所有 API 详细文档：http://localhost:8000/docs（启动后访问）

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

## � API Key 说明

### 必需的 API Key

1. **Supabase** (必需)
   - 用途：数据库和用户认证
   - 获取：https://supabase.com（免费）
   - 配置：`.env` 中的 `SUPABASE_URL` 和 `SUPABASE_KEY`

2. **阿里云通义千问** (必需)
   - 用途：AI 生成行程和解析费用
   - 获取：https://dashscope.console.aliyun.com/
   - 配置：`.env` 中的 `DASHSCOPE_API_KEY`
   - 免费额度：每月 100 万 tokens

### 可选的 API Key

3. **高德地图** (可选，已配置)
   - 用途：地图展示和地理编码
   - 获取：https://console.amap.com/
   - 配置：`frontend/public/index.html` 中的 `key` 参数
   - 免费额度：每日 30 万次调用

4. **科大讯飞语音** (可选)
   - 用途：语音转文字
   - 获取：https://console.xfyun.cn/
   - 配置：`frontend/.env` 中的 `VITE_XFYUN_*` 参数
   - 免费额度：每日 500 次
   - 备选方案：浏览器原生语音识别（Chrome/Edge）

## 🎯 使用场景

1. **个人旅行规划** - 快速生成旅行计划，节省规划时间
2. **团队出游** - 共享行程，协同编辑
3. **预算管理** - 实时记录支出，控制预算
4. **行程可视化** - 地图展示，直观了解景点分布
5. **语音记账** - 旅途中快速记录费用

## 📊 性能指标

- **AI 生成速度**: 5-10 秒（取决于行程复杂度）
- **地图加载**: 1-2 秒
- **语音识别**: 实时流式识别
- **Docker 启动**: 
  - 使用预构建镜像：1 分钟
  - 从源码构建：5-10 分钟

## 🌟 项目亮点

1. **完整的 AI 集成** - 从需求到行程，全程 AI 辅助
2. **多模态交互** - 支持文字和语音输入
3. **实时可视化** - 地图实时展示行程路线
4. **容器化部署** - 一键启动，环境一致
5. **现代化技术栈** - FastAPI + React + Docker
6. **良好的代码结构** - 前后端分离，模块化设计

## 📄 许可证

MIT License

## 👥 作者

- 课程: AI4SE
- 学期: 2024-2025
- 项目: AI 旅行规划师

## 🙏 致谢

- 阿里云通义千问 - AI 能力支持
- 科大讯飞 - 语音识别支持
- 高德地图 - 地图服务支持
- Supabase - 数据库和认证服务
- Ant Design - UI 组件库
