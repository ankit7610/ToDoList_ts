import { useMemo } from 'react';
import { Todo } from '../types';
import { TodoFilter, TodoSort, FilterOptions, TodoStats } from '../types/constants';

export const useTodoFiltering = (todos: Todo[], options: FilterOptions) => {
  const filtered = useMemo(() => {
    let result = todos;

    // Apply filter
    if (options.filter === TodoFilter.ACTIVE) {
      result = result.filter((todo) => !todo.completed);
    } else if (options.filter === TodoFilter.COMPLETED) {
      result = result.filter((todo) => todo.completed);
    }

    // Apply search
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (options.sort === TodoSort.OLDEST) {
      result = result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (options.sort === TodoSort.COMPLETED_FIRST) {
      result = result.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? -1 : 1;
      });
    } else if (options.sort === TodoSort.ACTIVE_FIRST) {
      result = result.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    }
    // NEWEST is default (original order)

    return result;
  }, [todos, options]);

  return filtered;
};

export const useTodoStats = (todos: Todo[]): TodoStats => {
  return useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      active,
      completionPercentage,
    };
  }, [todos]);
};
