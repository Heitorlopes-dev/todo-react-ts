import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Mode = 'login' | 'register';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/email-already-in-use': 'Este email já está em uso.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'Email inválido.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/operation-not-allowed': 'O método de login por Email/Senha não está ativado no Console do Firebase. Ative-o em Authentication > Sign-in method.',
};

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast.success("Bem-vindo de volta!");
      } else {
        await signUp(email, password);
        toast.success("Conta criada com sucesso! Bem-vindo!");
      }
      navigate('/');
    } catch (err: unknown) {
      console.error("Erro detalhado do Firebase Auth:", err);
      const code = (err as { code?: string }).code ?? '';
      const friendlyMessage = ERROR_MESSAGES[code] ?? `Ocorreu um erro (${code}). Tente novamente.`;
      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-slate-700/50 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto bg-linear-to-tr from-indigo-500 to-pink-500 h-12 w-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-2">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Lista de Tarefas
          </CardTitle>
          <CardDescription className="text-sm text-slate-400">
            {mode === 'login' ? 'Entre na sua conta para acessar suas tarefas' : 'Crie sua conta e comece a se organizar'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="nome@exemplo.com"
                className="bg-slate-950/50 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-10 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="Sua senha secreta"
                className="bg-slate-950/50 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500 h-10 text-sm"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 h-10 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processando...
                </span>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar Conta'
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
              <button
                type="button"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors cursor-pointer hover:underline"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                }}
              >
                {mode === 'login' ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
