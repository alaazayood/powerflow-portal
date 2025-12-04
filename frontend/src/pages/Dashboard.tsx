import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const navigate = useNavigate();

  // Helper to navigate (passed to sub-dashboards for "Quick Actions")
  const setView = (view: 'overview' | 'licenses' | 'team' | 'settings') => {
    navigate(`/${view === 'overview' ? 'dashboard' : view}`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  const isAdmin = ['admin', 'owner', 'super_admin'].includes(user?.role || '');
  
  return isAdmin 
    ? <AdminDashboard stats={stats} setView={setView} />
    : <UserDashboard stats={stats} setView={setView} />;
};

export default Dashboard;