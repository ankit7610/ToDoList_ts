import { test, expect } from '@playwright/test';

test.describe('Todo App - Core Functionality', () => {
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

  test('should load the app successfully', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.todo-input')).toBeVisible();
    await expect(page.locator('.add-btn')).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Test todo item');
    await addBtn.click();

    await expect(page.locator('.todo-title')).toContainText('Test todo item');
  });

  test('should toggle todo completion', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Complete me');
    await addBtn.click();

    const checkbox = page.locator('.todo-checkbox').first();
    await checkbox.click();

    const todoTitle = page.locator('.todo-title').first();
    await expect(todoTitle).toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Delete me');
    await addBtn.click();

    await expect(page.locator('.todo-list li')).toHaveCount(1);

    const deleteBtn = page.locator('.delete-btn').first();
    await deleteBtn.click();

    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should persist todos after page reload', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Persistent todo');
    await addBtn.click();

    await expect(page.locator('.todo-title')).toContainText('Persistent todo');

    await page.reload();

    await expect(page.locator('.todo-title')).toContainText('Persistent todo');
  });

  test('should show completion stats', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Todo 1');
    await addBtn.click();

    await input.fill('Todo 2');
    await addBtn.click();

    const checkboxes = page.locator('.todo-checkbox');
    await checkboxes.first().click();

    await expect(page.locator('.stats')).toContainText('1 of 2 completed');
  });

  test('should handle multiple todos', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    for (let i = 1; i <= 5; i++) {
      await input.fill(`Todo ${i}`);
      await addBtn.click();
    }

    await expect(page.locator('.todo-list li')).toHaveCount(5);
  });
});

test.describe('Todo App - Advanced Options', () => {
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

  test('should toggle advanced options', async ({ page }) => {
    const advancedToggle = page.locator('.advanced-toggle');

    await advancedToggle.click();
    await expect(page.locator('.advanced-options')).toBeVisible();

    await advancedToggle.click();
    await expect(page.locator('.advanced-options')).not.toBeVisible();
  });

  test('should add todo with priority', async ({ page }) => {
    const input = page.locator('.todo-input');
    const advancedToggle = page.locator('.advanced-toggle');
    const addBtn = page.locator('.add-btn');

    await advancedToggle.click();
    await input.fill('High priority task');

    const prioritySelect = page.locator('#priority');
    await prioritySelect.selectOption('high');

    await addBtn.click();

    await expect(page.locator('.priority-badge')).toContainText('high');
    await expect(page.locator('.priority-badge')).toHaveClass(/priority-high/);
  });

  test('should add todo with category', async ({ page }) => {
    const input = page.locator('.todo-input');
    const advancedToggle = page.locator('.advanced-toggle');
    const addBtn = page.locator('.add-btn');

    await advancedToggle.click();
    await input.fill('Work task');

    const categorySelect = page.locator('#category');
    await categorySelect.selectOption('Work');

    await addBtn.click();

    await expect(page.locator('.category-badge')).toContainText('Work');
  });

  test('should add todo with due date', async ({ page }) => {
    const input = page.locator('.todo-input');
    const advancedToggle = page.locator('.advanced-toggle');
    const addBtn = page.locator('.add-btn');

    await advancedToggle.click();
    await input.fill('Task with deadline');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const dueDateInput = page.locator('#dueDate');
    await dueDateInput.fill(dateString);

    await addBtn.click();

    await expect(page.locator('.todo-item')).toBeVisible();
  });

  test('should add todo with notes', async ({ page }) => {
    const input = page.locator('.todo-input');
    const advancedToggle = page.locator('.advanced-toggle');
    const addBtn = page.locator('.add-btn');

    await advancedToggle.click();
    await input.fill('Task with notes');

    const notesInput = page.locator('#notes');
    await notesInput.fill('This is a detailed note about the task');

    await addBtn.click();

    await expect(page.locator('.todo-item')).toBeVisible();
  });

  test('should add todo with all advanced options', async ({ page }) => {
    const input = page.locator('.todo-input');
    const advancedToggle = page.locator('.advanced-toggle');
    const addBtn = page.locator('.add-btn');

    await advancedToggle.click();
    await input.fill('Complete task');

    await page.locator('#priority').selectOption('medium');
    await page.locator('#category').selectOption('Personal');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.locator('#dueDate').fill(tomorrow.toISOString().split('T')[0]);

    await page.locator('#notes').fill('All options set');

    await addBtn.click();

    await expect(page.locator('.priority-badge')).toBeVisible();
    await expect(page.locator('.category-badge')).toBeVisible();
  });
});

test.describe('Todo App - Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme switcher visible', async ({ page }) => {
    await expect(page.locator('.theme-switcher')).toBeVisible();
  });

  test('should switch between themes', async ({ page }) => {
    const lightButton = page.locator('.theme-button').nth(0);
    const darkButton = page.locator('.theme-button').nth(1);

    await darkButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await lightButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Todo App - Empty State', () => {
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

  test('should show empty state when no todos', async ({ page }) => {
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state h3')).toBeVisible();
  });

  test('should hide empty state when todos exist', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('First todo');
    await addBtn.click();

    await expect(page.locator('.empty-state')).not.toBeVisible();
    await expect(page.locator('.todo-list')).toBeVisible();
  });
});

test.describe('Todo App - Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not add empty todo', async ({ page }) => {
    const addBtn = page.locator('.add-btn');
    const initialCount = await page.locator('.todo-list li').count();

    await addBtn.click();

    const finalCount = await page.locator('.todo-list li').count();
    expect(finalCount).toBe(initialCount);
  });

  test('should trim whitespace from todo title', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('   Trimmed todo   ');
    await addBtn.click();

    await expect(page.locator('.todo-title')).toContainText('Trimmed todo');
  });
});

test.describe('Todo App - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper form labels', async ({ page }) => {
    const advancedToggle = page.locator('.advanced-toggle');
    await advancedToggle.click();

    await expect(page.locator('label[for="priority"]')).toBeVisible();
    await expect(page.locator('label[for="category"]')).toBeVisible();
    await expect(page.locator('label[for="dueDate"]')).toBeVisible();
    await expect(page.locator('label[for="notes"]')).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    const input = page.locator('.todo-input');

    await input.focus();
    await expect(input).toBeFocused();

    await page.keyboard.type('Keyboard todo');
    await page.keyboard.press('Enter');

    await expect(page.locator('.todo-title')).toContainText('Keyboard todo');
  });
});
