import { useState, useEffect } from 'react';
import { Layout, Card, Button, Tabs, message, Modal, Form, Input, Select, InputNumber, Spin, Popconfirm, Timeline, Tag, Space, Drawer, TimePicker } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
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
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDayIndex, setEditingDayIndex] = useState(null);
  const [editingActivityIndex, setEditingActivityIndex] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
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

  const handleEditActivity = (dayIndex, activityIndex, activity) => {
    setEditingDayIndex(dayIndex);
    setEditingActivityIndex(activityIndex);
    setEditingActivity(activity);
    editForm.setFieldsValue({
      title: activity.title,
      location: activity.location,
      description: activity.description,
      time: activity.time,
      duration: activity.duration,
      estimated_cost: activity.estimated_cost,
    });
    setEditDrawerVisible(true);
  };

  const handleSaveActivity = async (values) => {
    try {
      const updatedTrip = { ...trip };
      updatedTrip.itinerary.days[editingDayIndex].activities[editingActivityIndex] = {
        ...updatedTrip.itinerary.days[editingDayIndex].activities[editingActivityIndex],
        ...values
      };

      await tripsAPI.update(id, updatedTrip);
      setTrip(updatedTrip);
      message.success('活动已更新');
      setEditDrawerVisible(false);
      editForm.resetFields();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDeleteActivity = async (dayIndex, activityIndex) => {
    try {
      const updatedTrip = { ...trip };
      updatedTrip.itinerary.days[dayIndex].activities.splice(activityIndex, 1);

      await tripsAPI.update(id, updatedTrip);
      setTrip(updatedTrip);
      message.success('活动已删除');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const getMapLocations = () => {
    if (!trip?.itinerary?.days) {
      console.log('没有行程数据');
      return [];
    }

    const locations = [];
    const displayDay = selectedDay !== null ? [trip.itinerary.days[selectedDay]] : trip.itinerary.days;

    displayDay.forEach(day => {
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

  const getActivityIcon = (type) => {
    const icons = {
      '景点': '🏛️',
      '餐饮': '🍽️',
      '住宿': '🏨',
      '交通': '🚗',
      '购物': '🛍️',
      '娱乐': '🎭',
    };
    return icons[type] || '📍';
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
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{
        background: '#fff',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '80px'
      }}>
        <Space size="large" align="center" style={{ height: '100%' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            type="text"
            size="large"
          >
            返回
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, lineHeight: '1.2' }}>{trip?.title}</h2>
            <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.2' }}>
              📍 {trip?.destination} | 📅 {trip?.start_date} ~ {trip?.end_date} | 💰 预算 ¥{trip?.budget}
            </div>
          </div>
        </Space>

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
          >
            删除行程
          </Button>
        </Popconfirm>
      </Header>

      <Content style={{ padding: 0, display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* 左侧：地图主视图 */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <MapView locations={getMapLocations()} city={trip?.city} />
          </div>

          {/* 地图上的浮动信息卡片 */}
          <Card
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 300,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <h4 style={{ margin: '0 0 12px 0' }}>💰 预算概览</h4>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }}>
              ¥{trip?.budget}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              已支出: ¥{summary?.total || 0} | 剩余: ¥{(trip?.budget || 0) - (summary?.total || 0)}
            </div>
          </Card>

          {/* 天数选择器 */}
          <Card
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Space wrap>
              <Button
                type={selectedDay === null ? 'primary' : 'default'}
                onClick={() => setSelectedDay(null)}
              >
                全部
              </Button>
              {trip?.itinerary?.days?.map((day, index) => (
                <Button
                  key={index}
                  type={selectedDay === index ? 'primary' : 'default'}
                  onClick={() => setSelectedDay(index)}
                >
                  第 {day.day} 天
                </Button>
              ))}
            </Space>
          </Card>
        </div>

        {/* 右侧：行程时间轴 */}
        <div style={{
          width: 450,
          background: '#fff',
          overflowY: 'auto',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
        }}>
          <Tabs
            defaultActiveKey="itinerary"
            style={{ padding: '0 24px' }}
            items={[
              {
                key: 'itinerary',
                label: '行程详情',
                children: (
                  <div style={{ paddingBottom: 24 }}>
                    {trip?.itinerary?.days?.map((day, dayIndex) => (
                      <div key={day.day} style={{ marginBottom: 32 }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          marginBottom: 16
                        }}>
                          <h3 style={{ margin: 0, color: 'white' }}>第 {day.day} 天</h3>
                          <div style={{ fontSize: 14, opacity: 0.9 }}>{day.date}</div>
                        </div>

                        <Timeline
                          items={day.activities?.map((activity, activityIndex) => ({
                            dot: <div style={{ fontSize: 20 }}>{getActivityIcon(activity.type)}</div>,
                            children: (
                              <Card
                                size="small"
                                style={{ marginBottom: 12 }}
                                hoverable
                                actions={[
                                  <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditActivity(dayIndex, activityIndex, activity)}
                                  >
                                    编辑
                                  </Button>,
                                  <Popconfirm
                                    title="确定删除这个活动吗？"
                                    onConfirm={() => handleDeleteActivity(dayIndex, activityIndex)}
                                    okText="确定"
                                    cancelText="取消"
                                  >
                                    <Button
                                      type="text"
                                      danger
                                      icon={<DeleteOutlined />}
                                    >
                                      删除
                                    </Button>
                                  </Popconfirm>
                                ]}
                              >
                                <div style={{ marginBottom: 8 }}>
                                  <Tag color="blue">{activity.time}</Tag>
                                  <strong style={{ fontSize: 16 }}>{activity.title}</strong>
                                </div>
                                <div style={{ color: '#666', marginBottom: 8 }}>
                                  <EnvironmentOutlined /> {activity.location}
                                </div>
                                <p style={{ margin: '8px 0', color: '#666', fontSize: 14 }}>
                                  {activity.description}
                                </p>
                                <Space split="|" style={{ fontSize: 12, color: '#999' }}>
                                  <span><ClockCircleOutlined /> {activity.duration}</span>
                                  <span><DollarOutlined /> ¥{activity.estimated_cost}</span>
                                </Space>
                              </Card>
                            )
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                )
              },
              {
                key: 'expenses',
                label: '费用管理',
                children: (
                  <div style={{ paddingBottom: 24 }}>
                    <Card style={{ marginBottom: 16 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <VoiceInput onTranscript={handleVoiceExpense} placeholder="语音记录费用" />
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setExpenseModalVisible(true)}
                          block
                        >
                          手动添加费用
                        </Button>
                      </Space>
                    </Card>

                    <Card style={{ marginBottom: 16 }}>
                      <h4 style={{ marginBottom: 12 }}>分类统计</h4>
                      {Object.entries(summary?.by_category || {}).map(([category, amount]) => (
                        <div key={category} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <span>{category}</span>
                          <strong>¥{amount}</strong>
                        </div>
                      ))}
                    </Card>

                    <h4 style={{ marginBottom: 12 }}>费用记录</h4>
                    {expenses.map(expense => (
                      <Card key={expense.id} size="small" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Tag color="blue">{expense.category}</Tag>
                            <div style={{ marginTop: 4 }}>{expense.description}</div>
                            <small style={{ color: '#999' }}>{expense.expense_date}</small>
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                            ¥{expense.amount}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>
      </Content>

      {/* 编辑活动抽屉 */}
      <Drawer
        title="编辑活动"
        placement="right"
        width={500}
        onClose={() => {
          setEditDrawerVisible(false);
          editForm.resetFields();
        }}
        open={editDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setEditDrawerVisible(false)} icon={<CloseOutlined />}>
              取消
            </Button>
            <Button type="primary" onClick={() => editForm.submit()} icon={<SaveOutlined />}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={editForm} onFinish={handleSaveActivity} layout="vertical">
          <Form.Item name="title" label="活动名称" rules={[{ required: true, message: '请输入活动名称' }]}>
            <Input placeholder="例如：参观东京塔" />
          </Form.Item>
          <Form.Item name="location" label="地点" rules={[{ required: true, message: '请输入地点' }]}>
            <Input placeholder="例如：东京都港区芝公园4-2-8" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} placeholder="活动详细描述..." />
          </Form.Item>
          <Form.Item name="time" label="时间" rules={[{ required: true, message: '请输入时间' }]}>
            <Input placeholder="例如：09:00" />
          </Form.Item>
          <Form.Item name="duration" label="时长">
            <Input placeholder="例如：2小时" />
          </Form.Item>
          <Form.Item name="estimated_cost" label="预估费用">
            <InputNumber style={{ width: '100%' }} min={0} prefix="¥" placeholder="0" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 添加费用弹窗 */}
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
    </Layout >
  );
}
