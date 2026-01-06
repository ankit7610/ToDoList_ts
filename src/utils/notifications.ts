import { Todo } from '../types';

export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options,
        });
    }
};

export const checkDueTodos = (todos: Todo[]): void => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    todos.forEach(todo => {
        if (todo.completed || todo.notified || !todo.dueDate) return;

        const dueDate = new Date(todo.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        // Notify if due today
        if (dueDateOnly.getTime() === today.getTime()) {
            showNotification('Task Due Today! 📅', {
                body: todo.title,
                tag: `due-${todo.id}`,
            });
        }

        // Notify if overdue
        if (dueDateOnly < today) {
            showNotification('Overdue Task! ⚠️', {
                body: todo.title,
                tag: `overdue-${todo.id}`,
            });
        }
    });
};

export const scheduleNotificationCheck = (todos: Todo[], callback: () => void): number => {
    // Check every 30 minutes
    const interval = setInterval(() => {
        checkDueTodos(todos);
        callback();
    }, 30 * 60 * 1000);

    // Initial check
    checkDueTodos(todos);

    return interval;
};
