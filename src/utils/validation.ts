import { Todo } from '../types';

export class TodoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoValidationError';
  }
}

export const TodoValidator: {
  validateTitle: (title: string) => void;
  validateTodo: (todo: unknown) => asserts todo is Todo;
  validateTodos: (todos: unknown) => asserts todos is Todo[];
  sanitizeTitle: (title: string) => string;
} = {
  validateTitle: (title: string): void => {
    if (typeof title !== 'string') {
      throw new TodoValidationError('Title must be a string');
    }

    const trimmed = title.trim();

    if (trimmed.length === 0) {
      throw new TodoValidationError('Title cannot be empty');
    }

    if (trimmed.length > 500) {
      throw new TodoValidationError('Title cannot exceed 500 characters');
    }
  },

  validateTodo: (todo: unknown): asserts todo is Todo => {
    if (!todo || typeof todo !== 'object') {
      throw new TodoValidationError('Todo must be an object');
    }

    const t = todo as Record<string, unknown>;

    if (!t.id || typeof t.id !== 'string') {
      throw new TodoValidationError('Todo must have a valid id');
    }

    if (!t.title || typeof t.title !== 'string') {
      throw new TodoValidationError('Todo must have a valid title');
    }

    if (typeof t.completed !== 'boolean') {
      throw new TodoValidationError('Todo completed status must be a boolean');
    }

    if (!(t.createdAt instanceof Date)) {
      throw new TodoValidationError('Todo must have a valid createdAt date');
    }
  },

  validateTodos: (todos: unknown): asserts todos is Todo[] => {
    if (!Array.isArray(todos)) {
      throw new TodoValidationError('Todos must be an array');
    }

    todos.forEach((todo, index) => {
      try {
        TodoValidator.validateTodo(todo);
      } catch (error) {
        throw new TodoValidationError(
          `Invalid todo at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  },

  sanitizeTitle: (title: string): string => {
    return title.trim().slice(0, 500);
  },
};
