import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';

export function DeleteAccountSection() {
  const { deleteUserAccount, isGoogleUser } = useAuth();
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const googleUser = isGoogleUser();

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!googleUser && !password) {
      toast.error('Informe sua senha para confirmar a exclusão.');
      return;
    }
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita e todas as suas tarefas serão apagadas do sistema.',
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteUserAccount(googleUser ? undefined : password);
      toast.success('Sua conta foi excluída com sucesso.');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err, 'Erro ao excluir conta.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="border-red-500/20 bg-red-950/5 rounded-2xl shadow-lg">
      <CardHeader className="border-b border-red-500/10 pb-4">
        <CardTitle className="text-[1.8rem] font-bold text-red-400 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5" />
          Área de Perigo
        </CardTitle>
        <CardDescription className="text-[1.3rem] text-red-300/60 font-medium">
          Ações permanentes e irreversíveis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 space-y-2">
          <h4 className="text-[1.4rem] font-bold text-red-300">Excluir minha conta</h4>
          <p className="text-[1.3rem] text-red-300/80 leading-relaxed">
            Ao clicar no botão de exclusão, todos os seus dados pessoais, configurações e tarefas cadastradas serão apagados dos nossos servidores definitivamente.
          </p>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          {!googleUser && (
            <div className="space-y-2">
              <label htmlFor="delete-pw" className="text-[1.3rem] font-bold text-white/60 uppercase tracking-wider">
                Confirme sua Senha
              </label>
              <div className="relative">
                <Input
                  id="delete-pw"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha atual"
                  className="bg-white/5 border-red-500/20 text-white placeholder-white/20 focus:ring-red-500 focus:border-red-500 h-14 text-[1.5rem] rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={deleting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold h-12 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : googleUser ? (
              'Re-autenticar e Excluir com Google'
            ) : (
              'Excluir Minha Conta Permanentemente'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
