import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
  Avatar,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Mail as MailIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { inviteService, Invitation } from '../services/inviteService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

const TeamPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.users);

      // Fetch Pending Invites
      const invites = await inviteService.getPendingInvites();
      setInvitations(invites);
    } catch (err) {
      console.error('Failed to fetch team data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async () => {
    setInviteLoading(true);
    setError('');
    setSuccess('');
    try {
      await inviteService.sendInvite(inviteEmail);
      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setOpenInvite(false);
      fetchData(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
     return (
       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
         <CircularProgress size={40} thickness={4} />
       </Box>
     );
   }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Team Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your team access and roles.
          </Typography>
        </Box>
        {['admin', 'owner', 'super_admin'].includes(user?.role || '') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenInvite(true)}
            size="large"
            sx={{ 
              borderRadius: 3,
              px: 3,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
            }}
          >
            Invite Member
          </Button>
        )}
      </Stack>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' }}>
                      {user.firstName[0]?.toUpperCase()}
                    </Avatar>
                    <Typography fontWeight="600">
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    icon={user.role === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                    label={user.role.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      fontWeight: 700,
                      bgcolor: user.role === 'admin' ? alpha(theme.palette.primary.main, 0.1) : 'action.hover',
                      color: user.role === 'admin' ? 'primary.main' : 'text.secondary',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={user.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    color={user.isActive ? 'success' : 'error'} 
                    variant="outlined"
                    size="small" 
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Stack alignItems="center" spacing={2}>
                        <PersonIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography color="text.secondary">No team members found.</Typography>
                      </Stack>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {invitations.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
            Pending Invitations
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: alpha(theme.palette.warning.main, 0.02), border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}` }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Sent At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', width: 32, height: 32 }}>
                          <MailIcon fontSize="small" />
                        </Avatar>
                        <Typography>{invite.email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{new Date(invite.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label="Pending Acceptance" color="warning" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Invite Modal */}
      <Dialog 
        open={openInvite} 
        onClose={() => setOpenInvite(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>Invite New Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Send an email invitation to join your team.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenInvite(false)} size="large" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            onClick={handleInvite} 
            variant="contained" 
            disabled={inviteLoading || !inviteEmail}
            size="large"
            sx={{ borderRadius: 2, px: 4 }}
          >
            {inviteLoading ? 'Sending...' : 'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamPage;
