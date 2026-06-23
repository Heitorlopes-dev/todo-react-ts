import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';

type Mode = 'login' | 'register';

export function LoginPage() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast.success('Bem-vindo de volta!');
      } else {
        await signUp(email, password);
        toast.success('Conta criada com sucesso! Bem-vindo!');
      }
      navigate('/');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Bem-vindo!');
      navigate('/');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err, 'Erro ao entrar com Google.'));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleResetPassword() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Por favor, insira seu e-mail no campo correspondente para solicitar a redefinição.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(trimmedEmail);
      toast.success('E-mail de redefinição de senha enviado! Verifique sua caixa de entrada e a pasta de SPAM.');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err, 'Erro ao solicitar redefinição.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f1f18]">

      {/* ── Left panel — banner image ── */}
      <div className="hidden md:flex md:w-[50%] lg:w-[45%] xl:w-[40%] relative overflow-hidden">
        <img
          src="/todo-react-ts/login-banner.jpg"
          alt="Agronorte – campo verde com trabalhador rural"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#0f1f18]/30 to-[#0f1f18]" />
        <div className="relative z-10 flex flex-col justify-end h-full px-10 py-8">
          <div className="pb-4">
            <p className="text-white/80 text-[1.4rem] font-medium max-w-xs leading-relaxed">
              Organize seu dia. Conquiste seus objetivos.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-12 lg:px-16 bg-[#0f1f18]">
        <div className="w-full max-w-md md:max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Logo / Branding */}
          <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-white text-[2rem] font-extrabold tracking-tight">Lista de Tarefas</span>
          </div>

          {/* Form card */}
          <div className="bg-[#162720] border border-white/10 rounded-2xl shadow-2xl shadow-emerald-950/40 p-10 md:p-12 space-y-8">

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-[3.2rem] font-bold text-white">
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </h1>
              <p className="text-[1.5rem] text-white/60 font-medium">
                {mode === 'login'
                  ? 'Acesse sua conta para continuar.'
                  : 'Crie sua conta e comece a se organizar.'}
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-16 text-[1.6rem] font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continuar com Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[1.4rem] font-bold text-white/40 uppercase tracking-widest">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-[1.4rem] font-bold text-white/80 uppercase tracking-wider">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    className="pl-12 bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-16 text-[1.6rem] rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-[1.4rem] font-bold text-white/80 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="Sua senha"
                    className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-16 text-[1.6rem] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Forgot password link — only on login */}
                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading || googleLoading}
                      className="text-[1.4rem] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold transition-all duration-200 shadow-lg shadow-emerald-900/40 h-16 text-[1.7rem] rounded-xl cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-[1.5rem] text-white/50">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
              <button
                type="button"
                className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
