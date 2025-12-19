import { useState, useCallback } from 'react';

export interface TodoTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface TaggedTodo {
  todoId: string;
  tagIds: string[];
}

export const useTodoTags = (initialTags: TodoTag[] = []) => {
  const [tags, setTags] = useState<TodoTag[]>(initialTags);
  const [todoTags, setTodoTags] = useState<Map<string, string[]>>(new Map());

  const addTag = useCallback((name: string, color: string = '#3b82f6') => {
    const newTag: TodoTag = {
      id: crypto.randomUUID(),
      name,
      color,
      count: 0,
    };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  }, []);

  const updateTag = useCallback((tagId: string, updates: Partial<TodoTag>) => {
    setTags((prev) =>
      prev.map((tag) =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      )
    );
  }, []);

  const deleteTag = useCallback((tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
    setTodoTags((prev) => {
      const next = new Map(prev);
      next.forEach((tagIds) => {
        const index = tagIds.indexOf(tagId);
        if (index > -1) {
          tagIds.splice(index, 1);
        }
      });
      return next;
    });
  }, []);

  const addTagToTodo = useCallback((todoId: string, tagId: string) => {
    setTodoTags((prev) => {
      const next = new Map(prev);
      const tags = next.get(todoId) || [];
      if (!tags.includes(tagId)) {
        tags.push(tagId);
        next.set(todoId, tags);
      }
      return next;
    });
  }, []);

  const removeTagFromTodo = useCallback((todoId: string, tagId: string) => {
    setTodoTags((prev) => {
      const next = new Map(prev);
      const tags = next.get(todoId) || [];
      const filtered = tags.filter((t) => t !== tagId);
      if (filtered.length === 0) {
        next.delete(todoId);
      } else {
        next.set(todoId, filtered);
      }
      return next;
    });
  }, []);

  const getTodosByTag = useCallback(
    (tagId: string): string[] => {
      const todoIds: string[] = [];
      todoTags.forEach((tags, todoId) => {
        if (tags.includes(tagId)) {
          todoIds.push(todoId);
        }
      });
      return todoIds;
    },
    [todoTags]
  );

  const getTagsForTodo = useCallback(
    (todoId: string): TodoTag[] => {
      const tagIds = todoTags.get(todoId) || [];
      return tags.filter((tag) => tagIds.includes(tag.id));
    },
    [tags, todoTags]
  );

  const getTagsWithCounts = useCallback((): TodoTag[] => {
    return tags.map((tag) => ({
      ...tag,
      count: getTodosByTag(tag.id).length,
    }));
  }, [tags, getTodosByTag]);

  return {
    tags,
    todoTags,
    addTag,
    updateTag,
    deleteTag,
    addTagToTodo,
    removeTagFromTodo,
    getTodosByTag,
    getTagsForTodo,
    getTagsWithCounts,
  };
};
