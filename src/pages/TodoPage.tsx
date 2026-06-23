import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Todo } from '../components/Todo';
import { FilterButton } from '../components/FilterButton';
import { Form } from '../components/Form';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { FILTER_MAP, FILTER_NAMES } from '@/constants/filters';
import type { FilterName } from '@/constants/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getUserInitials } from '@/lib/utils';
import { Activity as ActivityIcon } from 'lucide-react';

export function TodoPage() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading: loadingTasks, addTask, deleteTask, editTask, toggleTask } = useTasks(user?.uid);
  const [filter, setFilter] = useState<FilterName>('Todas');

  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const prevTaskLength = useRef(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength.current === -1) {
      listHeadingRef.current?.focus();
    }
    prevTaskLength.current = tasks.length;
  }, [tasks.length]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      toast.success('Você saiu da sua conta.');
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      toast.error('Erro ao fazer logout.');
    }
  }, [logOut]);

  const filteredTasks = useMemo(
    () => tasks.filter(FILTER_MAP[filter]),
    [tasks, filter],
  );

  const taskList = useMemo(
    () =>
      filteredTasks.map((task) => (
        <Todo
          key={task.id}
          name={task.name}
          id={task.id}
          completed={task.completed}
          toggleTaskCompleted={toggleTask}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      )),
    [filteredTasks, toggleTask, deleteTask, editTask],
  );

  const filterList = useMemo(
    () =>
      FILTER_NAMES.map((name) => (
        <FilterButton
          key={name}
          name={name}
          isPressed={name === filter}
          setFilter={setFilter}
        />
      )),
    [filter],
  );

  const tasksNoun = filteredTasks.length !== 1 ? 'tarefas' : 'tarefa';
  const headingText = `${filteredTasks.length} ${tasksNoun} ${
    filter === 'Completadas' ? 'completadas' : 'restantes'
  }`;

  const initials = getUserInitials(user);

  return (
    <div className="min-h-screen bg-app-bg py-12 px-4 flex flex-col items-center">
      <Card className="w-full max-w-6xl border-white/10 bg-app-card text-white shadow-2xl shadow-emerald-950/40 rounded-2xl animate-in fade-in duration-500 p-2 sm:p-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-white/5 gap-4">
          <div>
            <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              Minhas Tarefas
            </CardTitle>
            <p className="text-[1.4rem] text-white/60 font-semibold mt-1">
              {user?.displayName ?? user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/activities')}
              title="Histórico de atividades"
              className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <ActivityIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              title="Meu perfil"
              className="h-11 w-11 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[1.4rem] shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer select-none"
            >
              {initials}
            </button>
            <Button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 px-5 py-2 h-11 text-[1.3rem] font-bold rounded-xl cursor-pointer transition-all duration-200 capitalize shadow-none"
            >
              Sair
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <Form addTask={addTask} />

          <div className="flex justify-between gap-x-2 mt-5">
            {filterList}
          </div>

          <div className="space-y-4">
            <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef} className="text-[2rem] font-bold text-white/90 outline-none">
              {headingText}
            </h2>

            {loadingTasks ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                <p className="text-[1.4rem] text-white/40">Buscando tarefas...</p>
              </div>
            ) : (
              <div className="max-h-100 overflow-y-auto pr-1">
                <ul
                  role="list"
                  className="space-y-4 mt-5 list-none p-0"
                  aria-labelledby="list-heading"
                >
                  {taskList.length > 0 ? (
                    taskList
                  ) : (
                    <p className="text-center text-[1.6rem] text-white/30 py-12 border border-dashed border-white/10 rounded-xl">
                      Nenhuma tarefa encontrada neste filtro.
                    </p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
