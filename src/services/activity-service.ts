import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  limit as firestoreLimit,
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';

export type ActivityAction = 
  | 'task_created'
  | 'task_completed'
  | 'task_uncompleted'
  | 'task_deleted'
  | 'task_edited'
  | 'user_login'
  | 'user_logout'
  | 'password_changed'
  | 'display_name_changed'
  | 'account_deleted';

export type ActivityCategory = 
  | 'tasks'
  | 'auth'
  | 'profile'
  | 'security';

export interface ActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
  createdAt: Timestamp;
}

export interface CreateActivityLogInput {
  userId: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
}

function activitiesCollection(userId: string) {
  return collection(db, 'users', userId, 'activities');
}

export async function createActivityLog(input: CreateActivityLogInput): Promise<void> {
  await addDoc(activitiesCollection(input.userId), {
    action: input.action,
    category: input.category,
    description: input.description,
    createdAt: serverTimestamp(),
  });
}

export async function getUserActivities(
  userId: string,
  limit: number = 50
): Promise<ActivityLog[]> {
  const activitiesQuery = query(
    activitiesCollection(userId),
    orderBy('createdAt', 'desc'),
    firestoreLimit(limit)
  );
  
  const snapshot = await getDocs(activitiesQuery);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    userId,
    action: doc.data().action as ActivityAction,
    category: doc.data().category as ActivityCategory,
    description: doc.data().description as string,
    createdAt: doc.data().createdAt as Timestamp,
  }));
}

export { activitiesCollection };
