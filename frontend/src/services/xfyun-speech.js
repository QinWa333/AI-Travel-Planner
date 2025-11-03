// 科大讯飞语音识别服务
import CryptoJS from 'crypto-js';

class XFYunSpeechService {
  constructor() {
    this.websocket = null;
    this.isListening = false;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.processor = null;
    this.resultText = ''; // 最终结果
    this.resultTextTemp = ''; // 临时结果
    this.hasCalledFinal = false; // 添加标志位
    
    // 科大讯飞配置（需要在环境变量中配置）
    this.config = {
      appId: import.meta.env.VITE_XFYUN_APP_ID || '',
      apiKey: import.meta.env.VITE_XFYUN_API_KEY || '',
      apiSecret: import.meta.env.VITE_XFYUN_API_SECRET || '',
      hostUrl: 'wss://iat-api.xfyun.cn/v2/iat'
    };
  }

  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  isConfigured() {
    return !!(this.config.appId && this.config.apiKey && this.config.apiSecret);
  }

  // 生成鉴权 URL
  getAuthUrl() {
    const url = new URL(this.config.hostUrl);
    const host = url.host;
    const path = url.pathname;
    const date = new Date().toUTCString();

    // 生成签名
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.config.apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);

    const authorizationOrigin = `api_key="${this.config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);

    return `${this.config.hostUrl}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
  }

  async startListening(onResult, onEnd, onError) {
    if (!this.isSupported()) {
      onError?.('浏览器不支持录音功能');
      return;
    }

    if (!this.isConfigured()) {
      onError?.('科大讯飞 API 未配置，请在 .env 文件中配置 VITE_XFYUN_APP_ID、VITE_XFYUN_API_KEY、VITE_XFYUN_API_SECRET');
      return;
    }

    try {
      this.isListening = true;
      this.resultText = '';
      this.resultTextTemp = '';
      this.hasCalledFinal = false; // 重置标志位

      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 创建 WebSocket 连接
      const authUrl = this.getAuthUrl();
      this.websocket = new WebSocket(authUrl);

      this.websocket.onopen = () => {
        console.log('WebSocket 连接成功');
        this.startRecording(stream, onResult, onError);
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // 打印原始数据，帮助调试
        console.log('科大讯飞原始返回:', JSON.stringify(data, null, 2));
        
        if (data.code !== 0) {
          console.error('识别错误:', data);
          onError?.(data.message);
          this.stopListening();
          return;
        }

        if (data.data && data.data.result) {
          const result = data.data.result;
          const ws = result.ws;
          
          // 提取文本
          let str = '';
          for (let i = 0; i < ws.length; i++) {
            str += ws[i].cw[0].w;
          }
          
          // 按照官方示例处理 pgs 字段
          if (result.pgs) {
            if (result.pgs === 'apd') {
              // 追加模式：将 resultTextTemp 同步给 resultText
              this.resultText = this.resultTextTemp;
            }
            // 将结果存储在 resultTextTemp 中
            this.resultTextTemp = this.resultText + str;
          } else {
            // 没有 pgs 字段，直接累加
            this.resultText = this.resultText + str;
          }
          
          // 判断是否是最终结果（status=2 表示结束）
          const isFinal = data.data.status === 2;
          
          if (isFinal) {
            // 确保只调用一次
            if (!this.hasCalledFinal) {
              this.hasCalledFinal = true;
              const finalResult = this.resultTextTemp || this.resultText;
              console.log('科大讯飞最终结果:', finalResult);
              onResult?.(finalResult, true);
              this.stopListening();
              onEnd?.();
            }
          }
          // 中间结果不调用回调
        }
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        onError?.('语音识别连接失败');
        this.stopListening();
      };

      this.websocket.onclose = () => {
        console.log('WebSocket 连接关闭');
        this.stopListening();
      };

    } catch (error) {
      console.error('启动录音失败:', error);
      onError?.(error.message);
      this.isListening = false;
    }
  }

  startRecording(stream, onResult, onError) {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(stream);
      
      // 创建音频处理器
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        if (!this.isListening || !this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const outputData = new Int16Array(inputData.length);
        
        // 转换为 16 位 PCM
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          outputData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // 发送音频数据
        if (this.websocket.readyState === WebSocket.OPEN) {
          this.websocket.send(JSON.stringify({
            data: {
              status: 1,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: this.arrayBufferToBase64(outputData.buffer)
            }
          }));
        }
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      // 发送开始帧
      const params = {
        common: {
          app_id: this.config.appId
        },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 2000,
          dwa: 'wpgs'
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw'
        }
      };

      this.websocket.send(JSON.stringify(params));

    } catch (error) {
      console.error('录音处理失败:', error);
      onError?.(error.message);
    }
  }

  getCurrentTranscript() {
    return this.resultTextTemp || this.resultText;
  }

  stopListening() {
    this.isListening = false;

    // 发送结束帧
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        data: {
          status: 2,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: ''
        }
      }));
    }

    // 清理资源
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // ArrayBuffer 转 Base64
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export default new XFYunSpeechService();
