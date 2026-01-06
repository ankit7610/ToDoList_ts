import { Todo, FilterOptions } from '../types';

export const searchTodos = (todos: Todo[], searchTerm: string): Todo[] => {
    if (!searchTerm.trim()) return todos;

    const term = searchTerm.toLowerCase();
    return todos.filter(todo =>
        todo.title.toLowerCase().includes(term) ||
        (todo.notes && todo.notes.toLowerCase().includes(term))
    );
};

export const filterByPriority = (todos: Todo[], priority?: string): Todo[] => {
    if (!priority) return todos;
    return todos.filter(todo => todo.priority === priority);
};

export const filterByCategory = (todos: Todo[], category?: string): Todo[] => {
    if (!category) return todos;
    return todos.filter(todo => todo.category === category);
};

export const filterByCompletion = (todos: Todo[], showCompleted: boolean): Todo[] => {
    return showCompleted ? todos : todos.filter(todo => !todo.completed);
};

export const filterByDueDate = (todos: Todo[], filter?: 'today' | 'week' | 'overdue' | 'all'): Todo[] => {
    if (!filter || filter === 'all') return todos;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return todos.filter(todo => {
        if (!todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);

        switch (filter) {
            case 'today':
                return dueDate.toDateString() === today.toDateString();
            case 'week':
                return dueDate >= today && dueDate <= weekFromNow;
            case 'overdue':
                return dueDate < today && !todo.completed;
            default:
                return true;
        }
    });
};

export const applyFilters = (todos: Todo[], filters: FilterOptions): Todo[] => {
    let filtered = todos;

    filtered = searchTodos(filtered, filters.search);
    filtered = filterByPriority(filtered, filters.priority);
    filtered = filterByCategory(filtered, filters.category);
    filtered = filterByCompletion(filtered, filters.showCompleted);
    filtered = filterByDueDate(filtered, filters.dueDateFilter);

    return filtered;
};

export const sortByPriority = (todos: Todo[]): Todo[] => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...todos].sort((a, b) => {
        const aPriority = a.priority ? priorityOrder[a.priority] : 3;
        const bPriority = b.priority ? priorityOrder[b.priority] : 3;
        return aPriority - bPriority;
    });
};

export const sortByDueDate = (todos: Todo[]): Todo[] => {
    return [...todos].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
};
