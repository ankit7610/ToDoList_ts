import { useCallback } from 'react';
import { Todo } from '../types';

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: string[];
}

export const useBulkTodoOperations = (
  todos: Todo[],
  onUpdate: (todos: Todo[]) => void
) => {
  const bulkToggleComplete = useCallback(
    (todoIds: string[], completed: boolean): BulkOperationResult => {
      try {
        const updated = todos.map((todo) =>
          todoIds.includes(todo.id) ? { ...todo, completed } : todo
        );
        onUpdate(updated);
        return { success: todoIds.length, failed: 0, errors: [] };
      } catch (error) {
        return {
          success: 0,
          failed: todoIds.length,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        };
      }
    },
    [todos, onUpdate]
  );

  const bulkDelete = useCallback(
    (todoIds: string[]): BulkOperationResult => {
      try {
        const updated = todos.filter((todo) => !todoIds.includes(todo.id));
        onUpdate(updated);
        return { success: todoIds.length, failed: 0, errors: [] };
      } catch (error) {
        return {
          success: 0,
          failed: todoIds.length,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        };
      }
    },
    [todos, onUpdate]
  );

  const bulkClearCompleted = useCallback((): BulkOperationResult => {
    try {
      const completedCount = todos.filter((t) => t.completed).length;
      const updated = todos.filter((todo) => !todo.completed);
      onUpdate(updated);
      return { success: completedCount, failed: 0, errors: [] };
    } catch (error) {
      return {
        success: 0,
        failed: todos.length,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }, [todos, onUpdate]);

  const bulkCompleteAll = useCallback((): BulkOperationResult => {
    try {
      const updated = todos.map((todo) => ({ ...todo, completed: true }));
      onUpdate(updated);
      return { success: todos.length, failed: 0, errors: [] };
    } catch (error) {
      return {
        success: 0,
        failed: todos.length,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }, [todos, onUpdate]);

  const bulkResetAll = useCallback((): BulkOperationResult => {
    try {
      const updated = todos.map((todo) => ({ ...todo, completed: false }));
      onUpdate(updated);
      return { success: todos.length, failed: 0, errors: [] };
    } catch (error) {
      return {
        success: 0,
        failed: todos.length,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }, [todos, onUpdate]);

  const bulkUpdateTitles = useCallback(
    (updates: Map<string, string>): BulkOperationResult => {
      const errors: string[] = [];
      let success = 0;

      try {
        const updated = todos.map((todo) => {
          const newTitle = updates.get(todo.id);
          if (newTitle !== undefined) {
            if (newTitle.trim().length === 0) {
              errors.push(`Cannot update todo ${todo.id}: empty title`);
              return todo;
            }
            success++;
            return { ...todo, title: newTitle };
          }
          return todo;
        });

        onUpdate(updated);
        return { success, failed: errors.length, errors };
      } catch (error) {
        return {
          success: 0,
          failed: todos.length,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        };
      }
    },
    [todos, onUpdate]
  );

  const bulkDuplicate = useCallback(
    (todoIds: string[]): BulkOperationResult => {
      try {
        const duplicates = todos
          .filter((todo) => todoIds.includes(todo.id))
          .map((todo) => ({
            ...todo,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            completed: false,
          }));

        onUpdate([...todos, ...duplicates]);
        return { success: duplicates.length, failed: 0, errors: [] };
      } catch (error) {
        return {
          success: 0,
          failed: todoIds.length,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        };
      }
    },
    [todos, onUpdate]
  );

  return {
    bulkToggleComplete,
    bulkDelete,
    bulkClearCompleted,
    bulkCompleteAll,
    bulkResetAll,
    bulkUpdateTitles,
    bulkDuplicate,
  };
};
