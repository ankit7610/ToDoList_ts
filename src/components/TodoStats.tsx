import React from 'react';
import { TodoStats as Stats } from '../types';
import { getCompletionRate } from '../utils/stats';
import './TodoStats.css';

interface TodoStatsProps {
    stats: Stats;
}

const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
    const completionRate = getCompletionRate(stats);

    return (
        <div className="todo-stats">
            <h3 className="stats-title">📊 Statistics</h3>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Tasks</div>
                </div>

                <div className="stat-card stat-completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>

                <div className="stat-card stat-pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>

                {stats.overdue > 0 && (
                    <div className="stat-card stat-overdue">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-value">{stats.overdue}</div>
                        <div className="stat-label">Overdue</div>
                    </div>
                )}
            </div>

            <div className="progress-section">
                <div className="progress-header">
                    <span>Completion Rate</span>
                    <span className="progress-percentage">{completionRate}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>

            {(stats.byPriority.high > 0 || stats.byPriority.medium > 0 || stats.byPriority.low > 0) && (
                <div className="priority-breakdown">
                    <h4>By Priority</h4>
                    <div className="priority-stats">
                        {stats.byPriority.high > 0 && (
                            <div className="priority-stat">
                                <span className="priority-label">🔥 High</span>
                                <span className="priority-count">{stats.byPriority.high}</span>
                            </div>
                        )}
                        {stats.byPriority.medium > 0 && (
                            <div className="priority-stat">
                                <span className="priority-label">⚡ Medium</span>
                                <span className="priority-count">{stats.byPriority.medium}</span>
                            </div>
                        )}
                        {stats.byPriority.low > 0 && (
                            <div className="priority-stat">
                                <span className="priority-label">💧 Low</span>
                                <span className="priority-count">{stats.byPriority.low}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {Object.keys(stats.byCategory).length > 0 && (
                <div className="category-breakdown">
                    <h4>By Category</h4>
                    <div className="category-stats">
                        {Object.entries(stats.byCategory).map(([category, count]) => (
                            <div key={category} className="category-stat">
                                <span className="category-label">🏷️ {category}</span>
                                <span className="category-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoStats;
