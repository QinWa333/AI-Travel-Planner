# 🇨🇳 阿里云通义千问配置指南

## 为什么选择阿里云？

### ✅ 优势对比

| 特性 | 阿里云通义千问 | OpenAI GPT-4 |
|------|---------------|--------------|
| 🌍 访问 | 国内直连 | 需要国际网络 |
| 💰 价格 | ¥0.008/千tokens | ¥0.24/千tokens |
| 🚀 速度 | 快 | 较快 |
| 💳 支付 | 支付宝/微信 | 信用卡 |
| 💵 最低充值 | ¥1 | $5 (约¥35) |
| 📝 中文质量 | 优秀 | 良好 |

### 💰 费用对比
- **单次生成**: 阿里云 ¥0.016 vs OpenAI ¥0.42（节省 96%）
- **100次生成**: 阿里云 ¥1.6 vs OpenAI ¥42（节省 ¥40.4）

## 🚀 快速配置（5分钟）

### 步骤 1: 注册阿里云账号

1. 访问 https://www.aliyun.com
2. 点击右上角"免费注册"
3. 使用手机号注册（支持支付宝快速登录）

### 步骤 2: 开通通义千问服务

1. 访问 https://dashscope.console.aliyun.com/
2. 点击"开通 DashScope 服务"
3. 同意服务协议
4. 完成实名认证（如果还没有）

### 步骤 3: 获取 API Key

1. 进入控制台：https://dashscope.console.aliyun.com/
2. 点击左侧"API-KEY 管理"
3. 点击"创建新的 API-KEY"
4. 复制生成的 API Key（以 sk- 开头）

### 步骤 4: 充值

1. 点击左侧"账户管理"
2. 点击"充值"
3. 最低充值 1 元即可开始使用
4. 支持支付宝/微信支付

**费用参考：**
- qwen-turbo: ¥0.003/千tokens（最便宜）
- qwen-plus: ¥0.008/千tokens（推荐，性价比高）
- qwen-max: ¥0.04/千tokens（最强大）

### 步骤 5: 配置项目

编辑 `backend/.env` 文件：

```env
# 注释掉或删除 OpenAI 配置
# OPENAI_API_KEY=sk-your-openai-api-key

# 添加阿里云配置
DASHSCOPE_API_KEY=sk-你的阿里云API-Key
```

### 步骤 6: 重启后端

```bash
# 关闭后端窗口，重新运行
start-conda.bat
```

## ✅ 测试配置

1. 访问 http://localhost:5173
2. 登录账号
3. 创建行程，输入：
   ```
   我想去杭州，2天1夜，预算2000元，喜欢西湖和美食
   ```
4. 点击"生成行程"
5. 查看 AI 生成的结果

## 🎯 模型选择

项目默认使用 **qwen-plus**（推荐）

如果想更换模型，编辑 `backend/app/routers/ai.py`：

```python
def get_model_name():
    if hasattr(settings, 'dashscope_api_key') and settings.dashscope_api_key:
        return "qwen-turbo"  # 改为 qwen-turbo 或 qwen-max
    else:
        return "gpt-4-turbo-preview"
```

**模型对比：**

| 模型 | 价格 | 速度 | 质量 | 推荐场景 |
|------|------|------|------|----------|
| qwen-turbo | ⭐ | ⭐⭐⭐ | ⭐⭐ | 快速测试 |
| qwen-plus | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 日常使用（推荐）|
| qwen-max | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | 高质量需求 |



## ❓ 常见问题

**Q: 阿里云和 OpenAI 可以同时配置吗？**
A: 可以。项目会优先使用阿里云，如果没有配置阿里云才使用 OpenAI。

**Q: 生成质量有差异吗？**
A: qwen-plus 和 GPT-4 质量接近，qwen-max 更强。对于旅行规划场景，qwen-plus 完全够用。

**Q: 需要实名认证吗？**
A: 是的，阿里云服务需要实名认证。

**Q: 最低充值多少？**
A: 1 元即可，足够测试使用。

**Q: API Key 会过期吗？**
A: 不会过期，但可以在控制台禁用或删除。

**Q: 有免费额度吗？**
A: 新用户有一定的免费额度，具体查看控制台。

## 🔄 切换回 OpenAI

如果需要切换回 OpenAI，编辑 `backend/.env`：
```env
# 使用 OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# 注释掉阿里云
# DASHSCOPE_API_KEY=sk-your-dashscope-api-key
```

## 🔗 相关链接

- DashScope 控制台: https://dashscope.console.aliyun.com/
- 通义千问文档: https://help.aliyun.com/zh/dashscope/

## 🎉 配置完成

配置完成后，你就可以使用国内的 AI 服务了，无需担心网络问题！

**开始体验吧！** 🚀
