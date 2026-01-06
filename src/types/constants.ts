export const PRIORITIES = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
};

export const PRIORITY_COLORS = {
  high: '#ff006e',
  medium: '#ffd60a',
  low: '#00f0ff',
};

export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export const DEFAULT_CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Finance',
  'Learning',
  'Other',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Work: '#7b2cbf',
  Personal: '#00f0ff',
  Shopping: '#06ffa5',
  Health: '#ff006e',
  Finance: '#ffd60a',
  Learning: '#b537f2',
  Other: '#9ca3af',
};
