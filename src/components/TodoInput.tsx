import React, { useState } from 'react';
import { Priority } from '../types';
import { DEFAULT_CATEGORIES } from '../types/constants';
import './TodoInput.css';

interface TodoInputProps {
  onAdd: (todo: {
    title: string;
    priority?: Priority;
    category?: string;
    notes?: string;
    dueDate?: Date;
  }) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd({
        title: input.trim(),
        priority: priority || undefined,
        category: category || undefined,
        notes: notes.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setInput('');
      setPriority('');
      setCategory('');
      setNotes('');
      setDueDate('');
      setShowAdvanced(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <div className="input-main">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
          required
        />
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Advanced options"
        >
          {showAdvanced ? '▼' : '▶'}
        </button>
        <button type="submit" className="add-btn">
          Add
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-options">
          <div className="option-row">
            <div className="option-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority | '')}
                className="option-select"
              >
                <option value="">None</option>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">💧 Low</option>
              </select>
            </div>

            <div className="option-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="option-select"
              >
                <option value="">None</option>
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="option-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="option-group notes-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add additional notes..."
              className="notes-input"
              rows={2}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoInput;
