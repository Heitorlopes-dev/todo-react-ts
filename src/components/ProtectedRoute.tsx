import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[whitesmoke] flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-[0_2px_4px_0_rgb(0,0,0,0.2),0_2.5rem_5rem_0_rgb(0,0,0,0.1)] w-full max-w-md p-10 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          <p className="text-[1.6rem] text-gray-500 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
