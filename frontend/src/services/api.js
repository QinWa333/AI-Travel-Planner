import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// AI 生成相关
export const aiAPI = {
  generateTrip: (prompt) => api.post('/api/ai/generate-trip', { prompt }),
  parseExpense: (prompt) => api.post('/api/ai/parse-expense', { prompt }),
};

// 行程相关
export const tripsAPI = {
  create: (data) => api.post('/api/trips/', data),
  getAll: () => api.get('/api/trips/'),
  getById: (id) => api.get(`/api/trips/${id}`),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
};

// 费用相关
export const expensesAPI = {
  create: (data) => api.post('/api/expenses/', data),
  getByTrip: (tripId) => api.get(`/api/expenses/trip/${tripId}`),
  getSummary: (tripId) => api.get(`/api/expenses/trip/${tripId}/summary`),
  delete: (id) => api.delete(`/api/expenses/${id}`),
};

export default api;
