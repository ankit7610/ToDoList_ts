import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';
import { getTodosFromDB, saveTodosToDB } from '../utils/db';

interface UseIndexedDBOptions {
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

export const useIndexedDB = (options: UseIndexedDBOptions = {}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, isLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load todos from IndexedDB
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loaded = await getTodosFromDB();
        setTodos(loaded);
        options.onLoad?.();
        isLoaded(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load todos');
        setError(error);
        options.onError?.(error);
        isLoaded(true);
      }
    };

    loadTodos();
  }, [options]);

  // Save todos to IndexedDB whenever they change
  useEffect(() => {
    if (isLoading) {
      saveTodosToDB(todos).catch((err) => {
        const error = err instanceof Error ? err : new Error('Failed to save todos');
        setError(error);
        options.onError?.(error);
      });
    }
  }, [todos, isLoading, options]);

  const addTodo = useCallback((title: string): Todo => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
};
