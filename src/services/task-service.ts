import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

function tasksCollection(userId: string) {
  return collection(db, 'users', userId, 'tasks');
}

function taskDocument(userId: string, taskId: string) {
  return doc(db, 'users', userId, 'tasks', taskId);
}

import { createActivityLog } from './activity-service';

export async function createTask(
  userId: string,
  name: string,
): Promise<void> {
  await addDoc(tasksCollection(userId), {
    name,
    completed: false,
    createdAt: serverTimestamp(),
  });
  
  await createActivityLog({
    userId,
    action: 'task_created',
    category: 'tasks',
    description: `Criou a tarefa "${name}"`,
  }).catch(console.error);
}

export async function removeTask(
  userId: string,
  taskId: string,
  taskName?: string,
): Promise<void> {
  await deleteDoc(taskDocument(userId, taskId));
  
  await createActivityLog({
    userId,
    action: 'task_deleted',
    category: 'tasks',
    description: `Deletou a tarefa${taskName ? ` "${taskName}"` : ''}`,
  }).catch(console.error);
}

export async function renameTask(
  userId: string,
  taskId: string,
  newName: string,
  oldName?: string,
): Promise<void> {
  await updateDoc(taskDocument(userId, taskId), { name: newName });
  
  await createActivityLog({
    userId,
    action: 'task_edited',
    category: 'tasks',
    description: `Renomeou a tarefa${oldName ? ` "${oldName}"` : ''} para "${newName}"`,
  }).catch(console.error);
}

export async function toggleTaskCompleted(
  userId: string,
  taskId: string,
  currentCompleted: boolean,
  taskName?: string,
): Promise<void> {
  await updateDoc(taskDocument(userId, taskId), {
    completed: !currentCompleted,
  });
  
  await createActivityLog({
    userId,
    action: !currentCompleted ? 'task_completed' : 'task_uncompleted',
    category: 'tasks',
    description: `Marcou a tarefa${taskName ? ` "${taskName}"` : ''} como ${!currentCompleted ? 'concluída' : 'pendente'}`,
  }).catch(console.error);
}

export { tasksCollection };
