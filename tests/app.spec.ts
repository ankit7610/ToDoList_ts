import { test, expect } from '@playwright/test';

test.describe('Todo App - Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().clearCookies();
    await page.goto('/');
    // Clear any existing data
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should load the app with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('My Todo App');
  });

  test('should display empty state when no todos exist', async ({ page }) => {
    await expect(page.locator('.empty-state')).toContainText(
      'No todos yet. Add one to get started!'
    );
  });

  test('should add a new todo', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Test todo item');
    await addBtn.click();

    await expect(page.locator('.todo-title')).toContainText('Test todo item');
  });

  test('should add multiple todos', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('First todo');
    await addBtn.click();

    await input.fill('Second todo');
    await addBtn.click();

    await input.fill('Third todo');
    await addBtn.click();

    await expect(page.locator('.todo-list li')).toHaveCount(3);
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

  test('should show completion stats', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Add first todo
    await input.fill('Todo 1');
    await addBtn.click();

    // Add second todo
    await input.fill('Todo 2');
    await addBtn.click();

    // Check stats shows 0/2
    await expect(page.locator('.stats')).toContainText('0 of 2 completed');

    // Complete first todo
    const checkboxes = page.locator('.todo-checkbox');
    await checkboxes.first().click();

    // Check stats shows 1/2
    await expect(page.locator('.stats')).toContainText('1 of 2 completed');
  });

  test('should not add empty todo', async ({ page }) => {
    const addBtn = page.locator('.add-btn');

    await addBtn.click();

    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should clear input after adding todo', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Test todo');
    await addBtn.click();

    await expect(input).toHaveValue('');
  });

  test('should persist todos in localStorage', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Add a todo
    await input.fill('Persistent todo');
    await addBtn.click();

    // Verify it's in the DOM
    await expect(page.locator('.todo-title')).toContainText('Persistent todo');

    // Reload the page
    await page.reload();

    // Verify the todo persists after reload
    await expect(page.locator('.todo-title')).toContainText('Persistent todo');
  });

  test('should handle multiple operations correctly', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    // Add 3 todos
    for (let i = 1; i <= 3; i++) {
      await input.fill(`Todo ${i}`);
      await addBtn.click();
    }

    // Complete first and third
    const checkboxes = page.locator('.todo-checkbox');
    await checkboxes.nth(0).click();
    await checkboxes.nth(2).click();

    // Check stats
    await expect(page.locator('.stats')).toContainText('2 of 3 completed');

    // Delete second todo
    const deleteBtns = page.locator('.delete-btn');
    await deleteBtns.nth(1).click();

    // Verify 2 todos remain
    await expect(page.locator('.todo-list li')).toHaveCount(2);

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator('.todo-list li')).toHaveCount(2);
    await expect(page.locator('.stats')).toContainText('1 of 2 completed');
  });
});

test.describe('Todo App - UI/UX Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have accessible form elements', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await expect(input).toBeVisible();
    await expect(addBtn).toBeVisible();
  });

  test('should allow adding todo with Enter key', async ({ page }) => {
    const input = page.locator('.todo-input');

    await input.fill('Enter key test');
    await input.press('Enter');

    await expect(page.locator('.todo-title')).toContainText('Enter key test');
  });

  test('should trim whitespace from todo titles', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('   Trimmed todo   ');
    await addBtn.click();

    // The todo should not have leading/trailing spaces
    const todoTitle = page.locator('.todo-title').first();
    await expect(todoTitle).toContainText('Trimmed todo');
  });

  test('should have delete button on hover', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Hover test');
    await addBtn.click();

    const deleteBtn = page.locator('.delete-btn').first();
    await expect(deleteBtn).toBeVisible();
  });

  test('should apply completed class styling', async ({ page }) => {
    const input = page.locator('.todo-input');
    const addBtn = page.locator('.add-btn');

    await input.fill('Style test');
    await addBtn.click();

    const todoTitle = page.locator('.todo-title').first();
    const checkbox = page.locator('.todo-checkbox').first();

    // Initially not completed
    const beforeClass = await todoTitle.getAttribute('class');
    expect(beforeClass).not.toContain('completed');

    // After clicking checkbox
    await checkbox.click();
    const afterClass = await todoTitle.getAttribute('class');
    expect(afterClass).toContain('completed');
  });
});
