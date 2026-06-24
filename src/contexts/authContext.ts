import { createContext } from 'react';
import type { User } from 'firebase/auth';

type TimestampValue = 
  | Date 
  | number 
  | string 
  | { toDate: () => Date } 
  | { seconds: number } 
  | null 
  | undefined;

export type UserData = {
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  role?: string;
  createdAt?: TimestampValue;
  lastLoginAt?: TimestampValue;
};

export type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (mode: 'login' | 'register') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUserAccount: (currentPassword?: string) => Promise<void>;
  isGoogleUser: () => boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
