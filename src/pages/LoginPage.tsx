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
        toast.success('Conta criada com sucesso! Verifique seu e-mail para continuar.');
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
      await signInWithGoogle(mode);
      toast.success(mode === 'login' ? 'Bem-vindo!' : 'Conta criada com sucesso!');
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
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0a0f12]">
      
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[100px] pointer-events-none animate-pulse duration-8000 delay-700" />
      <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-emerald-400/10 blur-[80px] pointer-events-none animate-pulse duration-12000" />

      {/* ── Left panel — banner image ── */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-0">
        <img
          src="/todo-react-ts/login-banner.jpg"
          alt="Agronorte – campo"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-[20s] hover:scale-110"
        />
        {/* Gradient overlay for blending */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-[#0a0f12]" />
        
        <div className="relative z-10 flex flex-col justify-end h-full px-12 py-16 lg:px-20 lg:py-24">
          <div className="pb-8 space-y-6 animate-in slide-in-from-left-8 fade-in duration-1000">
            <div className="w-16 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h2 className="text-white text-[3rem] lg:text-[4rem] font-extrabold leading-tight tracking-tight">
              Organize seu dia. <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
                Conquiste seus objetivos.
              </span>
            </h2>
            <p className="text-white/70 text-[1.5rem] lg:text-[1.8rem] max-w-lg font-medium leading-relaxed">
              A plataforma definitiva para manter suas tarefas rurais e urbanas sob controle total.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-12 lg:px-16 z-10">
        <div className="w-full max-w-md md:max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-5 mb-10 justify-center md:justify-start">
            <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <svg className="h-8 w-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="block text-white text-[2.2rem] font-extrabold tracking-tight leading-none drop-shadow-sm">Lista de Tarefas</span>
              <span className="block text-emerald-400 text-[1.2rem] font-bold tracking-[0.2em] uppercase mt-1">Agronorte</span>
            </div>
          </div>

          {/* Form card with Glassmorphism */}
          <div className="relative bg-white/2 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 md:p-12 space-y-8 overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Heading */}
            <div className="space-y-2 relative z-10">
              <h1 className="text-[3.2rem] font-bold text-white tracking-tight">
                {mode === 'login' ? 'Bem-vindo(a) de volta' : 'Criar nova conta'}
              </h1>
              <p className="text-[1.5rem] text-white/60 font-medium">
                {mode === 'login'
                  ? 'Insira seus dados para acessar o sistema.'
                  : 'Preencha os dados abaixo para se registrar.'}
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="relative z-10 w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl h-14 text-[1.5rem] font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
            >
              {googleLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              ) : (
                <svg className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span className="group-hover:translate-x-1 transition-transform duration-300">Continuar com o Google</span>
            </button>

            {/* Divider */}
            <div className="flex justify-center fconst [mode, setMode] = useState<Mode>('login');lex items-center gap-4 relative z-10">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-white/10" />
              <span className="text-[1.5rem] font-bold text-white/30 uppercase tracking-[0.2em]">ou</span>
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-white/10" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email */}
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-[1.3rem] font-bold text-white/70 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    className="pl-12 bg-black/20 border-white/10 text-white placeholder-white/20 focus:bg-black/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 h-14 text-[1.5rem] rounded-2xl transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label htmlFor="password" className="text-[1.3rem] font-bold text-white/70 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="Sua senha secreta"
                    className="pl-12 pr-12 bg-black/20 border-white/10 text-white placeholder-white/20 focus:bg-black/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 h-14 text-[1.5rem] rounded-2xl transition-all duration-300"
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
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading || googleLoading}
                      className="text-[1.3rem] font-bold text-white/50 hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] border-none h-14 text-[1.6rem] rounded-2xl cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Entrar na Plataforma' : 'Criar Minha Conta'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-[1.4rem] text-white/50 relative z-10 pt-4">
              {mode === 'login' ? 'Ainda não tem uma conta?' : 'Já faz parte do time?'}{' '}
              <button
                type="button"
                className="text-emerald-400 font-bold hover:text-emerald-300 hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all cursor-pointer ml-1"
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
