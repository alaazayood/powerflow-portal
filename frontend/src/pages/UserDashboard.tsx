import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Chip, 
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  VpnKey as LicenseIcon,
  People as PeopleIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

interface DashboardStats {
  activeLicenses: number;
  totalSeats: number;
  seatsUsed: number;
  expiryDate: string;
  planName: string;
  customerName: string;
}

interface UserDashboardProps {
  stats: DashboardStats | null;
  setView: (view: 'overview' | 'licenses' | 'team' | 'settings') => void;
}

const StatCard = ({ title, value, subtext, icon, color }: any) => {
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

const UserDashboard: React.FC<UserDashboardProps> = ({ stats, setView }) => {
  const theme = useTheme();

  return (
    <Stack spacing={4}>
      {/* Welcome Banner */}
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="800">
          Welcome back, <Box component="span" sx={{ color: 'primary.main' }}>{stats?.customerName || 'User'}</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your licenses and download the latest software.
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

      {/* User Actions: Download & Licenses */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
        gap: 3,
        mt: 2
      }}>
        {/* Download App Card */}
        <Paper sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mb: 2, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
            <DownloadIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Download Desktop App</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
            Get the PowerFlow agent to start automating your tasks on Windows.
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ px: 4, py: 1.5, borderRadius: 50 }}>
            Download for Windows
          </Button>
        </Paper>

        {/* My Licenses Card */}
        <Paper sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
        }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mb: 2 }}>
            <LicenseIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>My Licenses</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
            View your purchased license keys and manage device activations.
          </Typography>
          <Button 
            variant="outlined" 
            color="success" 
            size="large" 
            endIcon={<ArrowIcon />}
            onClick={() => setView('licenses')}
            sx={{ px: 4, py: 1.5, borderRadius: 50 }}
          >
            View Available Keys
          </Button>
        </Paper>
      </Box>
    </Stack>
  );
};

export default UserDashboard;
