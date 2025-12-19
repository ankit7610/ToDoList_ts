import { useState, useCallback } from 'react';
import { useDebouncedValue } from './useDebounce';
import { Todo } from '../types';

export const useDebouncedSearch = (todos: Todo[], delay: number = 300) => {
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const [selectedTodoIds, setSelectedTodoIds] = useState<Set<string>>(new Set());

  // Debounce the search query
  const debouncedSearchQuery = useDebouncedValue(rawSearchQuery, delay);

  // Perform search on debounced value
  const searchResults = todos.filter((todo) => {
    if (!debouncedSearchQuery) return true;
    return todo.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
  });

  const toggleTodoSelection = useCallback((todoId: string) => {
    setSelectedTodoIds((prev) => {
      const next = new Set(prev);
      if (next.has(todoId)) {
        next.delete(todoId);
      } else {
        next.add(todoId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedTodoIds(new Set(searchResults.map((t) => t.id)));
  }, [searchResults]);

  const deselectAll = useCallback(() => {
    setSelectedTodoIds(new Set());
  }, []);

  const clearSearch = useCallback(() => {
    setRawSearchQuery('');
  }, []);

  const getSelectedTodos = useCallback(
    () => todos.filter((t) => selectedTodoIds.has(t.id)),
    [todos, selectedTodoIds]
  );

  return {
    rawSearchQuery,
    setRawSearchQuery,
    debouncedSearchQuery,
    searchResults,
    selectedTodoIds,
    toggleTodoSelection,
    selectAll,
    deselectAll,
    clearSearch,
    getSelectedTodos,
    searchResultCount: searchResults.length,
    selectedCount: selectedTodoIds.size,
  };
};
