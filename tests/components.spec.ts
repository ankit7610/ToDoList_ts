import { test, expect } from '@playwright/test';

test.describe('Todo Components - Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TodoInput component should render correctly', async ({ page }) => {
    const form = page.locator('.todo-input-form');
    const input = page.locator('.todo-input');
    const button = page.locator('.add-btn');

    await expect(form).toBeVisible();
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    await expect(button).toContainText('Add');
  });

  test('TodoList component should render empty state initially', async ({ page }) => {
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No todos yet');
  });

  test('TodoItem component should render with all elements', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Component test');
    await addBtn.click();

    const todoItem = page.locator('.todo-item');
    const checkbox = page.locator('.todo-checkbox');
    const title = page.locator('.todo-title');
    const deleteBtn = page.locator('.delete-btn');

    await expect(todoItem).toBeVisible();
    await expect(checkbox).toBeVisible();
    await expect(title).toBeVisible();
    await expect(deleteBtn).toBeVisible();
  });

  test('should handle rapid additions and deletions', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Rapidly add todos
    for (let i = 0; i < 5; i++) {
      await input.fill(`Quick ${i}`);
      await addBtn.click();
    }

    await expect(page.locator('.todo-item')).toHaveCount(5);

    // Rapidly delete todos
    const deleteBtns = page.locator('.delete-btn');
    for (let i = 0; i < 3; i++) {
      await deleteBtns.first().click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator('.todo-item')).toHaveCount(2);
  });

  test('should maintain order of todos (newest first)', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('First');
    await addBtn.click();

    await page.waitForTimeout(100);

    await input.fill('Second');
    await addBtn.click();

    const titles = page.locator('.todo-title');
    await expect(titles.nth(0)).toContainText('Second');
    await expect(titles.nth(1)).toContainText('First');
  });
});

test.describe('Data Persistence Tests', () => {
  test('should persist multiple todos with mixed states', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Add todos
    await input.fill('Complete this');
    await addBtn.click();

    await input.fill('Incomplete todo');
    await addBtn.click();

    // Complete first one
    const checkboxes = page.locator('.todo-checkbox');
    await checkboxes.first().click();

    // Verify state
    await expect(page.locator('.stats')).toContainText('1 of 2 completed');

    // Reload
    await page.reload();

    // Verify persisted state
    await expect(page.locator('.todo-item')).toHaveCount(2);
    await expect(page.locator('.stats')).toContainText('1 of 2 completed');
    await expect(page.locator('.todo-title.completed')).toHaveCount(1);
  });

  test('should handle clearing all todos and reloading', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Add todos
    await input.fill('Todo 1');
    await addBtn.click();
    await input.fill('Todo 2');
    await addBtn.click();

    // Delete all
    const deleteBtns = page.locator('.delete-btn');
    await deleteBtns.nth(0).click();
    await deleteBtns.nth(0).click();

    // Should show empty state
    await expect(page.locator('.empty-state')).toBeVisible();

    // Reload
    await page.reload();

    // Should still show empty state
    await expect(page.locator('.empty-state')).toBeVisible();
  });
});
