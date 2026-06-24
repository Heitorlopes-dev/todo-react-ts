import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit as firestoreLimit, startAfter, type Timestamp, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
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
  ref?: QueryDocumentSnapshot<DocumentData>;
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
  createdAt: Timestamp;
}

export async function getUsersPaginated(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null,
  limitSize: number = 20
): Promise<{ users: AdminUser[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean }> {
  const usersRef = collection(db, 'users');
  let q;
  
  if (lastDoc) {
    q = query(usersRef, orderBy('lastLoginAt', 'desc'), startAfter(lastDoc), firestoreLimit(limitSize));
  } else {
    q = query(usersRef, orderBy('lastLoginAt', 'desc'), firestoreLimit(limitSize));
  }

  const snapshot = await getDocs(q);
  
  const users = snapshot.docs.map((doc) => {
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
      ref: doc,
    };
  });

  return {
    users,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === limitSize
  };
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
