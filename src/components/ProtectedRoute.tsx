import { useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Mail, LogOut, Loader2, RefreshCw } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, logOut } = useAuth();
  const [resending, setResending] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1f18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-[1.4rem] text-white/40 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    const handleResend = async () => {
      setResending(true);
      try {
        await sendEmailVerification(user);
        toast.success('E-mail de verificação reenviado!');
      } catch (err: unknown) {
        toast.error('Erro ao reenviar e-mail. Tente novamente mais tarde.');
      } finally {
        setResending(false);
      }
    };

    const handleReload = () => {
      window.location.reload();
    };

    return (
      <div className="min-h-screen bg-[#0a0f12] py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-[2.5rem] font-bold text-white tracking-tight">Verifique seu e-mail</h1>
            <p className="text-[1.4rem] text-white/60">
              Enviamos um link de confirmação para <strong className="text-white">{user.email}</strong>. Por favor, verifique sua caixa de entrada e pasta de SPAM.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              onClick={handleReload}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 border-none text-white font-bold h-14 text-[1.5rem] rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <RefreshCw className="h-5 w-5" />
              Já confirmei, recarregar página
            </Button>

            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-medium h-14 text-[1.5rem] rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              {resending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
              Reenviar e-mail
            </Button>
            
            <Button
              onClick={logOut}
              variant="ghost"
              className="w-full hover:bg-white/5 text-white/50 hover:text-red-400 font-medium h-14 text-[1.5rem] rounded-xl flex items-center gap-2 cursor-pointer transition-all border-none"
            >
              <LogOut className="h-5 w-5" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
