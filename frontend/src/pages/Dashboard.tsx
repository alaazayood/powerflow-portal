import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Container,
  Paper,
  Button,
  Stack,
  Chip,
  Avatar,
  TextField,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VpnKey as LicenseIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  CloudDownload as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import LicensesPage from './LicensesPage';
import TeamPage from './TeamPage';

const drawerWidth = 240;

interface DashboardStats {
  activeLicenses: number;
  totalSeats: number;
  seatsUsed: number;
  expiryDate: string; // ISO date
  planName: string;
  customerName: string;
  customerId: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState<'overview' | 'licenses' | 'team' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Change Password State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/auth/profile');
        setStats({
          activeLicenses: 1,
          totalSeats: 5,
          seatsUsed: 2,
          expiryDate: '2025-12-31T00:00:00Z',
          planName: 'Pro Plan',
          customerName: response.data.user.company_name || 'My Organization',
          customerId: response.data.user.customer_id
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'licenses':
        return <LicensesPage />;
      case 'team':
        return <TeamPage />;
      case 'settings':
        return (
          <Box maxWidth="sm">
            <Typography variant="h5" gutterBottom>Change Password</Typography>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={3}>
                {passwordMessage && (
                  <Alert severity={passwordMessage.type}>{passwordMessage.text}</Alert>
                )}
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
                <Button variant="contained" onClick={handleChangePassword}>
                  Update Password
                </Button>
              </Stack>
            </Paper>
          </Box>
        );
      default:
        return (
          <Stack spacing={3}>
            {/* Welcome Banner */}
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', bgcolor: '#e3f2fd' }}>
              <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                Welcome back, {stats?.customerName}!
              </Typography>
              <Typography variant="body1">
                Here is what's happening with your licenses today.
              </Typography>
            </Paper>

            {/* Stats Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
              gap: 3 
            }}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography color="textSecondary" gutterBottom>Active Licenses</Typography>
                <Typography variant="h3" color="primary">{stats?.activeLicenses}</Typography>
              </Paper>
              
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography color="textSecondary" gutterBottom>Seats Used</Typography>
                <Typography variant="h3">
                  {stats?.seatsUsed} <Typography component="span" color="textSecondary">/ {stats?.totalSeats}</Typography>
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography color="textSecondary" gutterBottom>Plan Status</Typography>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={1}>
                  <Chip label={stats?.planName} color="success" />
                  <Typography variant="body2" color="textSecondary">
                    Expires {stats?.expiryDate ? new Date(stats.expiryDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Stack>
              </Paper>
            </Box>

            {/* User Dashboard: Download & Licenses */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
              gap: 3,
              mt: 3
            }}>
              {/* Download App Card */}
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.light', mb: 2 }}>
                  <DownloadIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>Download Desktop App</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get the PowerFlow agent to start automating your tasks.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                  Download for Windows
                </Button>
              </Paper>

              {/* My Licenses Card */}
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'success.light', mb: 2 }}>
                  <LicenseIcon sx={{ fontSize: 30, color: 'success.main' }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>My Licenses</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use one of these keys to activate your app.
                </Typography>
                <Button variant="outlined" onClick={() => setView('licenses')}>
                  View Available Keys
                </Button>
              </Paper>
            </Box>

            {/* Quick Actions - Only for Admins */}
            {['admin', 'owner', 'super_admin'].includes(user?.role || '') && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Quick Actions</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setView('licenses')}>
                    Buy New License
                  </Button>
                  <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => setView('team')}>
                    Invite User
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PowerFlow Portal
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={view === 'overview'} onClick={() => setView('overview')}>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={view === 'licenses'} onClick={() => setView('licenses')}>
                <ListItemIcon><LicenseIcon /></ListItemIcon>
                <ListItemText primary="Licenses" />
              </ListItemButton>
            </ListItem>
            {['admin', 'owner', 'super_admin'].includes(user?.role || '') && (
              <ListItem disablePadding>
                <ListItemButton selected={view === 'team'} onClick={() => setView('team')}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Team" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton selected={view === 'settings'} onClick={() => setView('settings')}>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;