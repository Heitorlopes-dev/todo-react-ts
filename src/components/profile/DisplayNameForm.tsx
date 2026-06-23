import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Loader2 } from 'lucide-react';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';

export function DisplayNameForm() {
  const { user, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      toast.error('O nome não pode estar vazio.');
      return;
    }
    setSaving(true);
    try {
      await updateDisplayName(trimmed);
      toast.success('Nome de exibição atualizado!');
    } catch (err: unknown) {
      toast.error(getFirebaseErrorMessage(err, 'Erro ao atualizar nome.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/2 rounded-2xl shadow-lg">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="text-[1.8rem] font-bold text-white flex items-center gap-3">
          <User className="h-5 w-5 text-emerald-400" />
          Nome de Exibição
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-[1.3rem] font-bold text-white/60 uppercase tracking-wider">
              Seu nome completo ou apelido
            </label>
            <Input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Digite seu nome"
              className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-emerald-500 focus:ring-emerald-500/20 h-14 text-[1.5rem] rounded-xl"
              maxLength={150}
            />
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
              'Salvar Nome'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
