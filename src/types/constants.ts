import { Todo } from '../types';

export enum TodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum TodoSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  COMPLETED_FIRST = 'completed_first',
  ACTIVE_FIRST = 'active_first',
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionPercentage: number;
}

export interface FilterOptions {
  filter: TodoFilter;
  sort: TodoSort;
  searchQuery: string;
}
