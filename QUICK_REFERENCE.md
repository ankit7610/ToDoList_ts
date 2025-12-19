# Quick Reference Guide - React/TypeScript Todo App

## 🚀 Quick Start

### Basic Setup
```typescript
import { TodoProvider, useTodoContext } from 'src/context';
import { useKeyboardShortcuts, useToast } from 'src/hooks';

function App() {
  return (
    <TodoProvider initialTodos={[]} onTodosChange={console.log}>
      <TodoApplication />
    </TodoProvider>
  );
}
```

## 📋 Hook Cheat Sheet

### Essential Hooks (Must Know)
```typescript
// Global state
const { todos, addTodo, toggleTodo, deleteTodo } = useTodoContext();

// Search & filtering
const { filteredTodos, stats, searchQuery, setSearchQuery } = useTodoSearch(todos);

// Notifications
const { showSuccess, showError, showInfo } = useToast();

// Keyboard handling
useKeyboardShortcuts({ [KeyboardShortcut.UNDO]: undo });
```

### Advanced Hooks (Feature Rich)
```typescript
// Tags
const { addTag, addTagToTodo, getTagsForTodo } = useTodoTags();

// Priority
const { setPriority, getPriority, sortByPriority } = useTodoPriority();

// Due dates
const { setDueDate, getOverdueTodos, formatDueDate } = useTodoDueDates();

// Bulk operations
const { bulkDelete, bulkCompleteAll, bulkClearCompleted } = useBulkTodoOperations(todos, updateTodos);

// History
const { history, getRecentChanges, getChangesByTodo } = useTodoHistory();
```

## 🎯 Common Tasks

### Add Todo
```typescript
const { addTodo } = useTodoContext();
addTodo("Buy groceries");
```

### Toggle Completion
```typescript
const { toggleTodo } = useTodoContext();
toggleTodo(todoId);
```

### Search & Filter
```typescript
const { filteredTodos, setSearchQuery, setFilter } = useTodoSearch(todos);
setSearchQuery("important");
setFilter(TodoFilter.ACTIVE);
```

### Show Notification
```typescript
const { showSuccess, showError } = useToast();
showSuccess("Todo added!");
showError("Failed to save");
```

### Set Priority
```typescript
const { setPriority } = useTodoPriority();
setPriority(todoId, TodoPriority.HIGH);
```

### Set Due Date
```typescript
const { setDueDate, formatDueDate } = useTodoDueDates();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
setDueDate(todoId, tomorrow);
console.log(formatDueDate(tomorrow)); // "Due tomorrow"
```

### Add Tag
```typescript
const { addTag, addTagToTodo } = useTodoTags();
const workTag = addTag("Work", "#ff0000");
addTagToTodo(todoId, workTag.id);
```

### Bulk Delete
```typescript
const { bulkDelete } = useBulkTodoOperations(todos, setTodos);
const result = bulkDelete([todoId1, todoId2, todoId3]);
console.log(`Deleted ${result.success} todos`);
```

### Export Todos
```typescript
import { TodoSerializer } from 'src/utils';

// As JSON
TodoSerializer.downloadAsJSON(todos, 'my-todos.json');

// As CSV
TodoSerializer.downloadAsCSV(todos, 'my-todos.csv');
```

### Import Todos
```typescript
const text = await file.text();
const imported = TodoSerializer.importFromJSON(text);
```

### Get Statistics
```typescript
const { stats } = useTodoSearch(todos);
console.log(`Total: ${stats.total}`);
console.log(`Completed: ${stats.completed}`);
console.log(`Progress: ${stats.completionPercentage}%`);
```

## 🎨 Enum Values Reference

### TodoFilter
```typescript
TodoFilter.ALL        // Show all todos
TodoFilter.ACTIVE     // Show uncompleted only
TodoFilter.COMPLETED  // Show completed only
```

### TodoSort
```typescript
TodoSort.NEWEST           // Most recent first
TodoSort.OLDEST           // Oldest first
TodoSort.COMPLETED_FIRST  // Completed todos first
TodoSort.ACTIVE_FIRST     // Active todos first
```

### TodoPriority
```typescript
TodoPriority.LOW      // Green (#10b981)
TodoPriority.MEDIUM   // Amber (#f59e0b)
TodoPriority.HIGH     // Red (#ef4444)
TodoPriority.URGENT   // Violet (#7c3aed)
```

### KeyboardShortcut
```typescript
KeyboardShortcut.UNDO           // Ctrl/Cmd + Z
KeyboardShortcut.REDO           // Ctrl/Cmd + Shift + Z
KeyboardShortcut.ADD_TODO       // Ctrl/Cmd + Enter
KeyboardShortcut.CLEAR_SEARCH   // Escape
KeyboardShortcut.FOCUS_SEARCH   // Ctrl/Cmd + K/F
```

