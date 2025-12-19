import { useCallback, useState } from 'react';
import { Todo } from '../types';

export interface TodoChange {
  timestamp: Date;
  type: 'add' | 'update' | 'delete' | 'toggle';
  todoId: string;
  oldValue?: Todo;
  newValue?: Todo;
  description: string;
}

export const useTodoHistory = () => {
  const [history, setHistory] = useState<TodoChange[]>([]);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  const recordChange = useCallback(
    (change: Omit<TodoChange, 'timestamp'>) => {
      if (!isTrackingEnabled) return;

      setHistory((prev) => [
        {
          ...change,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    },
    [isTrackingEnabled]
  );

  const recordAdd = useCallback(
    (todo: Todo) => {
      recordChange({
        type: 'add',
        todoId: todo.id,
        newValue: todo,
        description: `Added todo: "${todo.title}"`,
      });
    },
    [recordChange]
  );

  const recordUpdate = useCallback(
    (todoId: string, oldValue: Todo, newValue: Todo) => {
      recordChange({
        type: 'update',
        todoId,
        oldValue,
        newValue,
        description: `Updated todo: "${newValue.title}"`,
      });
    },
    [recordChange]
  );

  const recordDelete = useCallback(
    (todo: Todo) => {
      recordChange({
        type: 'delete',
        todoId: todo.id,
        oldValue: todo,
        description: `Deleted todo: "${todo.title}"`,
      });
    },
    [recordChange]
  );

  const recordToggle = useCallback(
    (todo: Todo, wasCompleted: boolean) => {
      recordChange({
        type: 'toggle',
        todoId: todo.id,
        newValue: todo,
        description: `${wasCompleted ? 'Uncompleted' : 'Completed'} todo: "${todo.title}"`,
      });
    },
    [recordChange]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getRecentChanges = useCallback((limit: number = 10): TodoChange[] => {
    return history.slice(0, limit);
  }, [history]);

  const getChangesByTodo = useCallback((todoId: string): TodoChange[] => {
    return history.filter((change) => change.todoId === todoId);
  }, [history]);

  return {
    history,
    recordChange,
    recordAdd,
    recordUpdate,
    recordDelete,
    recordToggle,
    clearHistory,
    getRecentChanges,
    getChangesByTodo,
    isTrackingEnabled,
    setIsTrackingEnabled,
  };
};
