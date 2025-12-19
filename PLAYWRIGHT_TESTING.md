# Playwright Testing Guide

This project includes comprehensive Playwright tests for the Todo App.

## Installation

Playwright is already installed as a dev dependency. If you need to install it again:

```bash
npm install -D @playwright/test
```

## Running Tests

### Run all tests
```bash
npm run e2e
```

### Run tests in UI mode (interactive)
```bash
npm run e2e:ui
```

### Run tests in debug mode
```bash
npm run e2e:debug
```

### View test report
```bash
npm run e2e:report
```

### Run specific test file
```bash
npx playwright test tests/app.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Files

### `tests/app.spec.ts`
Main functionality and UI/UX tests including:
- **Functionality Tests**
  - Loading app with title
  - Empty state display
  - Adding todos
  - Toggling todo completion
  - Deleting todos
  - Displaying completion stats
  - Input validation
  - localStorage persistence
  - Complex multi-step operations

- **UI/UX Tests**
  - Accessible form elements
  - Keyboard input (Enter key)
  - Input trimming
  - Hover states
  - CSS class application

### `tests/components.spec.ts`
Component integration and persistence tests including:
- **Integration Tests**
  - TodoInput component rendering
  - TodoList empty state
  - TodoItem component elements
  - Rapid additions/deletions
  - Todo ordering (newest first)

- **Persistence Tests**
  - Multiple todos with mixed completion states
  - Clearing all todos and reloading

## Test Configuration

The `playwright.config.ts` file includes:
- **Test Directory**: `./tests`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Auto Web Server**: Automatically starts `npm start` for testing
- **Reporter**: HTML report with traces on first retry
- **Screenshots/Videos**: Enabled for failed tests

## CI/CD Integration

For CI/CD pipelines, tests are configured to:
- Run with single worker (sequential)
- Retry failed tests up to 2 times
- Generate HTML reports for review

## Tips

1. **Running app and tests separately**:
   - Terminal 1: `npm start` (keeps app running)
   - Terminal 2: `npm run e2e`

2. **UI Mode is best for development**:
   - Run `npm run e2e:ui` to see test execution interactively
   - Pause, step through, and inspect elements

3. **Debug specific test**:
   ```bash
   npx playwright test tests/app.spec.ts -g "should add a new todo" --debug
   ```

4. **View traces**:
   - After test failure, traces are automatically saved
   - Use `npm run e2e:report` to view with detailed timeline

## Test Coverage

The tests cover:
- ✅ Component rendering
- ✅ User interactions (click, type, enter)
- ✅ Data persistence (localStorage)
- ✅ State management (completion, deletion)
- ✅ Input validation
- ✅ UI states (empty, populated, completed)
- ✅ Cross-browser compatibility
