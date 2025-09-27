import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BudgetIcon,
  Receipt as ExpenseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { budgetService, expenseService } from '../../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalBudgets: 0,
    totalExpenses: 0,
    totalBudgetAmount: 0,
    totalExpenseAmount: 0,
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const [budgets, expenses] = await Promise.all([
        budgetService.getBudgets(),
        expenseService.getAllExpenses(),
      ]);

      const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
      const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      setStats({
        totalBudgets: budgets.length,
        totalExpenses: expenses.length,
        totalBudgetAmount,
        totalExpenseAmount,
      });
    } catch (error) {
      setError('Failed to load user statistics');
      console.error('Stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                mx: 'auto',
                mb: 2,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {user?.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Paper>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Account Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Budgets"
                value={stats.totalBudgets}
                icon={<BudgetIcon sx={{ fontSize: 40 }} />}
                color="primary.main"
                subtitle="Budget plans created"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Expenses"
                value={stats.totalExpenses}
                icon={<ExpenseIcon sx={{ fontSize: 40 }} />}
                color="error.main"
                subtitle="Expenses recorded"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Budget Amount"
                value={`$${stats.totalBudgetAmount.toLocaleString()}`}
                icon={<BudgetIcon sx={{ fontSize: 40 }} />}
                color="success.main"
                subtitle="Allocated budget"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Expense Amount"
                value={`$${stats.totalExpenseAmount.toLocaleString()}`}
                icon={<ExpenseIcon sx={{ fontSize: 40 }} />}
                color="warning.main"
                subtitle="Total spent"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Account Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user?.name || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Status"
                  value={user?.isVerified ? 'Verified' : 'Unverified'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Member Since"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Financial Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="success.main">
                    ${(stats.totalBudgetAmount - stats.totalExpenseAmount).toLocaleString()}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Remaining Budget
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary.main">
                    {stats.totalBudgetAmount > 0 ? 
                      ((stats.totalExpenseAmount / stats.totalBudgetAmount) * 100).toFixed(1) : 0}%
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Budget Used
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="info.main">
                    {stats.totalExpenses > 0 ? 
                      (stats.totalExpenseAmount / stats.totalExpenses).toFixed(0) : 0}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Avg. Expense
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
