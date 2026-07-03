import { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MailCheck, RefreshCw, LogOut, Loader2 } from 'lucide-react';

/**
 * Tela de bloqueio exibida quando o usuário ainda não verificou o e-mail.
 * Oferece opções de reenviar verificação, recarregar ou sair.
 */
export function EmailVerificationGate({ children }: { children: React.ReactNode }) {
  const { user, logOut } = useAuth();
  const [sending, setSending] = useState(false);

  // Se não tem user ou email já verificado, renderiza normalmente
  if (!user || user.emailVerified) {
    return <>{children}</>;
  }

  async function handleResend() {
    if (!user) return;
    setSending(true);
    try {
      await sendEmailVerification(user);
      toast.success('E-mail de verificação reenviado! Verifique sua caixa de entrada e a pasta de SPAM.');
    } catch {
      toast.error('Erro ao reenviar. Aguarde alguns minutos e tente novamente.');
    } finally {
      setSending(false);
    }
  }

  async function handleLogout() {
    try {
      await logOut();
      toast.success('Você saiu da sua conta.');
    } catch {
      toast.error('Erro ao fazer logout.');
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-lg border-white/10 bg-app-card text-white shadow-2xl rounded-2xl animate-in fade-in duration-500">
        <CardContent className="flex flex-col items-center text-center gap-6 py-12 px-8">
          <div className="h-20 w-20 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <MailCheck className="h-10 w-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[2.4rem] font-extrabold text-white">Verifique seu e-mail</h2>
            <p className="text-[1.4rem] text-white/60 leading-relaxed">
              Enviamos um link de verificação para{' '}
              <span className="font-bold text-white/80">{user.email}</span>.
              <br />
              Confirme seu e-mail para acessar a plataforma.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button
              onClick={handleResend}
              disabled={sending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl cursor-pointer flex items-center justify-center gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MailCheck className="h-4 w-4" />
              )}
              {sending ? 'Enviando...' : 'Reenviar e-mail'}
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold h-12 rounded-xl cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Já verifiquei
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex-1 text-red-400 hover:bg-red-500/10 font-bold h-12 rounded-xl cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          <p className="text-[1.2rem] text-white/30 mt-2">
            Não recebeu? Verifique a pasta de SPAM ou tente reenviar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
