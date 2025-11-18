import { test, expect } from '@playwright/test';

test.describe('Workflows Page', () => {
  test('should load the workflows page', async ({ page }) => {
    await page.goto('/workflows');

    // Wait for the page to load
    await expect(page).toHaveTitle(/n8n/i);

    // Check if main content is visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login for unauthenticated users
    await expect(page).toHaveURL(/.*login/);
  });
});
