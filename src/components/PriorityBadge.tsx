import React from 'react';
import { Priority } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types/constants';
import './PriorityBadge.css';

interface PriorityBadgeProps {
    priority: Priority;
    size?: 'small' | 'medium';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'medium' }) => {
    return (
        <span
            className={`priority-badge priority-${priority} priority-${size}`}
            style={{ '--priority-color': PRIORITY_COLORS[priority] } as React.CSSProperties}
            title={PRIORITY_LABELS[priority]}
        >
            {priority === 'high' && '🔥'}
            {priority === 'medium' && '⚡'}
            {priority === 'low' && '💧'}
            <span className="priority-text">{priority}</span>
        </span>
    );
};

export default PriorityBadge;
