import { useState, useCallback } from 'react';

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export const getPriorityColor = (priority: TodoPriority): string => {
  switch (priority) {
    case TodoPriority.LOW:
      return '#10b981'; // Green
    case TodoPriority.MEDIUM:
      return '#f59e0b'; // Amber
    case TodoPriority.HIGH:
      return '#ef4444'; // Red
    case TodoPriority.URGENT:
      return '#7c3aed'; // Violet
    default:
      return '#6b7280'; // Gray
  }
};

export const getPriorityLabel = (priority: TodoPriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export const useTodoPriority = () => {
  const [todoPriorities, setTodoPriorities] = useState<Map<string, TodoPriority>>(
    new Map()
  );

  const setPriority = useCallback((todoId: string, priority: TodoPriority) => {
    setTodoPriorities((prev) => {
      const next = new Map(prev);
      next.set(todoId, priority);
      return next;
    });
  }, []);

  const getPriority = useCallback(
    (todoId: string): TodoPriority => {
      return todoPriorities.get(todoId) || TodoPriority.MEDIUM;
    },
    [todoPriorities]
  );

  const sortByPriority = useCallback(
    (todoIds: string[]): string[] => {
      const priorityOrder = [
        TodoPriority.URGENT,
        TodoPriority.HIGH,
        TodoPriority.MEDIUM,
        TodoPriority.LOW,
      ];

      return [...todoIds].sort((a, b) => {
        const priorityA = todoPriorities.get(a) || TodoPriority.MEDIUM;
        const priorityB = todoPriorities.get(b) || TodoPriority.MEDIUM;

        return priorityOrder.indexOf(priorityA) - priorityOrder.indexOf(priorityB);
      });
    },
    [todoPriorities]
  );

  const getTodosByPriority = useCallback(
    (priority: TodoPriority, todoIds: string[]): string[] => {
      return todoIds.filter((id) => (todoPriorities.get(id) || TodoPriority.MEDIUM) === priority);
    },
    [todoPriorities]
  );

  const clearPriority = useCallback((todoId: string) => {
    setTodoPriorities((prev) => {
      const next = new Map(prev);
      next.delete(todoId);
      return next;
    });
  }, []);

  return {
    todoPriorities,
    setPriority,
    getPriority,
    sortByPriority,
    getTodosByPriority,
    clearPriority,
  };
};
