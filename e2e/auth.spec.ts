import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Visit signup page before each test
    await page.goto('/signup');
  });

  test('should display signup form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/sign up/i);
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    const submitBtn = page.getByRole('button', { name: /sign up/i });
    await submitBtn.click();

    // Check for validation errors
    const error = page.locator('text=required');
    await expect(error.first()).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /log in/i });
    await loginLink.click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText(/log in/i);
  });

  test('should have password field with type password', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });
});
