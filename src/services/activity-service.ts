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
  writeBatch,
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

export async function clearUserActivities(userId: string): Promise<void> {
  const snapshot = await getDocs(activitiesCollection(userId));
  if (snapshot.empty) return;
  
  // Firestore allows up to 500 writes per batch.
  // For larger sets, multiple batches would be needed, but since we limit fetches to 50 mostly, one batch is usually enough for typical history sizes.
  // We will loop through chunks of 500.
  const batches = [];
  let currentBatch = writeBatch(db);
  let count = 0;

  snapshot.docs.forEach((doc) => {
    currentBatch.delete(doc.ref);
    count++;
    if (count === 500) {
      batches.push(currentBatch.commit());
      currentBatch = writeBatch(db);
      count = 0;
    }
  });

  if (count > 0) {
    batches.push(currentBatch.commit());
  }

  await Promise.all(batches);
}

export { activitiesCollection };
