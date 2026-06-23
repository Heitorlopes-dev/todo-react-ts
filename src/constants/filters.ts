import type { Task } from '@/types';

export const FILTER_MAP = {
  Todas: () => true,
  Ativas: (task: Task) => !task.completed,
  Completadas: (task: Task) => task.completed,
} as const;

export type FilterName = keyof typeof FILTER_MAP;
export const FILTER_NAMES = Object.keys(FILTER_MAP) as FilterName[];
