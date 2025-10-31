import { useState } from 'react';
import { Layout, Card, Input, Button, message, Steps, Space } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VoiceInput from '../components/VoiceInput';
import { aiAPI, tripsAPI } from '../services/api';

const { Header, Content } = Layout;
const { TextArea } = Input;

export default function CreateTrip() {
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const navigate = useNavigate();

  const handleVoiceTranscript = (text) => {
    setPrompt(text);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning('请输入或说出您的旅行需求');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateTrip(prompt);
      setGeneratedTrip(response.data.data);
      setStep(1);
      message.success('行程生成成功！');
    } catch (error) {
      message.error(error.response?.data?.detail || 'AI 生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await tripsAPI.create(generatedTrip);
      message.success('行程保存成功！');
      navigate('/');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          type="text"
        >
          返回
        </Button>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <Card style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Steps
            current={step}
            items={[
              { title: '描述需求' },
              { title: '查看行程' },
              { title: '保存' }
            ]}
            style={{ marginBottom: 40 }}
          />

          {step === 0 && (
            <div>
              <h2>告诉我您的旅行计划</h2>
              <p style={{ color: '#666', marginBottom: 20 }}>
                例如："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
              </p>
              
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <TextArea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="在这里输入您的旅行需求，或使用下方的语音输入..."
                  rows={6}
                  style={{ fontSize: 16 }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                  <Button
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    onClick={handleGenerate}
                    loading={loading}
                  >
                    生成行程
                  </Button>
                </div>
              </Space>
            </div>
          )}

          {step === 1 && generatedTrip && (
            <div>
              <h2>{generatedTrip.title}</h2>
              <div style={{ marginBottom: 20 }}>
                <p><strong>目的地:</strong> {generatedTrip.destination}</p>
                <p><strong>日期:</strong> {generatedTrip.start_date} ~ {generatedTrip.end_date}</p>
                <p><strong>预算:</strong> ¥{generatedTrip.budget}</p>
                <p><strong>人数:</strong> {generatedTrip.travelers}人</p>
              </div>

              <h3>行程安排</h3>
              {generatedTrip.itinerary?.days?.map((day) => (
                <Card key={day.day} style={{ marginBottom: 20 }} title={`第 ${day.day} 天 - ${day.date}`}>
                  {day.activities?.map((activity, idx) => (
                    <div key={idx} style={{ marginBottom: 15, paddingLeft: 20, borderLeft: '3px solid #1890ff' }}>
                      <h4>{activity.time} - {activity.title}</h4>
                      <p>📍 {activity.location}</p>
                      <p>{activity.description}</p>
                      <p><strong>预估费用:</strong> ¥{activity.estimated_cost} | <strong>时长:</strong> {activity.duration}</p>
                    </div>
                  ))}
                </Card>
              ))}

              <h3>预算明细</h3>
              <Card>
                {Object.entries(generatedTrip.budget_breakdown || {}).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> ¥{value}
                  </p>
                ))}
              </Card>

              <div style={{ marginTop: 30, textAlign: 'center' }}>
                <Space>
                  <Button onClick={() => setStep(0)}>重新生成</Button>
                  <Button type="primary" size="large" onClick={handleSave} loading={loading}>
                    保存行程
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}
