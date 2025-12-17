import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Chip,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import { 
  VpnKey as LicenseIcon, 
  Add as AddIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { licenseService, License } from '../services/licenseService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LicensesPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Purchase Dialog State
  const [openPurchase, setOpenPurchase] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    planType: 'yearly' as 'yearly' | '3years' | 'floating',
    seats: 1,
    phoneNumber: ''
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError('');
      const licensesData = await licenseService.getAllLicenses();
      setLicenses(licensesData);
    } catch (err) {
      setError('Failed to load licenses');
      console.error('Error fetching licenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchaseLoading(true);
      setError('');

      await licenseService.purchaseLicense({
        planType: purchaseData.planType,
        seats: Number(purchaseData.seats),
        phoneNumber: purchaseData.phoneNumber
      });

      setOpenPurchase(false);
      fetchLicenses(); // Refresh list
      // Reset form
      setPurchaseData({ planType: 'yearly', seats: 1, phoneNumber: '' });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to purchase license');
    } finally {
      setPurchaseLoading(false);
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
            License Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your software licenses and activations.
          </Typography>
        </Box>
        {['admin', 'owner', 'super_admin'].includes(user?.role || '') && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenPurchase(true)}
            size="large"
            sx={{ 
              borderRadius: 3,
              px: 3,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
            }}
          >
            Purchase New License
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>License Key</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 32, height: 32 }}>
                      <LicenseIcon fontSize="small" />
                    </Avatar>
                    <Typography fontFamily="monospace" fontWeight="600" sx={{ letterSpacing: 1 }}>
                      {license.key}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={license.type.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      fontWeight: 700, 
                      bgcolor: alpha(theme.palette.info.main, 0.1), 
                      color: 'info.main',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="600">{license.seatNumber}</Typography>
                </TableCell>
                <TableCell>{new Date(license.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TimerIcon fontSize="small" color="action" />
                    <Typography>{new Date(license.expiryDate).toLocaleDateString()}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={license.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={license.isActive ? 'Active' : 'Inactive'}
                    color={license.isActive ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {licenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Stack alignItems="center" spacing={2}>
                    <LicenseIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                    <Typography color="text.secondary">
                      No licenses found. Purchase one to get started!
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Purchase Dialog */}
      <Dialog 
        open={openPurchase} 
        onClose={() => setOpenPurchase(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>Purchase License</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a plan that suits your needs.
          </Typography>
          <Stack spacing={3}>
            <TextField
              select
              fullWidth
              label="Plan Type"
              value={purchaseData.planType}
              onChange={(e) => setPurchaseData({ ...purchaseData, planType: e.target.value as any })}
            >
              <MenuItem value="yearly">Yearly License</MenuItem>
              <MenuItem value="3years">3 Years License</MenuItem>
              {/* <MenuItem value="floating">Floating License</MenuItem> */}
            </TextField>
            <TextField
              fullWidth
              type="number"
              label="Number of Seats"
              value={purchaseData.seats}
              onChange={(e) => setPurchaseData({ ...purchaseData, seats: Number(e.target.value) })}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Phone Number (Payment Verification)"
              placeholder="Enter 0966262458 for test"
              value={purchaseData.phoneNumber}
              onChange={(e) => setPurchaseData({ ...purchaseData, phoneNumber: e.target.value })}
              helperText="For testing, use: 0966262458"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenPurchase(false)} size="large" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            onClick={handlePurchase} 
            variant="contained" 
            size="large"
            disabled={purchaseLoading || !purchaseData.phoneNumber}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {purchaseLoading ? 'Processing...' : 'Purchase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicensesPage;