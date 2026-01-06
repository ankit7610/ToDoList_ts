import { test, expect } from '@playwright/test';

test.describe('Todo App - Filters and Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(async () => {
            localStorage.clear();
            const databases = await window.indexedDB.databases();
            databases.forEach(db => {
                if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
        });
        await page.reload();
    });

    test('should display filter panel', async ({ page }) => {
        await expect(page.locator('.todo-filters')).toBeVisible();
        await expect(page.locator('#search')).toBeVisible();
        await expect(page.locator('#priority')).toBeVisible();
        await expect(page.locator('#category')).toBeVisible();
        await expect(page.locator('#dueDate')).toBeVisible();
    });

    test('should search todos by title', async ({ page }) => {
        // Add multiple todos
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        await input.fill('Buy groceries');
        await addBtn.click();

        await input.fill('Write code');
        await addBtn.click();

        await input.fill('Buy books');
        await addBtn.click();

        // Search for "buy"
        const searchInput = page.locator('#search');
        await searchInput.fill('buy');

        // Should show 2 results
        await expect(page.locator('.todo-list li')).toHaveCount(2);
        await expect(page.locator('.todo-title').first()).toContainText('Buy');
    });

    test('should filter by priority', async ({ page }) => {
        const input = page.locator('.todo-input');
        const advancedToggle = page.locator('.advanced-toggle');
        const addBtn = page.locator('.add-btn');

        // Add high priority todo
        await advancedToggle.click();
        await input.fill('High priority task');
        await page.locator('#priority').selectOption('high');
        await addBtn.click();

        // Add medium priority todo
        await advancedToggle.click();
        await input.fill('Medium priority task');
        await page.locator('#priority').selectOption('medium');
        await addBtn.click();

        // Filter by high priority
        const priorityFilter = page.locator('.todo-filters #priority');
        await priorityFilter.selectOption('high');

        // Should show only 1 result
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.priority-badge')).toContainText('high');
    });

    test('should filter by category', async ({ page }) => {
        const input = page.locator('.todo-input');
        const advancedToggle = page.locator('.advanced-toggle');
        const addBtn = page.locator('.add-btn');

        // Add Work category todo
        await advancedToggle.click();
        await input.fill('Work task');
        await page.locator('#category').selectOption('Work');
        await addBtn.click();

        // Add Personal category todo
        await advancedToggle.click();
        await input.fill('Personal task');
        await page.locator('#category').selectOption('Personal');
        await addBtn.click();

        // Filter by Work category
        const categoryFilter = page.locator('.todo-filters #category');
        await categoryFilter.selectOption('Work');

        // Should show only 1 result
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.category-badge')).toContainText('Work');
    });

    test('should toggle show completed filter', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Add and complete a todo
        await input.fill('Completed task');
        await addBtn.click();

        const checkbox = page.locator('.todo-checkbox').first();
        await checkbox.click();

        // Add another todo
        await input.fill('Active task');
        await addBtn.click();

        // Should show 2 todos
        await expect(page.locator('.todo-list li')).toHaveCount(2);

        // Uncheck show completed
        const showCompletedCheckbox = page.locator('.checkbox-label input[type="checkbox"]');
        await showCompletedCheckbox.uncheck();

        // Should show only 1 todo (active)
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.todo-title')).toContainText('Active task');
    });

    test('should clear all filters', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        await input.fill('Test task');
        await addBtn.click();

        // Apply filters
        const searchInput = page.locator('#search');
        await searchInput.fill('test');

        const priorityFilter = page.locator('.todo-filters #priority');
        await priorityFilter.selectOption('high');

        // Clear filters button should be visible
        await expect(page.locator('.clear-filters-btn')).toBeVisible();

        // Click clear filters
        await page.locator('.clear-filters-btn').click();

        // Filters should be reset
        await expect(searchInput).toHaveValue('');
        await expect(priorityFilter).toHaveValue('');
    });

    test('should combine multiple filters', async ({ page }) => {
        const input = page.locator('.todo-input');
        const advancedToggle = page.locator('.advanced-toggle');
        const addBtn = page.locator('.add-btn');

        // Add multiple todos with different attributes
        await advancedToggle.click();
        await input.fill('Work meeting');
        await page.locator('#priority').selectOption('high');
        await page.locator('#category').selectOption('Work');
        await addBtn.click();

        await advancedToggle.click();
        await input.fill('Personal shopping');
        await page.locator('#priority').selectOption('low');
        await page.locator('#category').selectOption('Personal');
        await addBtn.click();

        // Apply combined filters
        const searchInput = page.locator('#search');
        await searchInput.fill('work');

        const priorityFilter = page.locator('.todo-filters #priority');
        await priorityFilter.selectOption('high');

        // Should show only 1 result matching all filters
        await expect(page.locator('.todo-list li')).toHaveCount(1);
        await expect(page.locator('.todo-title')).toContainText('Work meeting');
    });
});

