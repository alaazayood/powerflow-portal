import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Stack,
  TextField,
  Alert
} from '@mui/material';
import api from '../services/api';

const SettingsPage: React.FC = () => {
  // Change Password State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 4 }}>
        Account Settings
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Security
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage your password and account security preferences.
        </Typography>

        <Stack spacing={3} maxWidth="sm">
          {passwordMessage && (
            <Alert severity={passwordMessage.type} sx={{ borderRadius: 2 }}>
              {passwordMessage.text}
            </Alert>
          )}
          
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>Current Password</Typography>
            <TextField
              type="password"
              fullWidth
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>New Password</Typography>
            <TextField
              type="password"
              fullWidth
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>Confirm New Password</Typography>
            <TextField
              type="password"
              fullWidth
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>

          <Box sx={{ pt: 2 }}>
            <Button 
                variant="contained" 
                onClick={handleChangePassword}
                size="large"
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
                Update Password
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
