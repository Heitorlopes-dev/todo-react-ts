import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "todo-ts-heitor-2026",
  appId: "1:1009784456538:web:68da6be33092d13ec19f63",
  storageBucket: "todo-ts-heitor-2026.firebasestorage.app",
  apiKey: "AIzaSyBwlUny-sxa8rUSjuM1HUYIPubLG5F8jyk",
  authDomain: "todo-ts-heitor-2026.firebaseapp.com",
  messagingSenderId: "1009784456538",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
