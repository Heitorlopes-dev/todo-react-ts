import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

/**
 * Cria ou atualiza o documento raiz do usuário no Firestore.
 * Isso garante que haja um documento em /users/{uid} para melhor rastreamento no painel.
 */
export async function upsertUserDocument(user: User): Promise<void> {
  if (!user || !user.uid) return;

  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error('Erro ao salvar documento principal do usuário no Firestore', err);
  }
}
