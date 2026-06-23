import { FirebaseError } from 'firebase/app';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/email-already-in-use': 'Este email já está em uso.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'Email inválido.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/requires-recent-login': 'Por segurança, faça logout e login novamente.',
  'auth/operation-not-allowed': 'Método de login não ativado no Console do Firebase.',
  'auth/popup-closed-by-user': 'Login com Google cancelado.',
  'auth/cancelled-popup-request': 'Login com Google cancelado.',
  'auth/popup-blocked': 'Popup bloqueado pelo navegador. Permita popups para este site.',
};

export function getFirebaseErrorMessage(
  err: unknown,
  fallback = 'Ocorreu um erro. Tente novamente.',
): string {
  if (err instanceof FirebaseError) {
    return ERROR_MESSAGES[err.code] ?? `${fallback} (${err.code})`;
  }
  return fallback;
}
