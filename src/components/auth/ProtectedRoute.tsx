import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (user?.status === 'blocked') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}