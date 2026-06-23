import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';
import { getPasswordStrength } from '@/lib/password-strength';

export function ChangePasswordForm() {
  const { updateUserPassword, isGoogleUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  if (isGoogleUser()) {
    return null; // Don't show password form for Google users (F-19)
  }

  const strength = getPasswordStrength(newPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Por favor, informe sua senha atual.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('A confirmação não confere com a nova senha.');
      return;
    }
    setSaving(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err, 'Erro ao atualizar senha.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/2 rounded-2xl shadow-lg">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="text-[1.8rem] font-bold text-white flex items-center gap-3">
          <Lock className="h-5 w-5 text-emerald-400" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="current-pw" className="text-[1.3rem] font-bold text-white/60 uppercase tracking-wider">
              Senha Atual
            </label>
            <div className="relative">
              <Input
                id="current-pw"
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-[1.5rem] rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              >
                {showCurrentPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label htmlFor="new-pw" className="text-[1.3rem] font-bold text-white/60 uppercase tracking-wider">
              Nova Senha
            </label>
            <div className="relative">
              <Input
                id="new-pw"
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-[1.5rem] rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              >
                {showNewPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Strength Meter */}
            {newPassword && (
              <div className="space-y-1 mt-1 animate-in fade-in duration-200">
                <div className="flex justify-between text-[1.2rem] font-semibold">
                  <span className="text-white/50">Força da senha:</span>
                  <span className={strength.score <= 1 ? 'text-red-400' : strength.score <= 2 ? 'text-orange-400' : strength.score <= 3 ? 'text-yellow-400' : 'text-emerald-400'}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-350`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirm-pw" className="text-[1.3rem] font-bold text-white/60 uppercase tracking-wider">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Input
                id="confirm-pw"
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-[1.5rem] rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              >
                {showConfirmPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold h-12 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Alterar Senha'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
