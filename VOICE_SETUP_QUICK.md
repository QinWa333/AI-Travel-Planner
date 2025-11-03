# 🎤 语音识别快速配置（5分钟）

## 当前状态

项目支持两种语音识别方式：

1. **浏览器原生**（默认）- 免费，但仅支持 Chrome/Edge
2. **科大讯飞**（推荐）- 更准确，支持所有浏览器

## 快速开始（使用科大讯飞）

### 1. 注册科大讯飞（2分钟）

访问：https://console.xfyun.cn/

- 手机号注册
- 完成实名认证

### 2. 创建应用（1分钟）

1. 进入控制台
2. 选择「语音听写（流式版）」
3. 创建应用，获取：
   - APPID
   - APIKey
   - APISecret

### 3. 配置项目（1分钟）

在项目根目录的 `.env` 文件中添加：

```env
VITE_XFYUN_APP_ID=你的APPID
VITE_XFYUN_API_KEY=你的APIKey
VITE_XFYUN_API_SECRET=你的APISecret
```

### 4. 安装依赖（1分钟）

```bash
cd frontend
npm install crypto-js
```

### 5. 重启服务

```bash
# 如果使用 npm
cd frontend
npm run dev

# 如果使用 Docker
docker-compose restart frontend
```

## 验证

打开浏览器控制台，应该看到：

```
使用科大讯飞语音识别
```

## 不想配置？

删除 `.env` 中的科大讯飞配置，项目会自动使用浏览器原生语音识别（仅支持 Chrome/Edge）。

## 详细文档

查看 `XFYUN_SETUP.md` 了解更多。
