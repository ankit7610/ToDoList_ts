# React & TypeScript Features

This document outlines the comprehensive React and TypeScript features added to the Todo application.

## Custom Hooks

### `useUndoRedo(initialValue)`
Manages undo/redo functionality with a stack-based approach.
```typescript
const { present, past, future, push, undo, redo, canUndo, canRedo } = useUndoRedo(initialTodos);
```

### `useTodoFiltering(todos, options)`
Filters todos based on filter status, sort order, and search query.
```typescript
const filtered = useTodoFiltering(todos, { 
  filter: TodoFilter.ACTIVE, 
  sort: TodoSort.NEWEST, 
  searchQuery: 'buy milk' 
});
```

### `useTodoStats(todos)`
Calculates statistics about todos (total, completed, active, percentage).
```typescript
const { total, completed, active, completionPercentage } = useTodoStats(todos);
```

### `useKeyboardShortcuts(shortcuts)`
Registers keyboard shortcuts globally.
```typescript
useKeyboardShortcuts({
  [KeyboardShortcut.UNDO]: () => undo(),
  [KeyboardShortcut.REDO]: () => redo(),
  [KeyboardShortcut.ADD_TODO]: () => addTodo(),
});
```

**Supported Shortcuts:**
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Ctrl/Cmd + Enter`: Add todo
- `Escape`: Clear search
- `Ctrl/Cmd + K/F`: Focus search

### `useIndexedDB(options)`
Abstraction layer for IndexedDB operations with automatic persistence.
```typescript
const { todos, isLoading, error, addTodo, updateTodo, deleteTodo, toggleTodo } = useIndexedDB();
```

### `useTodoSearch(todos)`
Combined hook for search, filter, and sort with statistics.
```typescript
const { 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  sort, 
  setSort, 
  filteredTodos, 
  stats 
} = useTodoSearch(todos);
```

### `useDebounce(callback, delay)` and `useDebouncedValue(value, delay)`
Debounce callbacks and values to optimize performance.
```typescript
const debouncedSearch = useDebounce((query: string) => setSearchQuery(query), 300);
const debouncedQuery = useDebouncedValue(searchQuery, 500);
```

### `useTheme(defaultTheme)`
Manages light/dark/system theme with localStorage persistence.
```typescript
const { theme, setTheme, toggleTheme, effectiveTheme } = useTheme('system');
```

### `useToast()`
Toast notification system with multiple types and auto-dismiss.
```typescript
const { toasts, showSuccess, showError, showInfo, showWarning, removeToast } = useToast();
showSuccess('Todo added!');
showError('Failed to delete todo');
```

### `useTodoHistory()`
Tracks all changes to todos with detailed history.
```typescript
const { 
  history, 
  recordAdd, 
  recordUpdate, 
  recordDelete, 
  recordToggle, 
  getRecentChanges 
} = useTodoHistory();
```

## Context API

### `TodoProvider` and `useTodoContext()`
Global state management for todos with context API.
```typescript
<TodoProvider initialTodos={todos} onTodosChange={handleTodosChange}>
  <App />
</TodoProvider>

const { todos, addTodo, toggleTodo, deleteTodo, filterOptions, setFilter } = useTodoContext();
```

## Utilities

### `TodoValidator`
Type-safe validation for todos and todo operations.
```typescript
TodoValidator.validateTitle('Buy milk');
TodoValidator.validateTodo(todoObject);
TodoValidator.validateTodos(todosArray);
const sanitized = TodoValidator.sanitizeTitle(userInput);
```

### `TodoSerializer`
Export and import todos in JSON and CSV formats.
```typescript
const json = TodoSerializer.exportToJSON(todos);
const csv = TodoSerializer.exportToCSV(todos);
TodoSerializer.downloadAsJSON(todos, 'my-todos.json');
TodoSerializer.downloadAsCSV(todos, 'my-todos.csv');
const imported = TodoSerializer.importFromJSON(jsonString);
```

### `TodoAnalytics`
Detailed analytics and statistics about todo completion patterns.
```typescript
const analytics = TodoAnalytics.calculateStats(todos);
// Returns: totalTodos, completedTodos, activeTodos, completionPercentage, 
//          averageCompletionTime, longestStreak, todosCreatedToday, 
//          todosCompletedToday, mostProductiveDay

