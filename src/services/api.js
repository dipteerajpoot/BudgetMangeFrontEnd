import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  login: (email, password) => api.post('/api/users/login', { email, password }).then(res => res.data),
  signup: (name, email, password) => api.post('/api/users/signup', { name, email, password }).then(res => res.data),
  getProfile: () => api.get('/api/users/profile').then(res => res.data),
  verifyAccount: (email) => api.post('/api/users/verify', { email }).then(res => res.data),
};

// Budget Service
export const budgetService = {
  createBudget: (budgetData) => api.post('/api/budgets', budgetData).then(res => res.data),
  getBudgets: () => api.get('/api/budgets').then(res => res.data),
  getBudgetById: (id) => api.get(`/api/budgets/${id}`).then(res => res.data),
  updateBudget: (id, budgetData) => api.put(`/api/budgets/${id}`, budgetData).then(res => res.data),
  deleteBudget: (id) => api.delete(`/api/budgets/${id}`).then(res => res.data),
  getBudgetWithPrediction: (id) => api.get(`/api/budgets/${id}/prediction`).then(res => res.data),
};

// Expense Service
export const expenseService = {
  addExpense: (expenseData) => api.post('/api/expenses', expenseData).then(res => res.data),
  getExpensesByBudget: (budgetId) => api.get(`/api/expenses/budget/${budgetId}`).then(res => res.data),
  getAllExpenses: () => api.get('/api/expenses').then(res => res.data),
  updateExpense: (id, expenseData) => api.put(`/api/expenses/${id}`, expenseData).then(res => res.data),
  deleteExpense: (id) => api.delete(`/api/expenses/${id}`).then(res => res.data),
};

export default api;
