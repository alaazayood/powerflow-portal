import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Chip,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  VpnKey as LicenseIcon,
  Timeline as TimelineIcon,
  Star as StarIcon
} from '@mui/icons-material';

interface DashboardStats {
  activeLicenses: number;
  totalSeats: number;
  seatsUsed: number;
  expiryDate: string;
  planName: string;
  customerName: string;
}

interface AdminDashboardProps {
  stats: DashboardStats | null;
  setView: (view: 'overview' | 'licenses' | 'team' | 'settings') => void;
}

const StatCard = ({ title, value, subtext, icon, color }: any) => {
  const theme = useTheme();
  return (
    <Paper sx={{ 
      p: 3, 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: -20, 
        right: -20, 
        width: 100, 
        height: 100, 
        borderRadius: '50%', 
        bgcolor: alpha(color, 0.1),
        zIndex: 0
      }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, position: 'relative', zIndex: 1 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Avatar variant="rounded" sx={{ bgcolor: alpha(color, 0.1), color: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
      
      {subtext && (
        <Typography variant="body2" color="text.secondary" sx={{ position: 'relative', zIndex: 1 }}>
          {subtext}
        </Typography>
      )}
    </Paper>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, setView }) => {
  const theme = useTheme();

  return (
    <Stack spacing={4}>
      {/* Welcome Banner */}
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="800">
          Welcome back, <Box component="span" sx={{ color: 'primary.main' }}>{stats?.customerName || 'Admin'}</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your organization today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        <StatCard 
          title="Active Licenses" 
          value={stats?.activeLicenses || 0} 
          icon={<LicenseIcon />} 
          color={theme.palette.primary.main}
          subtext="Valid keys currently in use"
        />
        
        <StatCard 
          title="Seats Usage" 
          value={`${stats?.seatsUsed || 0}/${stats?.totalSeats || 0}`} 
          icon={<PeopleIcon />} 
          color={theme.palette.secondary.main}
          subtext="Devices activated across all keys"
        />
        
        <StatCard 
          title="Current Plan" 
          value={stats?.planName || 'Free'} 
          icon={<StarIcon />} 
          color={theme.palette.warning.main}
          subtext={`Expires: ${stats?.expiryDate ? new Date(stats.expiryDate).toLocaleDateString() : 'Never'}`}
        />
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddIcon />} 
            onClick={() => setView('licenses')}
            sx={{ px: 4, py: 1.5 }}
          >
            Buy New License
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            startIcon={<PeopleIcon />} 
            onClick={() => setView('team')}
            sx={{ px: 4, py: 1.5 }}
          >
            Invite Team Member
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AdminDashboard;
