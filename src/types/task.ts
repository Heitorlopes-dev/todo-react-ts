import type { Timestamp } from 'firebase/firestore';

export type Task = {
  id: string;
  name: string;
  completed: boolean;
  createdAt?: Timestamp;
};
