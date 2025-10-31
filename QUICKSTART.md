# 快速开始指南

## 📋 前置要求

- Python 3.9+ 或 Anaconda
- Node.js 16+
- Git

## 🚀 5 分钟启动

### 1. 克隆项目
```bash
git clone <repository-url>
cd ai-travel-planner
```

### 2. 安装依赖

**使用 Conda（推荐）:**
```bash
conda create -n ai-travel-planner python=3.11 -y
conda activate ai-travel-planner
cd backend
pip install -r requirements.txt
cd ../frontend
npm install
```

**使用 venv:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cd ../frontend
npm install
```

### 3. 配置 API Keys

复制环境变量模板：
```bash
cd backend
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

编辑 `backend/.env`，填入你的配置：
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
OPENAI_API_KEY=sk-your-openai-api-key
```

**获取 API Keys:**

详细配置步骤请查看 **[NEXT_STEPS.md](NEXT_STEPS.md)**

- **Supabase**: https://supabase.com
- **阿里云**（推荐）: https://dashscope.console.aliyun.com/
- **OpenAI**: https://platform.openai.com

### 4. 启动项目

**使用启动脚本:**
```bash
start-conda.bat  # Windows + Conda
```

**手动启动:**
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
- API 文档: http://localhost:8000/docs

## 🎯 快速测试

1. 访问 http://localhost:5173
2. 注册新账号
3. 创建行程，输入：
   ```
   我想去北京，3天，预算5000元，喜欢历史文化
   ```
4. 查看 AI 生成的行程
5. 在地图上查看景点

## ❓ 常见问题

**语音输入不工作**
- 使用 Chrome/Edge 浏览器
- 允许麦克风权限

**AI 生成失败**
- 检查 OpenAI API Key
- 确认账户有余额

**数据库连接失败**
- 检查 Supabase 配置
- 确认运行了 init_database.sql

**地图不显示**
- 检查高德地图 Key
- 可以先不配置，不影响其他功能

## 📚 更多文档

- [下一步操作](NEXT_STEPS.md) - API Keys 配置（必读）
- [阿里云配置](ALIYUN_CONFIG.md) - 使用阿里云（推荐）
- [部署指南](DEPLOYMENT.md) - 部署到生产环境
