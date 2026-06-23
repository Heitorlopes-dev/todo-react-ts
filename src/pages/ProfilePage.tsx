import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Lock,
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Pencil,
} from 'lucide-react';

export function ProfilePage() {
  const { user, updateDisplayName, updateUserPassword, deleteUserAccount } = useAuth();
  const navigate = useNavigate();

  // ── Display Name state ──────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [savingName, setSavingName] = useState(false);

  // ── Password state ──────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ── Delete account state ────────────────────────────────────────────────────
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showDeletePw, setShowDeletePw] = useState(false);

  // ── Password strength ───────────────────────────────────────────────────────
  function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Fraca', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Regular', color: 'bg-orange-400' };
    if (score <= 3) return { score, label: 'Boa', color: 'bg-yellow-400' };
    return { score, label: 'Forte', color: 'bg-emerald-500' };
  }

  const pwStrength = getPasswordStrength(newPassword);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      toast.error('O nome não pode estar vazio.');
      return;
    }
    if (trimmed === user?.displayName) {
      toast.info('O nome já é o mesmo.');
      return;
    }
    setSavingName(true);
    try {
      await updateDisplayName(trimmed);
      toast.success('Nome atualizado com sucesso!');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      toast.error(code === 'auth/requires-recent-login'
        ? 'Por segurança, faça logout e login novamente antes de alterar o nome.'
        : 'Erro ao atualizar nome. Tente novamente.');
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Informe sua senha atual.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não conferem.');
      return;
    }
    setSavingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      const messages: Record<string, string> = {
        'auth/wrong-password': 'Senha atual incorreta.',
        'auth/invalid-credential': 'Senha atual incorreta.',
        'auth/weak-password': 'A nova senha é muito fraca.',
        'auth/requires-recent-login': 'Por segurança, faça logout e login novamente.',
        'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
      };
      toast.error(messages[code] ?? `Erro ao alterar senha (${code}).`);
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!deletePassword) {
      toast.error('Confirme sua senha para excluir a conta.');
      return;
    }
    setDeletingAccount(true);
    try {
      await deleteUserAccount(deletePassword);
      toast.success('Conta excluída com sucesso.');
      navigate('/login');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      const messages: Record<string, string> = {
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-credential': 'Senha incorreta.',
        'auth/requires-recent-login': 'Por segurança, faça logout e login novamente.',
        'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
      };
      toast.error(messages[code] ?? `Erro ao excluir conta (${code}).`);
    } finally {
      setDeletingAccount(false);
    }
  }

  // ── Avatar initials ─────────────────────────────────────────────────────────
  const initials = (user?.displayName ?? user?.email ?? '?')
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 py-10 px-4 flex flex-col items-center">
      {/* ── Back button ── */}
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[1.4rem] font-medium group cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Voltar para Tarefas
        </button>
      </div>

      <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* ── Profile header card ── */}
        <Card className="border-slate-700/50 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md overflow-hidden">
          {/* accent bar */}
          <div className="h-2 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <CardHeader className="pt-6 pb-4 px-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-3xl font-extrabold text-white select-none">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <CardTitle className="text-2xl font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent truncate">
                  {user?.displayName ?? 'Sem nome'}
                </CardTitle>
                <p className="text-slate-400 text-[1.3rem] flex items-center gap-1.5 mt-1 truncate">
                  <Mail className="h-4 w-4 shrink-0" />
                  {user?.email}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 text-[1.1rem] text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Conta verificada
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* ── Edit display name ── */}
        <Card className="border-slate-700/50 bg-slate-900/90 text-white shadow-xl backdrop-blur-md">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-400" />
              </div>
              <CardTitle className="text-[1.8rem] font-bold text-slate-100">Nome de Usuário</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="displayName" className="text-[1.2rem] font-semibold text-slate-300 uppercase tracking-wider">
                  Nome de exibição
                </label>
                <div className="relative">
                  <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome de exibição"
                    maxLength={50}
                    className="pl-9 bg-slate-950/50 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-14 text-[1.5rem]"
                  />
                </div>
                <p className="text-[1.1rem] text-slate-500">
                  Este nome aparecerá no seu perfil e lista de tarefas.
                </p>
              </div>
              <Button
                type="submit"
                disabled={savingName}
                className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 h-12 text-[1.4rem] cursor-pointer"
              >
                {savingName ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </span>
                ) : (
                  'Salvar Nome'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Change password ── */}
        <Card className="border-slate-700/50 bg-slate-900/90 text-white shadow-xl backdrop-blur-md">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle className="text-[1.8rem] font-bold text-slate-100">Alterar Senha</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <form onSubmit={handleSavePassword} className="space-y-5">
              {/* Current password */}
              <div className="space-y-1.5">
                <label htmlFor="currentPassword" className="text-[1.2rem] font-semibold text-slate-300 uppercase tracking-wider">
                  Senha atual
                </label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    autoComplete="current-password"
                    className="pr-12 bg-slate-950/50 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-14 text-[1.5rem]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showCurrentPw ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showCurrentPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-[1.2rem] font-semibold text-slate-300 uppercase tracking-wider">
                  Nova senha
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    className="pr-12 bg-slate-950/50 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-14 text-[1.5rem]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showNewPw ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showNewPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= pwStrength.score ? pwStrength.color : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[1.1rem] font-medium ${
                      pwStrength.score <= 1 ? 'text-red-400' :
                      pwStrength.score <= 2 ? 'text-orange-400' :
                      pwStrength.score <= 3 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      Força da senha: {pwStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-[1.2rem] font-semibold text-slate-300 uppercase tracking-wider">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
                    className={`pr-12 bg-slate-950/50 border text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-14 text-[1.5rem] ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-500/70'
                        : confirmPassword && newPassword === confirmPassword
                        ? 'border-emerald-500/70'
                        : 'border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showConfirmPw ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[1.1rem] text-red-400">As senhas não conferem.</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-[1.1rem] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Senhas conferem!
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={savingPassword}
                className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 h-12 text-[1.4rem] cursor-pointer"
              >
                {savingPassword ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Alterando...
                  </span>
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Danger zone ── */}
        <Card className="border-red-900/40 bg-slate-900/90 text-white shadow-xl backdrop-blur-md">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-red-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <CardTitle className="text-[1.8rem] font-bold text-red-400">Zona de Perigo</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteSection((v) => !v)}
                className="text-[1.2rem] text-slate-400 hover:text-red-400 transition-colors underline cursor-pointer"
              >
                {showDeleteSection ? 'Cancelar' : 'Excluir conta'}
              </button>
            </div>
          </CardHeader>

          {showDeleteSection && (
            <CardContent className="px-6 py-6">
              <p className="text-[1.3rem] text-slate-400 mb-5">
                Esta ação é <strong className="text-red-400">irreversível</strong>. Sua conta e todas as suas tarefas serão
                permanentemente excluídas. Confirme com sua senha para prosseguir.
              </p>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="deletePassword" className="text-[1.2rem] font-semibold text-slate-300 uppercase tracking-wider">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Input
                      id="deletePassword"
                      type={showDeletePw ? 'text' : 'password'}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Sua senha atual"
                      autoComplete="current-password"
                      className="pr-12 bg-slate-950/50 border-red-900/50 text-white placeholder-slate-500 focus:ring-red-500 focus:border-red-500 h-14 text-[1.5rem]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={showDeletePw ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showDeletePw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={deletingAccount}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-red-500/20 h-12 text-[1.4rem] cursor-pointer"
                >
                  {deletingAccount ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Excluindo...
                    </span>
                  ) : (
                    'Excluir minha conta permanentemente'
                  )}
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
