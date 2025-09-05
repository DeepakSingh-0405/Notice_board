import { Navigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function ProtectedRoute({ children, requireAdmin=false, isAdminFn }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdminFn(user)) return <Navigate to="/" replace />;

  return children;
}