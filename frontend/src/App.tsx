import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store, AppDispatch } from './store';
import { theme } from './theme';
import { fetchCurrentUser } from './store/slices/authSlice';

// Pages & Components
import Dashboard from './pages/Dashboard';
import LicensesPage from './pages/LicensesPage';
import RegisterPage from './pages/RegisterPage';
import LoginForm from './components/LoginForm';
import DashboardLayout from './components/layout/DashboardLayout';
import VerifyPage from './components/auth/VerifyPage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Login Page Wrapper
const LoginPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <LoginForm />
    </div>
  );
};

// Main App Component with Logic
const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        <Route path="/verify" element={
          <PublicRoute>
            <VerifyPage />
          </PublicRoute>
        } />

        <Route path="/accept-invite" element={
          <PublicRoute>
            <AcceptInvitePage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="licenses" element={<LicensesPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;