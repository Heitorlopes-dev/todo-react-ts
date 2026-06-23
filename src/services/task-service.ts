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

export async function createTask(
  userId: string,
  name: string,
): Promise<void> {
  await addDoc(tasksCollection(userId), {
    name,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export async function removeTask(
  userId: string,
  taskId: string,
): Promise<void> {
  await deleteDoc(taskDocument(userId, taskId));
}

export async function renameTask(
  userId: string,
  taskId: string,
  name: string,
): Promise<void> {
  await updateDoc(taskDocument(userId, taskId), { name });
}

export async function toggleTaskCompleted(
  userId: string,
  taskId: string,
  currentCompleted: boolean,
): Promise<void> {
  await updateDoc(taskDocument(userId, taskId), {
    completed: !currentCompleted,
  });
}

export { tasksCollection };
