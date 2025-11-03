import { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import speechService from '../services/speech';

export default function VoiceInput({ onTranscript, placeholder = "点击麦克风开始语音输入" }) {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);

  // 清理函数
  useEffect(() => {
    return () => {
      if (isListeningRef.current) {
        speechService.stopListening();
      }
    };
  }, []);

  const handleStartListening = () => {
    if (!speechService.isSupported()) {
      message.error('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器');
      return;
    }

    setIsListening(true);
    isListeningRef.current = true;

    speechService.startListening(
      (text, isFinal) => {
        // 只在最终结果时调用
        if (isFinal && isListeningRef.current) {
          console.log('收到最终结果:', text);
          isListeningRef.current = false;
          setIsListening(false);
          onTranscript?.(text);
        }
      },
      () => {
        // 录音结束
        isListeningRef.current = false;
        setIsListening(false);
      },
      (error) => {
        isListeningRef.current = false;
        setIsListening(false);
        message.error(`语音识别错误: ${error}`);
      }
    );
  };

  const handleStopListening = () => {
    const finalText = speechService.getCurrentTranscript?.();
    
    speechService.stopListening();
    isListeningRef.current = false;
    setIsListening(false);
    
    if (finalText) {
      console.log('手动停止，最终结果:', finalText);
      onTranscript?.(finalText);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Button
        type={isListening ? 'primary' : 'default'}
        danger={isListening}
        icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
        onClick={isListening ? handleStopListening : handleStartListening}
        size="large"
      >
        {isListening ? '停止录音' : '语音输入'}
      </Button>
      {isListening && (
        <span style={{ color: '#ff4d4f', animation: 'pulse 1.5s infinite' }}>
          🎤 正在录音，请说话...
        </span>
      )}
    </div>
  );
}
