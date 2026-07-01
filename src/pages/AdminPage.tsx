import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getUsersPaginated, getUserActivitiesAsAdmin, type AdminUser, type AdminActivityLog } from '@/services/admin-service';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, ShieldCheck, Activity, Search, X, Check, Trash, Edit, LogOut, Lock, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const actionIcons: Record<string, React.ReactNode> = {
  task_created: <Check className="h-5 w-5 text-emerald-400" />,
  task_completed: <Check className="h-5 w-5 text-emerald-400" />,
  task_uncompleted: <Activity className="h-5 w-5 text-yellow-400" />,
  task_deleted: <Trash className="h-5 w-5 text-red-400" />,
  task_edited: <Edit className="h-5 w-5 text-blue-400" />,
  user_login: <User className="h-5 w-5 text-green-400" />,
  user_logout: <LogOut className="h-5 w-5 text-orange-400" />,
  password_changed: <Lock className="h-5 w-5 text-purple-400" />,
  display_name_changed: <User className="h-5 w-5 text-blue-400" />,
  account_deleted: <Shield className="h-5 w-5 text-red-400" />,
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
  if (!timestamp) return 'Não disponível';
  
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
    return 'Não disponível';
  }
  
  if (isNaN(date.getTime())) return 'Não disponível';
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [activities, setActivities] = useState<AdminActivityLog[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const { users: data, lastDoc: newLastDoc, hasMore: more } = await getUsersPaginated(null, 15);
        const getMillis = (timestamp: TimestampValue) => {
          if (!timestamp) return 0;
          if (typeof timestamp === 'object' && 'toMillis' in timestamp && typeof timestamp.toMillis === 'function') return timestamp.toMillis();
          if (timestamp instanceof Date) return timestamp.getTime();
          if (typeof timestamp === 'number') return timestamp;
          if (typeof timestamp === 'object' && 'seconds' in timestamp && typeof timestamp.seconds === 'number') return timestamp.seconds * 1000;
          return 0;
        };
        
        // Ordenar por último acesso
        data.sort((a, b) => getMillis(b.lastLoginAt) - getMillis(a.lastLoginAt));
        setUsers(data);
        setLastDoc(newLastDoc);
        setHasMore(more);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Erro ao carregar dados do painel.');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  async function loadMoreUsers() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const { users: data, lastDoc: newLastDoc, hasMore: more } = await getUsersPaginated(lastDoc, 15);
      
      const getMillis = (timestamp: TimestampValue) => {
        if (!timestamp) return 0;
        if (typeof timestamp === 'object' && 'toMillis' in timestamp && typeof timestamp.toMillis === 'function') return timestamp.toMillis();
        if (timestamp instanceof Date) return timestamp.getTime();
        if (typeof timestamp === 'number') return timestamp;
        if (typeof timestamp === 'object' && 'seconds' in timestamp && typeof timestamp.seconds === 'number') return timestamp.seconds * 1000;
        return 0;
      };
      
      data.sort((a, b) => getMillis(b.lastLoginAt) - getMillis(a.lastLoginAt));
      
      setUsers((prev) => [...prev, ...data]);
      setLastDoc(newLastDoc);
      setHasMore(more);
    } catch (error) {
      console.error('Erro ao carregar mais usuários:', error);
      toast.error('Erro ao carregar mais dados.');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleViewActivities(user: AdminUser) {
    setSelectedUser(user);
    setLoadingActivities(true);
    try {
      const data = await getUserActivitiesAsAdmin(user.id);
      setActivities(data);
    } catch (error) {
      console.error('Erro ao carregar atividades do usuário:', error);
      toast.error('Não foi possível carregar as atividades deste usuário.');
    } finally {
      setLoadingActivities(false);
    }
  }

  function closeActivitiesModal() {
    setSelectedUser(null);
    setActivities([]);
  }

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app-bg/30 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <Card className="border-white/10 bg-app-card text-white shadow-2xl rounded-2xl p-2 sm:p-6">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-white/5 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/', viewTransition: true })}
                className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  Painel Administrativo
                </CardTitle>
                <p className="text-[1.4rem] text-white/60 font-semibold mt-1">
                  Visão global de usuários e monitoramento de sistema
                </p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-8 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                <p className="text-[1.4rem] text-white/40">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Users className="h-16 w-16 text-white/20" />
                <p className="text-[1.6rem] text-white/40 text-center">Nenhum usuário encontrado.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-[1.2rem] font-semibold uppercase tracking-wider">
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Criado em</th>
                    <th className="p-4">Último Acesso</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border border-white/10"
                          />
                          <div>
                            <div className="font-semibold text-white/90 text-[1.4rem] flex items-center gap-2">
                              {user.displayName || 'Sem nome'}
                              {user.role === 'admin' && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[1rem] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Admin</span>
                              )}
                            </div>
                            <div className="text-white/50 text-[1.2rem]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.emailVerified ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-[1.2rem]">Verificado</span>
                        ) : (
                          <span className="text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-[1.2rem]">Pendente</span>
                        )}
                      </td>
                      <td className="p-4 text-white/60 text-[1.3rem] whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4 text-white/60 text-[1.3rem] whitespace-nowrap">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => handleViewActivities(user)}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          Ver Atividades
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {!loading && hasMore && filteredUsers.length > 0 && !search && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMoreUsers}
                  disabled={loadingMore}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                >
                  {loadingMore ? 'Carregando...' : 'Carregar Mais Usuários'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Atividades */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-app-card border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${selectedUser.displayName || selectedUser.email}&background=random`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-[1.6rem] font-bold text-white leading-none mb-1">
                    Atividades: {selectedUser.displayName || selectedUser.email}
                  </h3>
                  <p className="text-[1.2rem] text-white/50">{selectedUser.id}</p>
                </div>
              </div>
              <button
                onClick={closeActivitiesModal}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {loadingActivities ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-white/20 mb-4" />
                  <p className="text-[1.4rem] text-white/50">Nenhuma atividade registrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                        {actionIcons[activity.action] || <Activity className="h-5 w-5 text-white/40" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 text-[1.4rem] font-medium leading-snug">
                          {activity.description}
                        </p>
                        <p className="text-white/40 text-[1.2rem] mt-1">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
