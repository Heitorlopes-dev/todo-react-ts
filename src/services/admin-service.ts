import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit as firestoreLimit, type Timestamp } from 'firebase/firestore';
import type { ActivityAction, ActivityCategory } from './activity-service';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  emailVerified: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
  createdAt: Timestamp;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      role: data.role || 'user',
      emailVerified: data.emailVerified || false,
      createdAt: data.createdAt as Timestamp,
      lastLoginAt: data.lastLoginAt as Timestamp,
    };
  });
}

export async function getUserActivitiesAsAdmin(
  userId: string,
  limit: number = 100
): Promise<AdminActivityLog[]> {
  const activitiesRef = collection(db, 'users', userId, 'activities');
  const activitiesQuery = query(
    activitiesRef,
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
