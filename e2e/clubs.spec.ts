import { test, expect } from '@playwright/test';

test.describe('Club Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    // Fill in login form (adjust selectors based on actual implementation)
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should create a new club', async ({ page }) => {
    await page.goto('/clubs/new');

    // Fill in club form
    await page.fill('input[name="name"]', 'Test Pickleball Club');
    await page.fill('input[name="slug"]', 'test-pickleball-club');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'Austin');
    await page.fill('input[name="state"]', 'TX');
    await page.fill('input[name="zipCode"]', '78701');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to club page
    await page.waitForURL(/\/clubs\/[\w-]+/);
    await expect(page.locator('h1')).toContainText('Test Pickleball Club');
  });

  test('should display club statistics', async ({ page }) => {
    await page.goto('/clubs/test-club');

    // Check for stats cards
    await expect(page.locator('text=Courts')).toBeVisible();
    await expect(page.locator('text=Players')).toBeVisible();
    await expect(page.locator('text=Matches')).toBeVisible();
    await expect(page.locator('text=Leagues')).toBeVisible();
  });

  test('should add a court to club', async ({ page }) => {
    await page.goto('/clubs/test-club');
    await page.click('text=Add Court');

    // Fill in court form
    await page.fill('input[name="name"]', 'Court 1');
    await page.check('input[name="lighting"]');
    await page.check('input[name="indoors"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Should return to club page
    await page.waitForURL(/\/clubs\/[\w-]+/);
    await expect(page.locator('text=Court 1')).toBeVisible();
  });

  test('should add a player to club', async ({ page }) => {
    await page.goto('/clubs/test-club/players/new');

    // Fill in player form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.selectOption('select[name="skillLevel"]', '3.5');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to players list
    await page.waitForURL(/\/clubs\/[\w-]+\/players/);
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should log a match', async ({ page }) => {
    await page.goto('/clubs/test-club/matches/new');

    // Select match type
    await page.selectOption('select[name="matchType"]', 'SINGLES');

    // Select players
    await page.selectOption('select[name="team1Player"]', 'player1');
    await page.selectOption('select[name="team2Player"]', 'player2');

    // Enter scores
    await page.fill('input[name="team1Score"]', '11');
    await page.fill('input[name="team2Score"]', '9');

    // Select winner
    await page.click('button:has-text("Team 1 Won")');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to club page
    await page.waitForURL(/\/clubs\/[\w-]+/);
    await expect(page.locator('text=11-9')).toBeVisible();
  });
});
