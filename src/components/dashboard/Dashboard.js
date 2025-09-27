import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  AccountBalance as BudgetIcon,
  Receipt as ExpenseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { budgetService, expenseService } from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [budgetsData, expensesData] = await Promise.all([
        budgetService.getBudgets(),
        expenseService.getAllExpenses(),
      ]);
      
      setBudgets(budgetsData);
      setExpenses(expensesData);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateRemainingBudget = () => {
    return calculateTotalBudget() - calculateTotalExpenses();
  };

  const getExpensesByCategory = () => {
    const categoryMap = {};
    expenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryMap).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const getMonthlyExpenses = () => {
    const monthlyMap = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
      monthlyMap[month] = (monthlyMap[month] || 0) + expense.amount;
    });
    
    return Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount,
    }));
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              ${value.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
            <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={fetchDashboardData}>
          Retry
        </Button>
      }>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Budget"
            value={calculateTotalBudget()}
            icon={<BudgetIcon sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expenses"
            value={calculateTotalExpenses()}
            icon={<ExpenseIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Remaining Budget"
            value={calculateRemainingBudget()}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color={calculateRemainingBudget() >= 0 ? "success.main" : "error.main"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Budgets"
            value={budgets.length}
            icon={<BudgetIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getExpensesByCategory()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getExpensesByCategory().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyExpenses()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            {expenses.length === 0 ? (
              <Typography color="textSecondary">
                No expenses recorded yet. Start by adding your first expense!
              </Typography>
            ) : (
              <Box>
                {expenses.slice(0, 5).map((expense, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < 4 ? '1px solid #e0e0e0' : 'none',
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{expense.category}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(expense.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="error.main">
                      -${expense.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
