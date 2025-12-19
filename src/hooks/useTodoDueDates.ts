import { useState, useCallback } from 'react';

export interface TodoDueDate {
  todoId: string;
  dueDate: Date;
  isOverdue: boolean;
  daysUntilDue: number;
}

export const useTodoDueDates = () => {
  const [dueDates, setDueDates] = useState<Map<string, Date>>(new Map());

  const setDueDate = useCallback((todoId: string, dueDate: Date) => {
    setDueDates((prev) => {
      const next = new Map(prev);
      next.set(todoId, dueDate);
      return next;
    });
  }, []);

  const getDueDate = useCallback(
    (todoId: string): Date | null => {
      return dueDates.get(todoId) || null;
    },
    [dueDates]
  );

  const calculateDaysUntilDue = useCallback((dueDate: Date): number => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const isOverdue = useCallback((todoId: string): boolean => {
    const dueDate = dueDates.get(todoId);
    if (!dueDate) return false;
    return calculateDaysUntilDue(dueDate) < 0;
  }, [dueDates, calculateDaysUntilDue]);

  const getDueDateInfo = useCallback(
    (todoId: string): TodoDueDate | null => {
      const dueDate = dueDates.get(todoId);
      if (!dueDate) return null;

      const daysUntilDue = calculateDaysUntilDue(dueDate);
      return {
        todoId,
        dueDate,
        isOverdue: daysUntilDue < 0,
        daysUntilDue,
      };
    },
    [dueDates, calculateDaysUntilDue]
  );

  const getOverdueTodos = useCallback(
    (todoIds: string[]): string[] => {
      return todoIds.filter((id) => isOverdue(id));
    },
    [isOverdue]
  );

  const getDueTodosThisWeek = useCallback(
    (todoIds: string[]): string[] => {
      return todoIds.filter((id) => {
        const info = getDueDateInfo(id);
        if (!info) return false;
        return info.daysUntilDue >= 0 && info.daysUntilDue <= 7;
      });
    },
    [getDueDateInfo]
  );

  const sortByDueDate = useCallback(
    (todoIds: string[]): string[] => {
      return [...todoIds].sort((a, b) => {
        const dueDateA = dueDates.get(a);
        const dueDateB = dueDates.get(b);

        if (!dueDateA && !dueDateB) return 0;
        if (!dueDateA) return 1;
        if (!dueDateB) return -1;

        return dueDateA.getTime() - dueDateB.getTime();
      });
    },
    [dueDates]
  );

  const formatDueDate = useCallback((dueDate: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffMs = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return dueDate.toLocaleDateString();
    }
  }, []);

  const clearDueDate = useCallback((todoId: string) => {
    setDueDates((prev) => {
      const next = new Map(prev);
      next.delete(todoId);
      return next;
    });
  }, []);

  return {
    dueDates,
    setDueDate,
    getDueDate,
    isOverdue,
    getDueDateInfo,
    getOverdueTodos,
    getDueTodosThisWeek,
    sortByDueDate,
    formatDueDate,
    clearDueDate,
  };
};
