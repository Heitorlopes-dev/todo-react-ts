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
      } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
      }
    }
  }

  async function deleteTask(id: string) {
    if (!user) return;
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    try {
      await deleteDoc(taskDocRef);
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
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
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
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
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
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
    <div className="bg-[whitesmoke] min-h-screen py-8 px-4 flex flex-col items-center">
      <div className="bg-white shadow-[0_2px_4px_0_rgb(0,0,0,0.2),0_2.5rem_5rem_0_rgb(0,0,0,0.1)] w-full max-w-2xl p-6 sm:p-16 relative space-y-10">
        <div className="flex justify-between items-center border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-[2.8rem] font-bold text-[#4d4d4d]">Lista de Tarefas</h1>
            <p className="text-[1.4rem] text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logOut}
            className="border-2 border-red-600 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2 text-[1.4rem] font-bold cursor-pointer transition-all capitalize"
          >
            Sair
          </button>
        </div>

        <Form addTask={addTask} />

        <div className="flex justify-between gap-x-2 mt-5">
          {filterList}
        </div>

        <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef} className="text-[2rem] font-bold text-[#4d4d4d] outline-none">
          {headingText}
        </h2>

        {loadingTasks ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
            <p className="text-[1.4rem] text-gray-500">Buscando tarefas...</p>
          </div>
        ) : (
          <ul
            role="list"
            className="space-y-10 mt-5 list-none p-0"
            aria-labelledby="list-heading"
          >
            {taskList.length > 0 ? (
              taskList
            ) : (
              <p className="text-center text-[1.6rem] text-gray-400 py-8">
                Nenhuma tarefa encontrada neste filtro.
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
