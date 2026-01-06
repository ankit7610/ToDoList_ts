import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Use 4 workers for faster parallel execution (was 1 in CI, undefined otherwise)
  workers: process.env.CI ? 2 : 4,
  reporter: 'html',

  // Global timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Faster navigation
    navigationTimeout: 10000,
    actionTimeout: 5000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Disable animations for faster tests
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },
  ],

  webServer: {
    command: 'BROWSER=none npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Don't wait for stdout, just check the URL
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
