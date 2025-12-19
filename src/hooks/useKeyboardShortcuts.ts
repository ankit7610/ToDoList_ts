import { useEffect, useCallback } from 'react';

export enum KeyboardShortcut {
  UNDO = 'undo',
  REDO = 'redo',
  ADD_TODO = 'addTodo',
  CLEAR_SEARCH = 'clearSearch',
  FOCUS_SEARCH = 'focusSearch',
}

export interface KeyboardShortcutMap {
  [KeyboardShortcut.UNDO]?: () => void;
  [KeyboardShortcut.REDO]?: () => void;
  [KeyboardShortcut.ADD_TODO]?: () => void;
  [KeyboardShortcut.CLEAR_SEARCH]?: () => void;
  [KeyboardShortcut.FOCUS_SEARCH]?: () => void;
}

const isCtrlOrCmd = (e: KeyboardEvent): boolean => {
  return (e.ctrlKey && !e.metaKey) || (e.metaKey && !e.ctrlKey);
};

const isShift = (e: KeyboardEvent): boolean => {
  return e.shiftKey;
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutMap): void => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInputting =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true';

      // Ctrl/Cmd + Z: Undo
      if (isCtrlOrCmd(e) && !isShift(e) && e.key.toLowerCase() === 'z') {
        if (shortcuts[KeyboardShortcut.UNDO]) {
          e.preventDefault();
          shortcuts[KeyboardShortcut.UNDO]!();
        }
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if (isCtrlOrCmd(e) && isShift(e) && e.key.toLowerCase() === 'z') {
        if (shortcuts[KeyboardShortcut.REDO]) {
          e.preventDefault();
          shortcuts[KeyboardShortcut.REDO]!();
        }
      }

      // Ctrl/Cmd + Enter: Add todo (only when not in input)
      if (isCtrlOrCmd(e) && e.key === 'Enter' && !isInputting) {
        if (shortcuts[KeyboardShortcut.ADD_TODO]) {
          e.preventDefault();
          shortcuts[KeyboardShortcut.ADD_TODO]!();
        }
      }

      // Escape: Clear search
      if (e.key === 'Escape' && isInputting) {
        if (shortcuts[KeyboardShortcut.CLEAR_SEARCH]) {
          shortcuts[KeyboardShortcut.CLEAR_SEARCH]!();
        }
      }

      // Ctrl/Cmd + K or Ctrl/Cmd + F: Focus search
      if (
        isCtrlOrCmd(e) &&
        (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'f')
      ) {
        e.preventDefault();
        if (shortcuts[KeyboardShortcut.FOCUS_SEARCH]) {
          shortcuts[KeyboardShortcut.FOCUS_SEARCH]!();
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
