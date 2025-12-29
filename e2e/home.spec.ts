import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/SaaS Starter/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');

    // Test Get Started button
    const getStartedBtn = page.getByRole('link', { name: /get started/i });
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      await expect(page).toHaveURL(/\/signup/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile menu or responsive layout
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
