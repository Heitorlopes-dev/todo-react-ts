import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getArchivedTasksPaginated, toggleTaskCompleted, type ArchivedTask } from '@/services/task-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Archive, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export function ArchivePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<ArchivedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      if (!user?.uid) return;
      try {
        const { tasks: data, lastDoc: newLastDoc, hasMore: more } = await getArchivedTasksPaginated(user.uid, null, 15);
        setTasks(data);
        setLastDoc(newLastDoc);
        setHasMore(more);
      } catch (error) {
        console.error('Erro ao carregar tarefas arquivadas (Verifique se o Índice foi criado no Console):', error);
        toast.error('Erro ao carregar o histórico de tarefas.');
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [user?.uid]);

  async function loadMoreTasks() {
    if (!hasMore || loadingMore || !user?.uid) return;
    setLoadingMore(true);
    try {
      const { tasks: data, lastDoc: newLastDoc, hasMore: more } = await getArchivedTasksPaginated(user.uid, lastDoc, 15);
      setTasks((prev) => [...prev, ...data]);
      setLastDoc(newLastDoc);
      setHasMore(more);
    } catch (error) {
      console.error('Erro ao carregar mais tarefas:', error);
      toast.error('Erro ao carregar mais dados.');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRestoreTask(taskId: string, taskName: string) {
    if (!user?.uid) return;
    try {
      await toggleTaskCompleted(user.uid, taskId, true, taskName);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Tarefa reativada com sucesso!');
    } catch (error) {
      console.error('Erro ao restaurar tarefa:', error);
      toast.error('Erro ao restaurar tarefa.');
    }
  }

  return (
    <div className="min-h-screen bg-app-bg/30 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        <Card className="border-white/10 bg-app-card text-white shadow-2xl rounded-2xl p-2 sm:p-6">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-white/5 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-3xl font-extrabold flex items-center gap-2 bg-linear-to-r from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
                  <Archive className="h-6 w-6 text-emerald-400" />
                  Arquivo de Tarefas
                </CardTitle>
                <p className="text-[1.4rem] text-white/60 font-semibold mt-1">
                  Histórico completo das suas tarefas concluídas
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 min-h-[50vh]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                <p className="text-[1.4rem] text-white/40">Buscando histórico...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Archive className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-[1.6rem] text-white/30 text-center">
                  Nenhuma tarefa arquivada encontrada.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const dateObj = task.createdAt?.toDate ? task.createdAt.toDate() : new Date();
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500/50 shrink-0" />
                        <div>
                          <p className="text-[1.6rem] text-white/70 font-medium line-through decoration-white/20">
                            {task.name}
                          </p>
                          <p className="text-[1.2rem] text-white/40 mt-1">
                            Concluída em {dateObj.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRestoreTask(task.id, task.name)}
                        className="text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl px-4 flex items-center gap-2 cursor-pointer"
                        title="Reativar Tarefa"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="hidden sm:inline">Restaurar</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!loading && hasMore && tasks.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMoreTasks}
                  disabled={loadingMore}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl px-6 h-12 text-[1.4rem]"
                >
                  {loadingMore ? 'Carregando...' : 'Carregar Mais Antigas'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
