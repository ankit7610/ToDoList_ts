import React from 'react';
import { CATEGORY_COLORS } from '../types/constants';
import './CategoryBadge.css';

interface CategoryBadgeProps {
    category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
    const color = CATEGORY_COLORS[category] || '#9ca3af';

    return (
        <span
            className="category-badge"
            style={{ '--category-color': color } as React.CSSProperties}
            title={`Category: ${category}`}
        >
            🏷️ {category}
        </span>
    );
};

export default CategoryBadge;