const formatted = TodoAnalytics.formatCompletionTime(ms);
```

## Types & Constants

### Enums
```typescript
enum TodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

enum TodoSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  COMPLETED_FIRST = 'completed_first',
  ACTIVE_FIRST = 'active_first',
}
```

### Interfaces
```typescript
interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionPercentage: number;
}

interface FilterOptions {
  filter: TodoFilter;
  sort: TodoSort;
  searchQuery: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

## Usage Examples

### Basic Todo Management
```typescript
import { useTodoContext } from 'src/context';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoContext();

  const handleAddTodo = (title: string) => {
    addTodo(title);
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Advanced Search and Filtering
```typescript
import { useTodoSearch } from 'src/hooks';
import { TodoFilter, TodoSort } from 'src/types/constants';

function TodoList() {
  const todos = useTodos(); // Get todos from context or state
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredTodos, 
    stats, 
    setFilter, 
    setSort 
  } = useTodoSearch(todos);

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search todos..."
      />
      <p>Total: {stats.total} | Completed: {stats.completed} ({stats.completionPercentage}%)</p>
      {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

### Keyboard Shortcuts
```typescript
import { useKeyboardShortcuts, KeyboardShortcut } from 'src/hooks';

function TodoApp() {
  const { history, undo, redo } = useUndoRedo(todos);

  useKeyboardShortcuts({
    [KeyboardShortcut.UNDO]: undo,
    [KeyboardShortcut.REDO]: redo,
    [KeyboardShortcut.ADD_TODO]: () => showAddDialog(),
  });

  return <TodoList />;
}
```

### Toast Notifications
```typescript
import { useToast } from 'src/hooks';
import { useTodoContext } from 'src/context';

function AddTodoButton() {
  const { addTodo } = useTodoContext();
  const { showSuccess, showError } = useToast();

  const handleAdd = async (title: string) => {
    try {
      addTodo(title);
      showSuccess('Todo added successfully!');
    } catch (error) {
      showError('Failed to add todo');
    }
  };

  return <button onClick={() => handleAdd('New todo')}>Add</button>;
}
```

### Export/Import
```typescript
import { TodoSerializer } from 'src/utils';

function ExportImport() {
  const todos = useTodos();

  const handleExport = () => {
    TodoSerializer.downloadAsJSON(todos);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imported = TodoSerializer.importFromJSON(e.target?.result as string);
      // Use imported todos
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={handleExport}>Export as JSON</button>
      <input type="file" onChange={(e) => handleImport(e.target.files?.[0]!)} />
    </div>
  );
}
```

## File Structure

```
src/
├── hooks/
│   ├── index.ts                    # Hook exports
│   ├── useUndoRedo.ts              # Undo/redo functionality
│   ├── useTodoFiltering.ts         # Filtering and stats
│   ├── useKeyboardShortcuts.ts     # Keyboard shortcuts
│   ├── useIndexedDB.ts             # Database abstraction
│   ├── useTodoSearch.ts            # Combined search/filter
│   ├── useDebounce.ts              # Debouncing utilities
│   ├── useTheme.ts                 # Theme management
│   ├── useToast.ts                 # Toast notifications
│   └── useTodoHistory.ts           # Change history tracking
├── context/
│   ├── index.ts                    # Context exports
│   └── TodoContext.tsx             # Global todo state
├── utils/
│   ├── index.ts                    # Utility exports
│   ├── db.ts                       # IndexedDB operations
│   ├── validation.ts               # Todo validation
│   ├── serializer.ts               # Import/export
│   └── analytics.ts                # Analytics calculations
└── types/
    ├── index.ts                    # Todo interface
    └── constants.ts                # Enums and types
```

## Imports Summary

```typescript
// Hooks
import { 
  useUndoRedo,
  useTodoFiltering,
  useTodoStats,
  useKeyboardShortcuts,
  useIndexedDB,
  useTodoSearch,
  useDebounce,
  useDebouncedValue,
  useTheme,
  useToast,
  useTodoHistory,
} from 'src/hooks';

// Context
import { TodoProvider, useTodoContext } from 'src/context';

// Utils
import { 
  TodoValidator,
  TodoSerializer,
  TodoAnalytics,
  getTodosFromDB,
  saveTodosToDB,
} from 'src/utils';

// Types
import { Todo, TodoFilter, TodoSort } from 'src/types';
```

All features are fully typed with TypeScript and ready for production use.
