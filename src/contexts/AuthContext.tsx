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
  sendEmailVerification,
  getAdditionalUserInfo,
  type User,
} from 'firebase/auth';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthContext } from './authContext';
import { createActivityLog } from '../services/activity-service';

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
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await createActivityLog({
      userId: cred.user.uid,
      action: 'user_login',
      category: 'auth',
      description: 'Fez login no sistema',
    }).catch(console.error);
  }

  async function signUp(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    // Removemos o log de atividade aqui para não criar documentos até a confirmação de e-mail
  }

  async function signInWithGoogle(mode: 'login' | 'register') {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(cred);
    
    if (mode === 'register' && !additionalInfo?.isNewUser) {
      await signOut(auth);
      throw new Error('Conta já cadastrada. Por favor, faça login.');
    }
    
    if (mode === 'login' && additionalInfo?.isNewUser) {
      await deleteUser(cred.user);
      throw new Error('Conta não encontrada. Por favor, cadastre-se.');
    }

    await createActivityLog({
      userId: cred.user.uid,
      action: 'user_login',
      category: 'auth',
      description: mode === 'register' ? 'Criou uma nova conta com Google' : 'Fez login com o Google',
    }).catch(console.error);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logOut() {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await createActivityLog({
        userId: uid,
        action: 'user_logout',
        category: 'auth',
        description: 'Saiu da conta',
      }).catch(console.error);
    }
    await signOut(auth);
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) throw new Error('Nenhum usuário autenticado.');
    await updateProfile(auth.currentUser, { displayName: name });
    setUser({ ...auth.currentUser });
    await createActivityLog({
      userId: auth.currentUser.uid,
      action: 'display_name_changed',
      category: 'profile',
      description: `Alterou o nome de exibição para "${name}"`,
    }).catch(console.error);
  }

  async function updateUserPassword(currentPassword: string, newPassword: string) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('Nenhum usuário autenticado.');
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
    await createActivityLog({
      userId: currentUser.uid,
      action: 'password_changed',
      category: 'security',
      description: 'Alterou a senha da conta',
    }).catch(console.error);
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

    await createActivityLog({
      userId: currentUser.uid,
      action: 'account_deleted',
      category: 'security',
      description: 'Excluiu a própria conta permanentemente',
    }).catch(console.error);

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
