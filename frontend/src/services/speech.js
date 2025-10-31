// 语音识别服务（使用浏览器原生 Web Speech API）
class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'zh-CN';
    }
  }

  isSupported() {
    return this.recognition !== null;
  }

  startListening(onResult, onEnd, onError) {
    if (!this.recognition) {
      onError?.(new Error('浏览器不支持语音识别'));
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

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export default new SpeechService();
