import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err: unknown) {
      console.error("Erro detalhado do Firebase Auth:", err);
      const code = (err as { code?: string }).code ?? '';
      setError(ERROR_MESSAGES[code] ?? `Ocorreu um erro (${code}). Tente novamente.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[whitesmoke] flex items-center justify-center p-4">
      <div className="bg-white shadow-[0_2px_4px_0_rgb(0,0,0,0.2),0_2.5rem_5rem_0_rgb(0,0,0,0.1)] w-full max-w-md p-10">
        <h1 className="text-[2.4rem] font-bold text-center text-[#4d4d4d] mb-2">
          Lista de Tarefas
        </h1>
        <p className="text-center text-[1.4rem] text-gray-500 mb-8">
          {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[1.4rem] font-bold text-[#4d4d4d]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border-2 border-black p-4 text-[1.6rem] w-full focus-visible:border-[#4d4d4d] focus-visible:shadow-[inset_0_0_0_2px]"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[1.4rem] font-bold text-[#4d4d4d]">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="border-2 border-black p-4 text-[1.6rem] w-full focus-visible:border-[#4d4d4d] focus-visible:shadow-[inset_0_0_0_2px]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#ca3c3c] text-[1.4rem] text-center font-bold">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white text-[1.6rem] py-4 cursor-pointer border-2 border-[#4d4d4d] capitalize disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-[1.4rem] text-gray-500 mt-6">
          {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <button
            type="button"
            className="text-[#4d4d4d] font-bold underline cursor-pointer"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
          >
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}
