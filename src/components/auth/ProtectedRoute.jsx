import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/contexts/AuthContext';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';

const ProtectedRoute = ({ children }) => {
  const { user, authChecked, loading } = useAuth();

  if (loading || !authChecked) {
    return <AnimatedLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
