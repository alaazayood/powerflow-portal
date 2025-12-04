import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Stack,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Business as BusinessIcon, 
  Email as EmailIcon, 
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Personal Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              color: 'primary.main',
              fontSize: '3rem',
              mb: 2,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {user?.first_name} {user?.last_name}
          </Typography>
          <Chip 
            label={user?.role?.toUpperCase()} 
            sx={{ 
              mt: 1.5, 
              fontWeight: 700, 
              px: 1,
              bgcolor: alpha(theme.palette.secondary.main, 0.1), 
              color: 'secondary.main' 
            }} 
          />
        </Box>

        <Stack spacing={3} maxWidth="sm" mx="auto">
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
              <EmailIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" fontWeight="600">
                Email Address
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ pl: 4, fontSize: '1.1rem' }}>
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
              <BusinessIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" fontWeight="600">
                Company / Organization
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ pl: 4, fontSize: '1.1rem' }}>
              {user?.company_name || 'Individual Account'}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
              <BadgeIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" fontWeight="600">
                Customer ID
              </Typography>
            </Stack>
            <Typography variant="body1" fontFamily="monospace" sx={{ pl: 4, fontSize: '1.1rem' }}>
              #{user?.company_id || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
