import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const roleRoutes = {
    customer: '/customer',
    kitchen: '/kitchen',
    manager: '/manager',
    admin: '/admin',
  };

  return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
};

export default RoleRedirect;