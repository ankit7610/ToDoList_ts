export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority?: Priority;
  category?: string;
  notes?: string;
  dueDate?: Date;
  notified?: boolean;
}

export interface FilterOptions {
  search: string;
  priority?: Priority;
  category?: string;
  showCompleted: boolean;
  dueDateFilter?: 'today' | 'week' | 'overdue' | 'all';
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byCategory: Record<string, number>;
}
