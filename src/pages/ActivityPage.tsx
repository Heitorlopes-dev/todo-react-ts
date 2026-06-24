import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getUserActivities, type ActivityLog } from '@/services/activity-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Activity as ActivityIcon, Trash, Check, Edit, LogOut, Lock, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const actionIcons: Record<string, React.ReactNode> = {
  task_created: <Check className="h-5 w-5 text-emerald-400" />,
  task_completed: <Check className="h-5 w-5 text-emerald-400" />,
  task_uncompleted: <ActivityIcon className="h-5 w-5 text-yellow-400" />,
  task_deleted: <Trash className="h-5 w-5 text-red-400" />,
  task_edited: <Edit className="h-5 w-5 text-blue-400" />,
  user_login: <User className="h-5 w-5 text-green-400" />,
  user_logout: <LogOut className="h-5 w-5 text-orange-400" />,
  password_changed: <Lock className="h-5 w-5 text-purple-400" />,
  display_name_changed: <User className="h-5 w-5 text-blue-400" />,
  account_deleted: <Shield className="h-5 w-5 text-red-400" />,
};

const categoryColors: Record<string, string> = {
  tasks: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  auth: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  profile: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  security: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const categoryLabels: Record<string, string> = {
  tasks: 'Tarefas',
  auth: 'Autenticação',
  profile: 'Perfil',
  security: 'Segurança',
};

type TimestampValue = 
  | Date 
  | number 
  | string 
  | { toDate: () => Date } 
  | { seconds: number } 
  | null 
  | undefined;

function formatDate(timestamp: TimestampValue): string {
  if (!timestamp) return '';
  
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number' || typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return '';
  }
  
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function ActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      if (!user?.uid) return;
      
      try {
        const data = await getUserActivities(user.uid);
        setActivities(data);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        toast.error('Erro ao carregar histórico de atividades.');
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-app-bg/30 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        
        {/* Header Card */}
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
                <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  Histórico de Atividades
                </CardTitle>
                <p className="text-[1.4rem] text-white/60 font-semibold mt-1">
                  Acompanhe suas ações recentes no sistema
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                <p className="text-[1.4rem] text-white/40">Carregando atividades...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-[1.6rem] text-white/30 text-center">
                  Nenhuma atividade registrada ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {actionIcons[activity.action] || <ActivityIcon className="h-5 w-5 text-white/40" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-[1.5rem] text-white/90 font-medium leading-tight">
                          {activity.description}
                        </p>
                        <span className="text-[1.2rem] text-white/40 shrink-0 whitespace-nowrap">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-[1.1rem] font-semibold border ${categoryColors[activity.category] || 'bg-white/5 text-white/60 border-white/10'}`}
                        >
                          {categoryLabels[activity.category] || activity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
