import React from 'react';
import { Todo } from '../types';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="todo-item" role="listitem">
      <input
        aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <div style={{flex: 1}}>
        <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </span>
        <span className="timestamp">{new Date(todo.createdAt).toLocaleString()}</span>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        title="Delete todo"
        aria-label={`Delete ${todo.title}`}
      >
        ✕
      </button>
    </li>
  );
};

export default TodoItem;
