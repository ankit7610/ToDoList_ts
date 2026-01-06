import { Todo, TodoStats } from '../types';

export const calculateStats = (todos: Todo[]): TodoStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats: TodoStats = {
        total: todos.length,
        completed: 0,
        pending: 0,
        overdue: 0,
        byPriority: {
            high: 0,
            medium: 0,
            low: 0,
        },
        byCategory: {},
    };

    todos.forEach(todo => {
        if (todo.completed) {
            stats.completed++;
        } else {
            stats.pending++;
        }

        // Check overdue
        if (todo.dueDate && !todo.completed) {
            const dueDate = new Date(todo.dueDate);
            const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            if (dueDateOnly < today) {
                stats.overdue++;
            }
        }

        // Count by priority
        if (todo.priority) {
            stats.byPriority[todo.priority]++;
        }

        // Count by category
        if (todo.category) {
            stats.byCategory[todo.category] = (stats.byCategory[todo.category] || 0) + 1;
        }
    });

    return stats;
};

export const getCompletionRate = (stats: TodoStats): number => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
};
