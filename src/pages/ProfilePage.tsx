import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, ShieldCheck, Activity as ActivityIcon } from 'lucide-react';
import { DisplayNameForm } from '@/components/profile/DisplayNameForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection';

export function ProfilePage() {
  const { user, isGoogleUser } = useAuth();
  const navigate = useNavigate();

  const googleUser = isGoogleUser();

  return (
    <div className="min-h-screen bg-app-bg/30 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        
        {/* Header Card */}
        <Card className="border-white/10 bg-app-card text-white shadow-2xl rounded-2xl p-2 sm:p-6">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-white/5 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/', viewTransition: true })}
                className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  Perfil do Usuário
                </CardTitle>
                <p className="text-[1.4rem] text-white/60 font-semibold mt-1">
                  Gerencie seus dados e configurações de segurança
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/activities', viewTransition: true })}
              className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer gap-2"
            >
              <ActivityIcon className="h-5 w-5" />
              <span className="text-[1.3rem] font-semibold">Histórico</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-8 space-y-8">
            {/* User Account Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/2 border border-white/5 rounded-2xl gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Mail className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-[1.6rem] font-bold text-white/90">E-mail de Cadastro</h3>
                  <p className="text-[1.4rem] text-white/50">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 w-fit">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-[1.3rem] font-bold text-white/80">
                  Acesso via {googleUser ? 'Google Account' : 'Senha'}
                </span>
              </div>
            </div>

            {/* Display Name Section */}
            <DisplayNameForm />

            {/* Password Change Section (only if not Google User) */}
            {!googleUser && <ChangePasswordForm />}

            {/* Danger Zone */}
            <DeleteAccountSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}