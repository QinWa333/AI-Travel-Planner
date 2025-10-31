# 🎯 下一步操作指南

## 📍 你现在的位置

✅ **已完成：**
- 项目代码已创建
- Conda 环境已创建并激活
- 所有依赖已安装
- 前后端服务已启动

🔴 **未完成：**
- API Keys 未配置（必需）
- 无法注册登录
- 无法生成行程

---

## ⚡ 快速配置（10分钟）

### 步骤 1: 配置 Supabase

1. 访问 https://supabase.com 注册
2. 创建新项目（等待 2 分钟）
3. SQL Editor → 粘贴并运行 `backend/init_database.sql`
4. Settings → API → 复制 URL 和 Key
5. 编辑 `backend/.env`：
   ```env
   SUPABASE_URL=https://你的项目.supabase.co
   SUPABASE_KEY=eyJ开头的长字符串
   ```
https://jqdtuhihochqccywxjij.supabase.co
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZHR1aGlob2NocWNjeXd4amlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTA4NzcsImV4cCI6MjA3NzQ2Njg3N30.84nYzDPJlB4UTNWQqRC66fK5Umd8JRFDnqpd0Fv9t7M
### 步骤 2: 配置 AI 服务（二选一）

**选项 A: 阿里云通义千问（推荐国内用户）**

✅ 优势：国内直连、价格便宜（1/30）、支付宝支付

1. 访问 https://dashscope.console.aliyun.com/
2. 开通服务 → 创建 API Key
3. 充值 1 元即可
4. 编辑 `backend/.env`：
   ```env
   DASHSCOPE_API_KEY=sk-你的Key
   ```

📖 详细步骤：[ALIYUN_CONFIG.md](ALIYUN_CONFIG.md)

**选项 B: OpenAI（国际）**
1. 访问 https://platform.openai.com 注册
2. 充值 $5（约 35 元）
3. 创建 API Key
4. 编辑 `backend/.env`：
   ```env
   OPENAI_API_KEY=sk-proj-开头的字符串
   ```

### 步骤 3: 重启后端

关闭后端窗口，重新运行：
```bash
start-conda.bat
```

### 步骤 4: 测试

1. 访问 http://localhost:5173
2. 注册账号
3. 创建行程
4. 输入："我想去北京，3天，预算5000元"
5. 查看 AI 生成的行程

---

## 📋 其他配置

### 高德地图（可选）

1. 访问 https://lbs.amap.com 注册
2. 创建应用获取 Web 服务 Key
3. 编辑 `frontend/index.html`，替换 `YOUR_AMAP_KEY`

不配置地图不影响其他功能。

## 📚 更多文档

- [阿里云配置详解](ALIYUN_CONFIG.md)
- [快速开始指南](QUICKSTART.md)
- [部署到生产环境](DEPLOYMENT.md)

---

## 🔍 检查配置状态

运行状态检查脚本：
```bash
check-status.bat
```

---

## ❓ 常见问题

**Q: 必须配置吗？**
A: 是的，必须配置 Supabase 和 AI 服务才能使用。

**Q: 费用多少？**
A: Supabase 免费，阿里云最低 1 元，OpenAI 最低 $5。

**Q: 配置后需要重启吗？**
A: 是的，配置完需要重启后端。

---

## 🎉 配置完成后

你将拥有一个完整的 AI 旅行规划助手：
- 🎤 语音输入需求
- 🤖 AI 智能生成行程
- 🗺️ 地图展示景点
- 💰 费用管理
- ☁️ 云端同步

**开始配置吧！** 🚀