test.describe('Todo App - Statistics', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(async () => {
            localStorage.clear();
            const databases = await window.indexedDB.databases();
            databases.forEach(db => {
                if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
        });
        await page.reload();
    });

    test('should display statistics dashboard', async ({ page }) => {
        await expect(page.locator('.todo-stats')).toBeVisible();
        await expect(page.locator('.stats-title')).toContainText('Statistics');
    });

    test('should show correct total count', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Add 3 todos
        for (let i = 1; i <= 3; i++) {
            await input.fill(`Todo ${i}`);
            await addBtn.click();
        }

        // Check total count
        const totalStat = page.locator('.stat-card').first();
        await expect(totalStat.locator('.stat-value')).toContainText('3');
    });

    test('should show correct completed count', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Add 3 todos
        for (let i = 1; i <= 3; i++) {
            await input.fill(`Todo ${i}`);
            await addBtn.click();
        }

        // Complete 2 todos
        const checkboxes = page.locator('.todo-checkbox');
        await checkboxes.nth(0).click();
        await checkboxes.nth(1).click();

        // Check completed count
        const completedStat = page.locator('.stat-completed');
        await expect(completedStat.locator('.stat-value')).toContainText('2');
    });

    test('should show correct pending count', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Add 3 todos
        for (let i = 1; i <= 3; i++) {
            await input.fill(`Todo ${i}`);
            await addBtn.click();
        }

        // Complete 1 todo
        const checkbox = page.locator('.todo-checkbox').first();
        await checkbox.click();

        // Check pending count
        const pendingStat = page.locator('.stat-pending');
        await expect(pendingStat.locator('.stat-value')).toContainText('2');
    });

    test('should show completion rate', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Add 4 todos
        for (let i = 1; i <= 4; i++) {
            await input.fill(`Todo ${i}`);
            await addBtn.click();
        }

        // Complete 2 todos (50%)
        const checkboxes = page.locator('.todo-checkbox');
        await checkboxes.nth(0).click();
        await checkboxes.nth(1).click();

        // Check completion rate
        await expect(page.locator('.progress-percentage')).toContainText('50%');
    });

    test('should show priority breakdown', async ({ page }) => {
        const input = page.locator('.todo-input');
        const advancedToggle = page.locator('.advanced-toggle');
        const addBtn = page.locator('.add-btn');

        // Add todos with different priorities
        await advancedToggle.click();
        await input.fill('High task');
        await page.locator('#priority').selectOption('high');
        await addBtn.click();

        await advancedToggle.click();
        await input.fill('Medium task');
        await page.locator('#priority').selectOption('medium');
        await addBtn.click();

        // Check priority breakdown is visible
        await expect(page.locator('.priority-breakdown')).toBeVisible();
        await expect(page.locator('.priority-stat')).toHaveCount(2);
    });

    test('should show category breakdown', async ({ page }) => {
        const input = page.locator('.todo-input');
        const advancedToggle = page.locator('.advanced-toggle');
        const addBtn = page.locator('.add-btn');

        // Add todos with different categories
        await advancedToggle.click();
        await input.fill('Work task');
        await page.locator('#category').selectOption('Work');
        await addBtn.click();

        await advancedToggle.click();
        await input.fill('Personal task');
        await page.locator('#category').selectOption('Personal');
        await addBtn.click();

        // Check category breakdown is visible
        await expect(page.locator('.category-breakdown')).toBeVisible();
        await expect(page.locator('.category-stat')).toHaveCount(2);
    });

    test('should update statistics in real-time', async ({ page }) => {
        const input = page.locator('.todo-input');
        const addBtn = page.locator('.add-btn');

        // Initial state
        const totalStat = page.locator('.stat-card').first();
        await expect(totalStat.locator('.stat-value')).toContainText('0');

        // Add a todo
        await input.fill('New task');
        await addBtn.click();

        // Stats should update
        await expect(totalStat.locator('.stat-value')).toContainText('1');

        // Complete the todo
        const checkbox = page.locator('.todo-checkbox').first();
        await checkbox.click();

        // Completion rate should update
        await expect(page.locator('.progress-percentage')).toContainText('100%');
    });
});
