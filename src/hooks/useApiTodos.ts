import { useState, useCallback } from 'react';
import { Todo } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const useApiTodos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all todos
  const fetchTodos = useCallback(async (): Promise<Todo[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const json = (await response.json()) as ApiResponse<Todo[]>;
      return json.data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get single todo
  const fetchTodo = useCallback(async (id: string): Promise<Todo | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch todo');
      const json = (await response.json()) as ApiResponse<Todo>;
      return json.data || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todo';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create todo
  const createTodo = useCallback(async (title: string): Promise<Todo> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Failed to create todo');
      }
      const json = (await response.json()) as ApiResponse<Todo>;
      return json.data || { id: '', title, completed: false, createdAt: new Date() };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create todo';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update todo
  const updateTodo = useCallback(
    async (id: string, updates: Partial<Todo>): Promise<Todo> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.error || 'Failed to update todo');
        }
        const json = (await response.json()) as ApiResponse<Todo>;
        return json.data || { id, ...updates } as Todo;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update todo';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete todo
  const deleteTodo = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Failed to delete todo');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle todo completion
  const toggleTodo = useCallback(
    async (id: string, currentCompleted: boolean): Promise<Todo> => {
      return updateTodo(id, { completed: !currentCompleted });
    },
    [updateTodo]
  );

  // Clear completed todos
  const clearCompleted = useCallback(async (): Promise<number> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Failed to clear completed todos');
      }
      const json = (await response.json()) as ApiResponse<unknown> & { deletedCount: number };
      return json.deletedCount || 0;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear completed todos';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
};
