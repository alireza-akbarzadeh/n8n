import { test, expect } from '@playwright/test';

test.describe('Workflows Page', () => {
  test('should load the workflows page', async ({ page }) => {
    await page.goto('/workflows');

    // Wait for the page to load
    await expect(page).toHaveTitle(/n8n/i);

    // Check if main content is visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should navigate to home and redirect to workflows', async ({ page }) => {
    await page.goto('/');

    // Should redirect to workflows
    await expect(page).toHaveURL(/.*workflows/);
  });
});
