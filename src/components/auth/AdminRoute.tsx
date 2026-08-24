import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1042] flex items-center justify-center">
        <div className="flex flex-col items-center text-white">
          <Loader2 size={32} className="animate-spin text-red-500 mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // user object now has role hydrated from context
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
