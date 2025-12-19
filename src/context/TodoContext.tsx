import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Todo } from '../types';
import { TodoFilter, TodoSort } from '../types/constants';

interface FilterOptions {
  filter: TodoFilter;
  sort: TodoSort;
  searchQuery: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  setFilter: (filter: TodoFilter) => void;
  setSort: (sort: TodoSort) => void;
  setSearchQuery: (query: string) => void;
  clearCompleted: () => void;
  isLoaded: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
  initialTodos: Todo[];
  onTodosChange: (todos: Todo[]) => void;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({
  children,
  initialTodos,
  onTodosChange,
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isLoaded, setIsLoaded] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    filter: TodoFilter.ALL,
    sort: TodoSort.NEWEST,
    searchQuery: '',
  });

  const updateTodos = useCallback(
    (newTodos: Todo[]) => {
      setTodos(newTodos);
      onTodosChange(newTodos);
    },
    [onTodosChange]
  );

  const addTodo = useCallback(
    (title: string) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        createdAt: new Date(),
      };
      updateTodos([...todos, newTodo]);
    },
    [todos, updateTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      updateTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [todos, updateTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      updateTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos, updateTodos]
  );

  const updateTodo = useCallback(
    (id: string, updates: Partial<Todo>) => {
      updateTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );
    },
    [todos, updateTodos]
  );

  const setFilter = useCallback((filter: TodoFilter) => {
    setFilterOptions((prev) => ({ ...prev, filter }));
  }, []);

  const setSort = useCallback((sort: TodoSort) => {
    setFilterOptions((prev) => ({ ...prev, sort }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearCompleted = useCallback(() => {
    updateTodos(todos.filter((todo) => !todo.completed));
  }, [todos, updateTodos]);

  const value: TodoContextType = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    filterOptions,
    setFilterOptions,
    setFilter,
    setSort,
    setSearchQuery,
    clearCompleted,
    isLoaded,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }
  return context;
};
