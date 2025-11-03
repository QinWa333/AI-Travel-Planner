// 语音识别服务
// 支持两种方式：
// 1. 科大讯飞 WebAPI（推荐，需要配置 API Key）
// 2. 浏览器原生 Web Speech API（备用）

import xfyunSpeech from './xfyun-speech';

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.useXFYun = false;
    
    // 检查是否配置了科大讯飞
    if (import.meta.env.VITE_XFYUN_APP_ID) {
      this.useXFYun = true;
      console.log('使用科大讯飞语音识别');
    } else {
      console.log('使用浏览器原生语音识别');
      // 初始化浏览器原生语音识别
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'zh-CN';
      }
    }
  }

  isSupported() {
    if (this.useXFYun) {
      return xfyunSpeech.isSupported();
    }
    return this.recognition !== null;
  }

  startListening(onResult, onEnd, onError) {
    // 使用科大讯飞
    if (this.useXFYun) {
      xfyunSpeech.startListening(onResult, onEnd, onError);
      return;
    }

    // 使用浏览器原生
    if (!this.recognition) {
      onError?.('浏览器不支持语音识别');
      return;
    }

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      const isFinal = event.results[event.results.length - 1].isFinal;
      onResult?.(transcript, isFinal);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(event.error);
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      onError?.(error);
    }
  }

  getCurrentTranscript() {
    if (this.useXFYun) {
      return xfyunSpeech.getCurrentTranscript();
    }
    return '';
  }

  stopListening() {
    // 使用科大讯飞
    if (this.useXFYun) {
      xfyunSpeech.stopListening();
      return;
    }

    // 使用浏览器原生
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export default new SpeechService();
