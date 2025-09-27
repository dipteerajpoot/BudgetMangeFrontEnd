import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (email, password) => api.post('/user/login', { email, password }).then(res => res.data),
  signup: (name, email, password) => api.post('/user/signup', { name, email, password }).then(res => res.data),
  getProfile: () => api.get('/user/profile').then(res => res.data),
  verifyAccount: (email) => api.post('/user/verify', { email }).then(res => res.data),
};

// Budget Service
export const budgetService = {
  createBudget: (budgetData) => api.post('/budget', budgetData).then(res => res.data),
  getBudgets: () => api.get('/budget').then(res => res.data),
  getBudgetById: (id) => api.get(`/budget/${id}`).then(res => res.data),
  updateBudget: (id, budgetData) => api.put(`/budget/${id}`, budgetData).then(res => res.data),
  deleteBudget: (id) => api.delete(`/budget/${id}`).then(res => res.data),
  getBudgetWithPrediction: (id) => api.get(`/budget/${id}/prediction`).then(res => res.data),
};

// Expense Service
export const expenseService = {
  addExpense: (expenseData) => api.post('/expense', expenseData).then(res => res.data),
  getExpensesByBudget: (budgetId) => api.get(`/expense/budget/${budgetId}`).then(res => res.data),
  getAllExpenses: () => api.get('/expense').then(res => res.data),
  updateExpense: (id, expenseData) => api.put(`/expense/${id}`, expenseData).then(res => res.data),
  deleteExpense: (id) => api.delete(`/expense/${id}`).then(res => res.data),
};

export default api;
