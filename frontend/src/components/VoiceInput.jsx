import { useState } from 'react';
import { Button, message } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import speechService from '../services/speech';

export default function VoiceInput({ onTranscript, placeholder = "点击麦克风开始语音输入" }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartListening = () => {
    if (!speechService.isSupported()) {
      message.error('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器');
      return;
    }

    setIsListening(true);
    setTranscript('');

    speechService.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          onTranscript?.(text);
        }
      },
      () => {
        setIsListening(false);
      },
      (error) => {
        setIsListening(false);
        message.error(`语音识别错误: ${error}`);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    if (transcript) {
      onTranscript?.(transcript);
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
          正在录音... {transcript}
        </span>
      )}
    </div>
  );
}
