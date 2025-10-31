import { useState, useEffect } from 'react';
import { Layout, Card, List, Button, message, Empty, Spin } from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import dayjs from 'dayjs';

const { Header, Content } = Layout;

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await tripsAPI.getAll();
      setTrips(response.data.data || []);
    } catch (error) {
      message.error('加载行程失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0 }}>🌍 AI 旅行规划师</h2>
        <div>
          <span style={{ marginRight: 20 }}>欢迎, {user.full_name || user.email}</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            退出
          </Button>
        </div>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <Card>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
            <h2>我的旅行计划</h2>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/create')}
            >
              创建新行程
            </Button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" />
            </div>
          ) : trips.length === 0 ? (
            <Empty 
              description="还没有旅行计划，快去创建一个吧！"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
              dataSource={trips}
              renderItem={(trip) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => navigate(`/trip/${trip.id}`)}
                    cover={
                      <div style={{ 
                        height: 200, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 48
                      }}>
                        🗺️
                      </div>
                    }
                  >
                    <Card.Meta
                      title={trip.title}
                      description={
                        <>
                          <p>📍 {trip.destination}</p>
                          <p>📅 {dayjs(trip.start_date).format('YYYY-MM-DD')} ~ {dayjs(trip.end_date).format('YYYY-MM-DD')}</p>
                          <p>💰 预算: ¥{trip.budget}</p>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
}
