import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Sword } from 'lucide-react';

/**
 * Wraps a route so only authenticated users can access it.
 * - While Firebase resolves the session → full-screen spinner
 * - Signed-out → redirect to /auth (preserving the intended URL)
 * - Signed-in  → render children
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-space flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-purple/20 blur-2xl animate-ping" />
          <Sword size={32} className="text-brand-purple relative z-10" />
        </div>
        <Loader2 size={20} className="animate-spin text-brand-violet" />
        <p className="text-xs font-semibold text-white/30 tracking-widest uppercase">
          Authenticating…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
