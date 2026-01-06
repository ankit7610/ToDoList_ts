import React from 'react';
import { FilterOptions, Priority } from '../types';
import { DEFAULT_CATEGORIES } from '../types/constants';
import './TodoFilters.css';

interface TodoFiltersProps {
    filters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
    categories: string[];
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filters, onFilterChange, categories }) => {
    const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            priority: e.target.value as Priority | undefined || undefined
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            category: e.target.value || undefined
        });
    };

    const handleDueDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            dueDateFilter: e.target.value as any || undefined
        });
    };

    const handleShowCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, showCompleted: e.target.checked });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            showCompleted: true,
            priority: undefined,
            category: undefined,
            dueDateFilter: undefined,
        });
    };

    const hasActiveFilters = filters.search || filters.priority || filters.category || filters.dueDateFilter || !filters.showCompleted;

    return (
        <div className="todo-filters">
            <div className="filters-header">
                <h3>🔍 Filters & Search</h3>
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Clear All
                    </button>
                )}
            </div>

            <div className="filters-grid">
                <div className="filter-group search-group">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="text"
                        className="filter-input"
                        placeholder="Search todos..."
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        className="filter-select"
                        value={filters.priority || ''}
                        onChange={handlePriorityChange}
                    >
                        <option value="">All Priorities</option>
                        <option value="high">🔥 High</option>
                        <option value="medium">⚡ Medium</option>
                        <option value="low">💧 Low</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        className="filter-select"
                        value={filters.category || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>🏷️ {cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <select
                        id="dueDate"
                        className="filter-select"
                        value={filters.dueDateFilter || ''}
                        onChange={handleDueDateFilterChange}
                    >
                        <option value="">All Dates</option>
                        <option value="today">📅 Today</option>
                        <option value="week">📆 This Week</option>
                        <option value="overdue">⚠️ Overdue</option>
                    </select>
                </div>

                <div className="filter-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.showCompleted}
                            onChange={handleShowCompletedChange}
                        />
                        <span>Show Completed</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TodoFilters;
