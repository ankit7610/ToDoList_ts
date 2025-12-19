import { Todo } from '../types';
import { TodoValidator } from './validation';

export interface ExportFormat {
  version: string;
  exportDate: string;
  todos: Todo[];
}

export const TodoSerializer = {
  exportToJSON: (todos: Todo[]): string => {
    TodoValidator.validateTodos(todos);

    const exportData: ExportFormat = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      todos: todos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt instanceof Date
          ? todo.createdAt.toISOString()
          : todo.createdAt,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  },

  importFromJSON: (jsonString: string): Todo[] => {
    try {
      const data = JSON.parse(jsonString) as ExportFormat;

      if (!data.version || !Array.isArray(data.todos)) {
        throw new Error('Invalid export format');
      }

      const todos = data.todos.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));

      TodoValidator.validateTodos(todos);
      return todos;
    } catch (error) {
      throw new Error(
        `Failed to import todos: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  exportToCSV: (todos: Todo[]): string => {
    TodoValidator.validateTodos(todos);

    const headers = ['ID', 'Title', 'Completed', 'Created At'];
    const rows = todos.map((todo) => [
      todo.id,
      `"${todo.title.replace(/"/g, '""')}"`,
      todo.completed ? 'Yes' : 'No',
      new Date(todo.createdAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  },

  downloadAsJSON: (todos: Todo[], filename: string = 'todos.json'): void => {
    const jsonString = TodoSerializer.exportToJSON(todos);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  downloadAsCSV: (todos: Todo[], filename: string = 'todos.csv'): void => {
    const csvContent = TodoSerializer.exportToCSV(todos);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};
