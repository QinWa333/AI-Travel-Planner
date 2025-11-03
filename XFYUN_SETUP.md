# 科大讯飞语音识别配置指南

## 为什么使用科大讯飞？

相比浏览器原生语音识别，科大讯飞有以下优势：

- ✅ **更高准确率**：专业的中文语音识别引擎
- ✅ **更好兼容性**：支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
- ✅ **更稳定**：不依赖浏览器实现
- ✅ **更多功能**：支持方言、专业词汇等

## 注册和获取 API Key

### 1. 注册账号

访问：https://console.xfyun.cn/

- 使用手机号注册
- 完成实名认证（需要身份证）

### 2. 创建应用

1. 登录后，进入控制台
2. 点击「语音听写（流式版）」
3. 点击「创建新应用」
4. 填写应用信息：
   - 应用名称：AI Travel Planner
   - 应用平台：WebAPI
   - 应用场景：旅游出行
5. 创建成功后，记录以下信息：
   - **APPID**
   - **APISecret**
   - **APIKey**

### 3. 免费额度

科大讯飞提供免费额度：
- 每日 500 次调用
- 每次最长 60 秒
- 足够个人项目使用

如需更多额度，可以购买套餐。

## 配置到项目

### 方法一：环境变量（推荐）

在项目根目录的 `.env` 文件中添加：

```env
# 科大讯飞语音识别
VITE_XFYUN_APP_ID=你的APPID
VITE_XFYUN_API_KEY=你的APIKey
VITE_XFYUN_API_SECRET=你的APISecret
```

### 方法二：前端环境变量

在 `frontend/.env` 文件中添加：

```env
VITE_XFYUN_APP_ID=你的APPID
VITE_XFYUN_API_KEY=你的APIKey
VITE_XFYUN_API_SECRET=你的APISecret
```

## 安装依赖

项目需要 `crypto-js` 来生成签名：

```bash
cd frontend
npm install crypto-js
```

## 重启项目

配置完成后，重启前端服务：

```bash
# 停止当前服务（Ctrl+C）

# 重新启动
npm run dev

# 或使用 Docker
docker-compose restart frontend
```

## 验证配置

1. 打开浏览器控制台（F12）
2. 访问创建行程或行程详情页
3. 点击「语音输入」按钮
4. 如果看到「使用科大讯飞语音识别」，说明配置成功
5. 如果看到「使用浏览器原生语音识别」，说明未配置或配置错误

## 测试语音识别

### 创建行程测试

1. 进入「创建新行程」页面
2. 点击「语音输入」按钮
3. 允许麦克风权限
4. 说话：「我想去北京玩5天，预算5000元，喜欢历史文化」
5. 停止录音
6. 查看识别结果是否准确

### 费用记录测试

1. 进入行程详情页
2. 切换到「费用管理」标签
3. 点击「语音记录费用」
4. 说话：「午餐花了80元」
5. 查看是否自动填充表单

## 常见问题

### Q1: 提示「科大讯飞 API 未配置」？

**A:** 检查 `.env` 文件中的配置是否正确，环境变量名必须以 `VITE_` 开头。

### Q2: 提示「WebSocket 连接失败」？

**A:** 
- 检查 APPID、APIKey、APISecret 是否正确
- 检查网络连接
- 确认应用状态是否正常（在讯飞控制台查看）

### Q3: 识别结果不准确？

**A:**
- 确保环境安静
- 说话清晰，语速适中
- 检查麦克风是否正常
- 可以在讯飞控制台调整识别参数

### Q4: 超出免费额度怎么办？

**A:**
- 查看讯飞控制台的用量统计
- 可以购买付费套餐
- 或者切换回浏览器原生识别（删除 .env 中的配置）

### Q5: 如何切换回浏览器原生识别？

**A:** 
删除或注释掉 `.env` 文件中的科大讯飞配置：

```env
# VITE_XFYUN_APP_ID=...
# VITE_XFYUN_API_KEY=...
# VITE_XFYUN_API_SECRET=...
```

然后重启服务。

## 技术细节

### 工作原理

1. 用户点击录音按钮
2. 获取麦克风权限
3. 建立 WebSocket 连接到讯飞服务器
4. 实时发送音频流（PCM 格式，16kHz）
5. 接收识别结果（流式返回）
6. 显示最终文本

### 安全性

- API Secret 仅在前端使用，用于生成签名
- 建议在生产环境使用后端代理，避免暴露密钥
- 可以设置 IP 白名单限制访问

### 性能优化

- 使用 WebSocket 保持长连接
- 音频数据实时传输，无需等待录音结束
- 支持流式识别，边说边显示结果

## 进阶配置

如果需要更高级的功能，可以修改 `frontend/src/services/xfyun-speech.js`：

```javascript
business: {
  language: 'zh_cn',      // 语言：zh_cn（中文）、en_us（英文）
  domain: 'iat',          // 领域：iat（通用）、medical（医疗）等
  accent: 'mandarin',     // 方言：mandarin（普通话）、cantonese（粤语）等
  vad_eos: 2000,         // 静音检测时长（毫秒）
  dwa: 'wpgs'            // 动态修正
}
```

## 参考资料

- [科大讯飞语音听写文档](https://www.xfyun.cn/doc/asr/voicedictation/API.html)
- [WebSocket API 说明](https://www.xfyun.cn/doc/asr/voicedictation/API.html#%E6%8E%A5%E6%94%B6%E6%B6%88%E6%81%AF)
- [错误码说明](https://www.xfyun.cn/document/error-code)

---

**配置完成后，记得重新构建 Docker 镜像！**

```bash
docker-compose build frontend
docker-compose up -d
```
