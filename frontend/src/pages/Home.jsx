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
              grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
              dataSource={trips}
              renderItem={(trip) => {
                // 根据目的地选择背景图片
                const getCoverImage = (destination) => {
                  const cityImages = {
                    '东京': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
                    '日本': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
                    '京都': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
                    '大阪': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800',
                    '北京': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
                    '上海': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800',
                    '成都': 'https://images.unsplash.com/photo-1590564863413-4b4e1a5c0f3e?w=800',
                    '西安': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800',
                    '杭州': 'https://images.unsplash.com/photo-1559564484-e48bf5f6c69e?w=800',
                    '广州': 'https://images.unsplash.com/photo-1601194266989-d5e5e4e0e0e0?w=800',
                    '深圳': 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800',
                    '重庆': 'https://images.unsplash.com/photo-1590564863413-4b4e1a5c0f3e?w=800',
                    '厦门': 'https://images.unsplash.com/photo-1590564863413-4b4e1a5c0f3e?w=800',
                    '三亚': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
                    '丽江': 'https://images.unsplash.com/photo-1590564863413-4b4e1a5c0f3e?w=800',
                  };
                  
                  for (const [city, image] of Object.entries(cityImages)) {
                    if (destination.includes(city)) {
                      return image;
                    }
                  }
                  
                  // 默认图片
                  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                };

                const days = dayjs(trip.end_date).diff(dayjs(trip.start_date), 'day') + 1;

                return (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      style={{ 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s'
                      }}
                      bodyStyle={{ padding: '16px' }}
                      cover={
                        <div style={{ 
                          height: 200, 
                          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${getCoverImage(trip.destination)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          color: '#fff',
                          padding: '20px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(255,255,255,0.9)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#1890ff'
                          }}>
                            {days} 天
                          </div>
                          <h3 style={{ 
                            margin: 0, 
                            color: 'white',
                            fontSize: '20px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}>
                            {trip.title}
                          </h3>
                        </div>
                      }
                    >
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          marginBottom: 8,
                          color: '#666'
                        }}>
                          <span style={{ fontSize: 16 }}>📍</span>
                          <span style={{ marginLeft: 8 }}>{trip.destination}</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          marginBottom: 8,
                          color: '#666',
                          fontSize: '13px'
                        }}>
                          <span>📅</span>
                          <span style={{ marginLeft: 8 }}>
                            {dayjs(trip.start_date).format('MM/DD')} - {dayjs(trip.end_date).format('MM/DD')}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ color: '#666', fontSize: '13px' }}>
                            <span>💰</span>
                            <span style={{ marginLeft: 8 }}>预算 ¥{trip.budget}</span>
                          </div>
                          <div style={{ color: '#1890ff', fontSize: '13px', fontWeight: 'bold' }}>
                            查看详情 →
                          </div>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
}
