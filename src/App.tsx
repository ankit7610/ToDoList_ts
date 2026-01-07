import React, { useState, useEffect } from 'react';
import { Todo, Priority } from './types';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import ThemeSwitcher from './components/ThemeSwitcher';
import { getTodosFromDB, saveTodosToDB } from './utils/db';
import { useTheme } from './hooks/useTheme';
import './App.css';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useTheme('system'); // Initialize theme hook

  // Load todos from IndexedDB on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await getTodosFromDB();
        if (savedTodos && savedTodos.length > 0) {
          setTodos(savedTodos.map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt)
          })));
        }
      } catch (error) {
        console.error('Failed to load todos from IndexedDB:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTodos();
  }, []);

  // Save todos to IndexedDB whenever they change, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      saveTodosToDB(todos).catch(error => {
        console.error('Failed to save todos to IndexedDB:', error);
      });
    }
  }, [todos, isLoaded]);

  const addTodo = ({
    title,
    priority,
    category,
    notes,
    dueDate
  }: {
    title: string;
    priority?: Priority;
    category?: string;
    notes?: string;
    dueDate?: Date;
  }): void => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      priority,
      category,
      notes,
      dueDate,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>My Todo App</h1>
          <ThemeSwitcher />
          {totalCount > 0 && (
            <p className="stats">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </header>

        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
};

export default App;
