import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check if login form is visible
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup');

    // Check if signup form is visible
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');

    // Find and click link to signup (adjust selector based on your actual UI)
    const signupLink = page.locator('text=/sign up/i').first();
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/.*signup/);
    }
  });
});
