import React, { useState } from 'react';
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
  Button,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VpnKey as LicenseIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Bolt as BoltIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const drawerWidth = 280;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Profile Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'licenses', path: '/licenses', label: 'My Licenses', icon: <LicenseIcon /> },
    ...( ['admin', 'owner', 'super_admin'].includes(user?.role || '') 
      ? [{ id: 'team', path: '/team', label: 'Team Members', icon: <PeopleIcon /> }] 
      : [] 
    ),
    { id: 'profile', path: '/profile', label: 'My Profile', icon: <PersonIcon /> },
    { id: 'settings', path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  // Determine current view label based on path
  const currentPath = location.pathname;
  const currentViewLabel = menuItems.find(item => currentPath.includes(item.path))?.label || 'Dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* Header (AppBar) */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary' }} />} 
              aria-label="breadcrumb"
            >
              <Link 
                underline="hover" 
                color="inherit" 
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
                sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontWeight: 500, cursor: 'pointer' }}
              >
                <BoltIcon sx={{ mr: 0.5, fontSize: 20 }} />
                PowerFlow
              </Link>
              <Typography color="text.primary" fontWeight={600}>
                {currentViewLabel}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             {/* Search (Visual Only) */}
             <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: alpha('#fff', 0.05) }}>
               <SearchIcon fontSize="small" />
             </IconButton>

             {/* Notifications */}
             <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: alpha('#fff', 0.05) }}>
               <Badge badgeContent={3} color="error" variant="dot">
                 <NotificationsIcon fontSize="small" />
               </Badge>
             </IconButton>

             <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center', borderColor: 'rgba(255,255,255,0.1)' }} />

             {/* Profile */}
             <Button 
               onClick={handleMenuClick}
               sx={{ 
                 textTransform: 'none', 
                 color: 'text.primary',
                 borderRadius: 50,
                 pl: 0.5,
                 pr: 2,
                 py: 0.5,
                 '&:hover': { bgcolor: alpha('#fff', 0.05) }
               }}
             >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    mr: 1.5,
                    bgcolor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" lineHeight={1.2}>
                    {user?.first_name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1}>
                    {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
                  </Typography>
                </Box>
             </Button>

             {/* Profile Menu Dropdown */}
             <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.1)',
                    minWidth: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
          },
        }}
      >
        <Toolbar sx={{ px: 3, mb: 4, mt: 2 }}>
           <BoltIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 36, filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }} />
           <Typography 
             variant="h5" 
             sx={{ 
               fontWeight: 800, 
               background: `linear-gradient(45deg, #fff, ${theme.palette.primary.light})`,
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               letterSpacing: '-0.5px'
             }}
           >
             PowerFlow
           </Typography>
        </Toolbar>

        <Box sx={{ overflow: 'auto', px: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block', fontWeight: 600, letterSpacing: 1 }}>
            MENU
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  selected={currentPath.includes(item.path)} 
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    px: 2,
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)}, transparent)`,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                         background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.25)}, transparent)`,
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      pl: 2.5
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 36, 
                    color: currentPath.includes(item.path) ? 'primary.main' : 'text.secondary' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: currentPath.includes(item.path) ? 600 : 400,
                      color: currentPath.includes(item.path) ? 'text.primary' : 'text.secondary',
                      fontSize: '0.95rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;