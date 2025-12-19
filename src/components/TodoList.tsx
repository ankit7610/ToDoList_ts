import React from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <svg width="120" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 6h16v12H4z" stroke="#dfe7ff" strokeWidth="1.2" fill="#f8fbff"/>
          <path d="M8 10h8" stroke="#c4d3ff" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 13h8" stroke="#c4d3ff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div className="empty-text">
          <h3>No todos yet</h3>
          <p>Add a task to get started — it will be saved locally.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
