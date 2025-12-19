import { test, expect } from '@playwright/test';

test.describe('Todo App - Core Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
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

  test('should persist todos in localStorage', async ({ page }) => {
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
});