## 💾 Storage Hooks

### LocalStorage
```typescript
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
setTheme('dark'); // Saves to localStorage
removeTheme();    // Deletes from localStorage
```

### SessionStorage
```typescript
const [session, setSession, clearSession] = useSessionStorage('session', {});
```

## 🔍 Filtering Example

```typescript
function AdvancedFilter() {
  const todos = useTodos();
  const {
    filteredTodos,
    stats,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sort,
    setSort,
  } = useTodoSearch(todos);

  return (
    <div>
      {/* Search input */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Status filter */}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value={TodoFilter.ALL}>All</option>
        <option value={TodoFilter.ACTIVE}>Active</option>
        <option value={TodoFilter.COMPLETED}>Completed</option>
      </select>

      {/* Sort order */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value={TodoSort.NEWEST}>Newest First</option>
        <option value={TodoSort.OLDEST}>Oldest First</option>
        <option value={TodoSort.COMPLETED_FIRST}>Completed First</option>
        <option value={TodoSort.ACTIVE_FIRST}>Active First</option>
      </select>

      {/* Results */}
      <p>
        Showing {filteredTodos.length} of {stats.total} 
        ({stats.completionPercentage}% complete)
      </p>

      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

## 🎓 Pattern Examples

### Complete Todo App Component
```typescript
function CompleteTodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoContext();
  const { 
    filteredTodos, 
    stats, 
    searchQuery, 
    setSearchQuery, 
    filter, 
    setFilter 
  } = useTodoSearch(todos);
  const { showSuccess, showError } = useToast();
  const { setPriority } = useTodoPriority();
  const { setDueDate } = useTodoDueDates();

  useKeyboardShortcuts({
    [KeyboardShortcut.ADD_TODO]: () => showSuccess('Add dialog opened'),
  });

  return (
    <div className="todo-app">
      <h1>My Todos</h1>
      
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search todos..."
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value={TodoFilter.ALL}>All</option>
        <option value={TodoFilter.ACTIVE}>Active</option>
        <option value={TodoFilter.COMPLETED}>Completed</option>
      </select>

      <p>
        {stats.completed}/{stats.total} completed ({stats.completionPercentage}%)
      </p>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.title}</span>
            <select
              onChange={(e) => setPriority(todo.id, e.target.value)}
              defaultValue={TodoPriority.MEDIUM}
            >
              <option value={TodoPriority.LOW}>Low</option>
              <option value={TodoPriority.MEDIUM}>Medium</option>
              <option value={TodoPriority.HIGH}>High</option>
              <option value={TodoPriority.URGENT}>Urgent</option>
            </select>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🧪 Testing Utilities

### Validate Todo
```typescript
try {
  TodoValidator.validateTitle("Buy milk");
  console.log("✓ Valid title");
} catch (error) {
  console.error("✗ Invalid title:", error.message);
}
```

### Calculate Analytics
```typescript
const analytics = TodoAnalytics.calculateStats(todos);
console.log(`Completion Rate: ${analytics.completionPercentage}%`);
console.log(`Avg Time: ${TodoAnalytics.formatCompletionTime(analytics.averageCompletionTime)}`);
```

## 📱 Responsive Usage

```typescript
// Theme-aware component
function ThemedComponent() {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <div style={{ 
      background: effectiveTheme === 'dark' ? '#000' : '#fff',
      color: effectiveTheme === 'dark' ? '#fff' : '#000'
    }}>
      <button onClick={toggleTheme}>
        Switch to {effectiveTheme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}
```

## 🔗 Import Patterns

```typescript
// Single imports
import { useTodoContext } from 'src/context';
import { TodoValidator } from 'src/utils';

// Batch imports
import { 
  useKeyboardShortcuts, 
  useTodoSearch, 
  useToast 
} from 'src/hooks';

// Type imports
import type { Todo, TodoFilter } from 'src/types';
```

## ⚡ Performance Tips

1. **Use `useTodoSearch` instead of manual filtering** - Already memoized
2. **Debounce search input** - Built into `useDebouncedSearch`
3. **Memoize component props** - Prevents unnecessary re-renders
4. **Use `useCallback` for event handlers** - Hooks already do this
5. **Leverage Context for global state** - Avoid prop drilling

## 🐛 Debugging

```typescript
// Log todos from context
const { todos } = useTodoContext();
console.log('Current todos:', todos);

// Check toast system
const { toasts } = useToast();
console.log('Active toasts:', toasts);

// View recent changes
const { getRecentChanges } = useTodoHistory();
console.log('Recent changes:', getRecentChanges(5));
```

---

**Need More Help?** Check [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed examples or [FEATURES.md](./FEATURES.md) for comprehensive API documentation.
