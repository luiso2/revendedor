import React from 'react';
import DashboardGestor from './DashboardGestor';
import DashboardPropietario from './DashboardPropietario';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return user.rol === 'gestor' ? <DashboardGestor /> : <DashboardPropietario />;
};

export default Dashboard;
