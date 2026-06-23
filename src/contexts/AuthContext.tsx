import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observa mudanças de estado do usuário (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cancela a assinatura quando o componente é desmontado
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    await signOut(auth);
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) throw new Error('Nenhum usuário autenticado.');
    await updateProfile(auth.currentUser, { displayName: name });
    // Força re-render atualizando o estado com o objeto atualizado
    setUser({ ...auth.currentUser });
  }

  async function updateUserPassword(currentPassword: string, newPassword: string) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('Nenhum usuário autenticado.');
    // Re-autentica o usuário antes de alterar a senha (exigido pelo Firebase)
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  }

  async function deleteUserAccount(currentPassword: string) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('Nenhum usuário autenticado.');
    // Re-autentica antes de excluir (exigido pelo Firebase)
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logOut,
        updateDisplayName,
        updateUserPassword,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
