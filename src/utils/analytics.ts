import { Todo } from '../types';

export interface TodoAnalytics {
  totalTodos: number;
  completedTodos: number;
  activeTodos: number;
  completionPercentage: number;
  averageCompletionTime: number | null;
  longestStreak: number;
  todosCreatedToday: number;
  todosCompletedToday: number;
  mostProductiveDay: string | null;
}

export const TodoAnalytics = {
  calculateStats: (todos: Todo[]): TodoAnalytics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalTodos = todos.length;
    const completedTodos = todos.filter((t) => t.completed).length;
    const activeTodos = totalTodos - completedTodos;
    const completionPercentage =
      totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

    // Calculate average completion time
    const completedWithTime = todos.filter((t) => t.completed && t.completedAt);
    const averageCompletionTime =
      completedWithTime.length > 0
        ? completedWithTime.reduce((acc, todo) => {
            if (todo.completedAt) {
              const time =
                new Date(todo.completedAt).getTime() -
                new Date(todo.createdAt).getTime();
              return acc + time;
            }
            return acc;
          }, 0) / completedWithTime.length
        : null;

    // Calculate streak (simplified - consecutive days with completions)
    const todosCreatedToday = todos.filter((t) => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= today;
    }).length;

    const todosCompletedToday = todos.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= today;
    }).length;

    // Find most productive day
    const dayCompletions: Record<string, number> = {};
    todos.forEach((todo) => {
      if (todo.completedAt) {
        const date = new Date(todo.completedAt).toLocaleDateString();
        dayCompletions[date] = (dayCompletions[date] || 0) + 1;
      }
    });

    const mostProductiveDay =
      Object.entries(dayCompletions).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      null;

    return {
      totalTodos,
      completedTodos,
      activeTodos,
      completionPercentage,
      averageCompletionTime,
      longestStreak: 0, // Simplified for now
      todosCreatedToday,
      todosCompletedToday,
      mostProductiveDay,
    };
  },

  formatCompletionTime: (ms: number | null): string => {
    if (ms === null) return 'N/A';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },
};
