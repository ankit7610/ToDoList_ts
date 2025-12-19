import { useState, useCallback } from 'react';
import { useTodoFiltering, useTodoStats } from './useTodoFiltering';
import { Todo } from '../types';
import { TodoFilter, TodoSort, FilterOptions } from '../types/constants';

export const useTodoSearch = (todos: Todo[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [sort, setSort] = useState<TodoSort>(TodoSort.NEWEST);

  const filterOptions: FilterOptions = {
    filter,
    sort,
    searchQuery,
  };

  const filteredTodos = useTodoFiltering(todos, filterOptions);
  const stats = useTodoStats(todos);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilter(TodoFilter.ALL);
    setSort(TodoSort.NEWEST);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sort,
    setSort,
    filteredTodos,
    stats,
    clearSearch,
    resetFilters,
  };
};
