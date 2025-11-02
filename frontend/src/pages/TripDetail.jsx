import { useState, useEffect } from 'react';
import { Layout, Card, Button, Tabs, message, Modal, Form, Input, Select, InputNumber, Spin, Popconfirm } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { tripsAPI, expensesAPI, aiAPI } from '../services/api';
import MapView from '../components/MapView';
import VoiceInput from '../components/VoiceInput';
import dayjs from 'dayjs';

const { Header, Content } = Layout;

export default function TripDetail() {
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    try {
      console.log('加载行程详情，ID:', id);
      const [tripRes, expensesRes, summaryRes] = await Promise.all([
        tripsAPI.getById(id),
        expensesAPI.getByTrip(id),
        expensesAPI.getSummary(id)
      ]);
      console.log('行程数据:', tripRes.data);
      console.log('费用数据:', expensesRes.data);
      setTrip(tripRes.data.data);
      setExpenses(expensesRes.data.data || []);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error('加载失败:', error);
      message.error('加载失败: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await tripsAPI.delete(id);
      message.success('行程已删除');
      navigate('/');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleVoiceExpense = async (text) => {
    try {
      const response = await aiAPI.parseExpense(text);
      const expenseData = response.data.data;
      
      form.setFieldsValue({
        category: expenseData.category,
        amount: expenseData.amount,
        description: expenseData.description,
        expense_date: expenseData.date
      });
      
      setExpenseModalVisible(true);
    } catch (error) {
      message.error('语音解析失败');
    }
  };

  const handleAddExpense = async (values) => {
    try {
      await expensesAPI.create({
        trip_id: id,
        ...values
      });
      message.success('费用记录成功');
      setExpenseModalVisible(false);
      form.resetFields();
      loadTripData();
    } catch (error) {
      message.error('记录失败');
    }
  };

  const getMapLocations = () => {
    if (!trip?.itinerary?.days) {
      console.log('没有行程数据');
      return [];
    }
    
    const locations = [];
    trip.itinerary.days.forEach(day => {
      day.activities?.forEach(activity => {
        if (activity.type !== '交通') {
          locations.push({
            title: activity.title,
            address: activity.location,
            location: activity.location,
            description: activity.description,
            time: activity.time,
            estimated_cost: activity.estimated_cost
          });
        }
      });
    });
    console.log('提取的地图位置:', locations);
    return locations;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <h2>行程不存在或加载失败</h2>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          type="text"
        >
          返回
        </Button>
        
        <Popconfirm
          title="删除行程"
          description="确定要删除这个行程吗？此操作无法撤销。"
          onConfirm={handleDeleteTrip}
          okText="确定"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button 
            icon={<DeleteOutlined />} 
            danger
            type="primary"
          >
            删除行程
          </Button>
        </Popconfirm>
      </Header>
      
      <Content style={{ padding: '30px 50px' }}>
        <h1>{trip?.title}</h1>
        <p>📍 {trip?.destination} | 📅 {trip?.start_date} ~ {trip?.end_date} | 💰 预算: ¥{trip?.budget}</p>

        <Tabs
          items={[
            {
              key: 'map',
              label: '地图视图',
              children: (
                <Card>
                  <MapView locations={getMapLocations()} city={trip?.city} />
                </Card>
              )
            },
            {
              key: 'itinerary',
              label: '行程详情',
              children: (
                <div>
                  {trip?.itinerary?.days?.map((day) => (
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
                </div>
              )
            },
            {
              key: 'expenses',
              label: '费用管理',
              children: (
                <div>
                  <Card style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div>
                        <h3>总支出: ¥{summary?.total || 0}</h3>
                        <p>预算剩余: ¥{(trip?.budget || 0) - (summary?.total || 0)}</p>
                      </div>
                      <div>
                        <VoiceInput onTranscript={handleVoiceExpense} placeholder="语音记录费用" />
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={() => setExpenseModalVisible(true)}
                          style={{ marginLeft: 10 }}
                        >
                          手动添加
                        </Button>
                      </div>
                    </div>
                    
                    <h4>分类统计</h4>
                    {Object.entries(summary?.by_category || {}).map(([category, amount]) => (
                      <p key={category}>{category}: ¥{amount}</p>
                    ))}
                  </Card>

                  <Card title="费用记录">
                    {expenses.map(expense => (
                      <div key={expense.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <strong>{expense.category}</strong> - {expense.description}
                            <br />
                            <small>{expense.expense_date}</small>
                          </div>
                          <div style={{ fontSize: 18, color: '#ff4d4f' }}>
                            ¥{expense.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )
            }
          ]}
        />

        <Modal
          title="添加费用"
          open={expenseModalVisible}
          onCancel={() => {
            setExpenseModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleAddExpense} layout="vertical">
            <Form.Item name="category" label="类别" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="交通">交通</Select.Option>
                <Select.Option value="住宿">住宿</Select.Option>
                <Select.Option value="餐饮">餐饮</Select.Option>
                <Select.Option value="门票">门票</Select.Option>
                <Select.Option value="购物">购物</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} prefix="¥" />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input />
            </Form.Item>
            <Form.Item name="expense_date" label="日期" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
