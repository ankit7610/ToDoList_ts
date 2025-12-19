import { useCallback, useState } from 'react';
import { Todo } from '../types';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useUndoRedo = (initialState: Todo[]) => {
  const [history, setHistory] = useState<UndoRedoState<Todo[]>>({
    past: [],
    present: initialState,
    future: [],
  });

  const push = useCallback((newState: Todo[]) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newState,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newPresent = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return { todos: history.present, push, undo, redo, canUndo, canRedo };
};
