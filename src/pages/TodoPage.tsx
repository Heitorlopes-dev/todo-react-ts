import { useState, useEffect, useRef } from 'react';
import { Todo } from '../components/Todo';
import { FilterButton } from '../components/FilterButton';
import { Form } from '../components/Form';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Task = {
  id: string;
  name: string;
  completed: boolean;
};

const FILTER_MAP = {
  Todas: () => true,
  Ativas: (task: Task) => !task.completed,
  Completadas: (task: Task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP) as Array<keyof typeof FILTER_MAP>;

export function TodoPage() {
  const { user, logOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<keyof typeof FILTER_MAP>('Todas');
  const [loadingTasks, setLoadingTasks] = useState(true);

  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const prevTaskLength = useRef(tasks.length);

  useEffect(() => {
    if (!user) return;

    const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksCollectionRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTasks: Task[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTasks.push({
            id: doc.id,
            name: data.name ?? '',
            completed: data.completed ?? false,
          });
        });
        setTasks(fetchedTasks);
        setLoadingTasks(false);
      },
      (error) => {
        console.error('Erro ao escutar tarefas no Firestore:', error);
        toast.error('Erro de conexão ao carregar tarefas.');
        setLoadingTasks(false);
      }
    );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (tasks.length - prevTaskLength.current === -1) {
      listHeadingRef.current?.focus();
    }
    prevTaskLength.current = tasks.length;
  }, [tasks.length]);

  async function toggleTaskCompleted(id: string) {
    if (!user) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      try {
        await updateDoc(taskDocRef, {
          completed: !task.completed,
        });
        toast.success(task.completed ? 'Tarefa marcada como ativa' : 'Tarefa concluída com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        toast.error('Erro ao alterar status da tarefa.');
      }
    }
  }

  async function deleteTask(id: string) {
    if (!user) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    try {
      await deleteDoc(taskDocRef);
      toast.success('Tarefa excluída!');
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      toast.error('Erro ao excluir tarefa.');
    }
  }

  async function editTask(id: string, newName: string) {
    if (!user) return;
    const trimmedName = newName.trim();
    if (!trimmedName) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    try {
      await updateDoc(taskDocRef, {
        name: trimmedName,
      });
      toast.success('Tarefa renomeada!');
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      toast.error('Erro ao salvar alteração.');
    }
  }

  async function addTask(name: string) {
    if (!user) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
    try {
      await addDoc(tasksCollectionRef, {
        name: trimmedName,
        completed: false,
        createdAt: serverTimestamp(),
      });
      toast.success('Tarefa adicionada!');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao adicionar tarefa.');
    }
  }

  async function handleLogout() {
    try {
      await logOut();
      toast.success('Você saiu da sua conta.');
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      toast.error('Erro ao fazer logout.');
    }
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      key={task.id}
      name={task.name}
      id={task.id}
      completed={task.completed}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? 'tarefas' : 'tarefa';
  const headingText = `${taskList.length} ${tasksNoun} ${
    filter === 'Completadas' ? 'completadas' : 'restantes'
  }`;

  return (
    <div className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 min-h-screen py-12 px-4 flex flex-col items-center">
      <Card className="w-full max-w-6xl border-slate-700/50 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md animate-in fade-in duration-500 p-2 sm:p-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-slate-800 gap-4">
          <div>
            <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Minhas Tarefas
            </CardTitle>
            <p className="text-[1.4rem] text-slate-400 font-medium mt-1">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-[#ca3c3c] hover:bg-[#b03030] px-5 py-2 text-[1.3rem] font-bold cursor-pointer transition-colors capitalize"
          >
            Sair
          </Button>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <Form addTask={addTask} />

          <div className="flex justify-between gap-x-2 mt-5">
            {filterList}
          </div>

          <div className="space-y-4">
            <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef} className="text-[2rem] font-bold text-slate-200 outline-none">
              {headingText}
            </h2>

            {loadingTasks ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
                <p className="text-[1.4rem] text-slate-400">Buscando tarefas...</p>
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
                  <p className="text-center text-[1.6rem] text-slate-500 py-12 border border-dashed border-slate-800 rounded-xl">
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
