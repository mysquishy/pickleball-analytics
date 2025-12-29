import { test, expect } from '@playwright/test';

test.describe('Leaderboards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display overall leaderboard', async ({ page }) => {
    await page.goto('/clubs/test-club/leaderboard');

    // Check leaderboard elements
    await expect(page.locator('h1')).toContainText('Leaderboard');
    await expect(page.locator('text=Overall Leaderboard')).toBeVisible();

    // Check for medal icons
    await expect(page.locator('text=🥇').or(page.locator('#1'))).toBeVisible();
  });

  test('should filter leaderboard by type', async ({ page }) => {
    await page.goto('/clubs/test-club/leaderboard');

    // Change to monthly leaderboard
    await page.selectOption('select[name="type"]', 'monthly');

    await expect(page.locator('text=This Month Leaderboard')).toBeVisible();
  });

  test('should filter leaderboard by skill level', async ({ page }) => {
    await page.goto('/clubs/test-club/leaderboard');

    // Select skill-based leaderboard
    await page.selectOption('select[name="type"]', 'skill');
    await page.selectOption('select[name="skillLevel"]', '4.0');

    await expect(page.locator('text=Skill Level 4.0')).toBeVisible();
  });

  test('should display player win rates correctly', async ({ page }) => {
    await page.goto('/clubs/test-club/leaderboard');

    // Check that win rates are displayed
    const winRateElements = await page.locator('text=%').count();
    expect(winRateElements).toBeGreaterThan(0);

    // Check that win rates are between 0 and 100
    const firstWinRate = await page.locator('text=%').first().textContent();
    const numericValue = parseFloat(firstWinRate || '0');
    expect(numericValue).toBeGreaterThanOrEqual(0);
    expect(numericValue).toBeLessThanOrEqual(100);
  });

  test('should show leaderboard rules', async ({ page }) => {
    await page.goto('/clubs/test-club/leaderboard');

    await expect(page.locator('text=Leaderboard Rules')).toBeVisible();
    await expect(page.locator('text=5+ matches')).toBeVisible();
  });
});

test.describe('Leagues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should create a new league', async ({ page }) => {
    await page.goto('/clubs/test-club/leagues/new');

    // Fill in league form
    await page.fill('input[name="name"]', 'Spring 2025 League');
    await page.selectOption('select[name="format"]', 'ROUND_ROBIN');
    await page.selectOption('select[name="matchType"]', 'DOUBLES');

    // Select players
    await page.check('input[value="player1"]');
    await page.check('input[value="player2"]');
    await page.check('input[value="player3"]');
    await page.check('input[value="player4"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to league page
    await page.waitForURL(/\/leagues\/[\w-]+/);
    await expect(page.locator('h1')).toContainText('Spring 2025 League');
  });

  test('should display league standings', async ({ page }) => {
    await page.goto('/clubs/test-club/leagues/test-league');

    // Check standings elements
    await expect(page.locator('text=Standings')).toBeVisible();

    // Check for ranked players
    const playerRows = await page.locator('[data-testid="player-row"]').count();
    expect(playerRows).toBeGreaterThan(0);
  });

  test('should show schedule format', async ({ page }) => {
    await page.goto('/clubs/test-club/leagues/test-league');

    await expect(page.locator('text=Schedule Format')).toBeVisible();
    await expect(page.locator('text=Round Robin')).toBeVisible();
  });

  test('should validate minimum players for league', async ({ page }) => {
    await page.goto('/clubs/test-club/leagues/new');

    // Select only 2 players for doubles (need 4)
    await page.check('input[value="player1"]');
    await page.check('input[value="player2"]');

    // Try to submit
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=at least 4 players')).toBeVisible();
  });
});

test.describe('Player Profiles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display player statistics', async ({ page }) => {
    await page.goto('/players/test-player-id');

    // Check stats elements
    await expect(page.locator('text=Total Matches')).toBeVisible();
    await expect(page.locator('text=Wins')).toBeVisible();
    await expect(page.locator('text=Losses')).toBeVisible();
    await expect(page.locator('text=Win Rate')).toBeVisible();
  });

  test('should display recent form', async ({ page }) => {
    await page.goto('/players/test-player-id');

    await expect(page.locator('text=Recent Form')).toBeVisible();

    // Check for W/L indicators
    const formElements = await page.locator('text=/^[WL]$/').count();
    expect(formElements).toBeGreaterThan(0);
  });

  test('should display head-to-head statistics', async ({ page }) => {
    await page.goto('/players/test-player-id');

    await expect(page.locator('text=Head-to-Head')).toBeVisible();
    await expect(page.locator('text=Performance against opponents')).toBeVisible();
  });

  test('should display match history', async ({ page }) => {
    await page.goto('/players/test-player-id');

    await expect(page.locator('text=Recent Matches')).toBeVisible();

    // Check for match cards
    const matchCards = await page.locator('[data-testid="match-card"]').count();
    expect(matchCards).toBeGreaterThan(0);
  });
});
