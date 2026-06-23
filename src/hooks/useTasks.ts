import { useState, useEffect, useCallback } from 'react';
import { query, orderBy, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Task } from '@/types';
import {
  tasksCollection,
  createTask,
  removeTask,
  renameTask,
  toggleTaskCompleted as toggleTaskService,
} from '@/services/task-service';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(tasksCollection(userId), orderBy('createdAt', 'asc'));

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
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao escutar tarefas no Firestore:', error);
        toast.error('Erro de conexão ao carregar tarefas.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const addTask = useCallback(
    async (name: string) => {
      if (!userId) return;
      const trimmedName = name.trim();
      if (!trimmedName) return;
      try {
        await createTask(userId, trimmedName);
        toast.success('Tarefa adicionada!');
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        toast.error('Erro ao adicionar tarefa.');
      }
    },
    [userId],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!userId) return;
      const task = tasks.find((t) => t.id === id);
      try {
        await removeTask(userId, id, task?.name);
        toast.success('Tarefa excluída!');
      } catch (error) {
        console.error('Erro ao remover tarefa:', error);
        toast.error('Erro ao excluir tarefa.');
      }
    },
    [userId, tasks],
  );

  const editTask = useCallback(
    async (id: string, newName: string) => {
      if (!userId) return;
      const trimmedName = newName.trim();
      if (!trimmedName) return;
      const task = tasks.find((t) => t.id === id);
      try {
        await renameTask(userId, id, trimmedName, task?.name);
        toast.success('Tarefa renomeada!');
      } catch (error) {
        console.error('Erro ao editar tarefa:', error);
        toast.error('Erro ao salvar alteração.');
      }
    },
    [userId, tasks],
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (!userId) return;
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      try {
        await toggleTaskService(userId, id, task.completed, task.name);
        toast.success(
          task.completed ? 'Tarefa marcada como ativa' : 'Tarefa concluída com sucesso!',
        );
      } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        toast.error('Erro ao alterar status da tarefa.');
      }
    },
    [userId, tasks],
  );

  return { tasks, loading, addTask, deleteTask, editTask, toggleTask };
}
