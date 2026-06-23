import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  signInWithPopup,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logOut() {
    await signOut(auth);
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) throw new Error('Nenhum usuário autenticado.');
    await updateProfile(auth.currentUser, { displayName: name });
    setUser({ ...auth.currentUser });
  }

  async function updateUserPassword(currentPassword: string, newPassword: string) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('Nenhum usuário autenticado.');
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  }

  function isGoogleUser(): boolean {
    return auth.currentUser?.providerData.some(
      (p) => p.providerId === 'google.com',
    ) ?? false;
  }

  async function deleteUserAccount(currentPassword?: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Nenhum usuário autenticado.');

    // Re-authenticate based on provider
    if (isGoogleUser()) {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(currentUser, provider);
    } else {
      if (!currentPassword || !currentUser.email) {
        throw new Error('Senha necessária para re-autenticação.');
      }
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
    }

    // Delete all user tasks before deleting account (F-21 compliance)
    const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
    const snapshot = await getDocs(tasksRef);
    if (!snapshot.empty) {
      const batch = writeBatch(db);
      snapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    await deleteUser(currentUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        logOut,
        updateDisplayName,
        updateUserPassword,
        deleteUserAccount,
        isGoogleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
