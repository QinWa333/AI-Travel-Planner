# 部署指南

## 🚀 快速部署

### 后端部署 (Railway)

1. 访问 https://railway.app 注册
2. 连接 GitHub 仓库
3. 选择 `backend` 目录
4. 添加环境变量：
   ```
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   OPENAI_API_KEY=your_key
   SECRET_KEY=your_secret_key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. 部署完成，获取后端 URL

### 前端部署 (Vercel)

1. 访问 https://vercel.com 注册
2. 导入 GitHub 仓库
3. 设置根目录为 `frontend`
4. 添加环境变量：
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. 部署完成

## 📋 环境变量

### 后端必需配置
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
SECRET_KEY=your-secret-key-min-32-chars
FRONTEND_URL=https://your-frontend-url.com
```

### 前端配置
- 编辑 `frontend/index.html` 替换高德地图 Key
- 设置 `VITE_API_URL` 为后端地址

## 🔧 其他部署平台

### Render (后端)
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Netlify (前端)
- Build: `npm run build`
- Publish: `dist`

## ✅ 部署检查

- [ ] 后端可访问
- [ ] API 文档正常 (/docs)
- [ ] 前端可访问
- [ ] 注册登录功能正常
- [ ] AI 生成功能正常
- [ ] 地图显示正常

## ❓ 常见问题

**CORS 错误**
- 检查后端 `FRONTEND_URL` 配置

**语音不工作**
- 确保使用 HTTPS

**AI 生成失败**
- 检查 OpenAI API Key 和余额

**数据库连接失败**
- 检查 Supabase 配置
