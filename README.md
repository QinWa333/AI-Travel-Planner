# 🌍 AI Travel Planner - AI 旅行规划师

基于 AI 的智能旅行规划 Web 应用，通过语音或文字描述需求，自动生成详细的旅行计划。

## ✨ 核心功能

- 🎤 **语音输入** - 说话即可创建行程
- 🤖 **AI 生成** - GPT-4 智能规划路线
- 🗺️ **地图展示** - 可视化查看景点
- 💰 **费用管理** - 智能记录和统计
- ☁️ **云端同步** - 多设备无缝切换

## 🚀 快速开始

### 1. 创建环境并安装依赖

```bash
# 创建 conda 环境
conda create -n ai-travel-planner python=3.11 -y
conda activate ai-travel-planner

# 安装后端依赖
cd backend
pip install -r requirements.txt

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 配置 API Keys

编辑 `backend/.env` 文件（从 `.env.example` 复制）：

```env
# Supabase (必需 - 用于数据库和认证)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# AI 服务 (二选一)
# 推荐：阿里云通义千问（国内，便宜）
DASHSCOPE_API_KEY=sk-your-dashscope-api-key

# 或者：OpenAI（国际）
OPENAI_API_KEY=sk-your-openai-api-key

# 其他配置保持默认即可
```

**获取 API Keys:**
- **Supabase**: https://supabase.com → 创建项目 → Settings → API
- **阿里云通义千问**（推荐）: https://dashscope.console.aliyun.com/ → 创建 API Key
- **OpenAI**: https://platform.openai.com → API keys → Create new key

### 3. 初始化数据库

在 Supabase SQL Editor 中运行 `backend/init_database.sql`

### 4. 启动项目

**方式一：使用启动脚本（推荐）**
```bash
# Windows
start-conda.bat
```

**方式二：手动启动**
```bash
# 后端
conda activate ai-travel-planner
cd backend
python -m uvicorn app.main:app --reload

# 前端（新终端）
cd frontend
npm run dev
```

### 5. 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 📖 文档

1. **[快速开始](QUICKSTART.md)** - 安装和启动项目
2. **[配置指南](NEXT_STEPS.md)** - 配置 API Keys（必读）
3. [阿里云配置](ALIYUN_CONFIG.md) - 使用阿里云 AI（推荐）
4. [部署指南](DEPLOYMENT.md) - 部署到生产环境

## 🛠️ 技术栈

**后端**: Python + FastAPI + Supabase + OpenAI  
**前端**: React + Vite + Ant Design + 高德地图  
**部署**: Vercel/Netlify (前端) + Railway/Render (后端)

## 📝 使用示例

### 创建行程
1. 注册/登录账号
2. 点击"创建新行程"
3. 语音或文字输入：
   ```
   我想去日本东京，5天4夜，预算1万元，喜欢美食和动漫，带孩子
   ```
4. 点击"生成行程"
5. 查看 AI 生成的详细计划
6. 在地图上查看景点位置

### 记录费用
1. 进入行程详情
2. 点击"费用管理"
3. 语音输入："今天午餐花了150元"
4. AI 自动识别类别和金额
5. 查看预算使用情况

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)
