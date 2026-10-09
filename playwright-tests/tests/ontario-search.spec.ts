import { test, expect } from '@playwright/test';
 
test.describe('Ontario.ca Search', () => {
 
  test.beforeEach(async ({ context }) => {
    // Skip language splash page by setting English cookie
    await context.addCookies([{
      name: 'lang',
      value: 'en',
      domain: '.ontario.ca',
      path: '/'
    }]);
  });
 
  test('navigate to Ontario.ca search page', async ({ page }) => {
    // Scenario 1: Basic Navigation — page.goto(), toHaveTitle()
    await page.goto('/search/search-results/?query=driver+licence');
    await expect(page.locator('.result-title a').first()).toContainText('driver');
  });
 
  test('search for driver licence returns results', async ({ page }) => {
  await page.goto('/search?query=health+card');
await page.waitForSelector('.result-title a');
await expect(page.locator('h2.results-summary-title')).toBeVisible();
await expect(page.locator('.result-title a').first()).toBeVisible();
await expect(page.locator('.result-title a').first()).toContainText('health');
});
 
  test('filter by topic narrows results', async ({ page }) => {
    // Scenario 3: Filter by Topic — checkbox interaction, Apply buttony
    await page.goto('/search/search-results/?query=driver+licence');
await page.waitForSelector('.result-title a');
await page.getByRole('checkbox', { name: 'Driving and road safety' }).check();
await page.getByRole('button', { name: 'Apply', exact: true }).click();
await expect(page.locator('.result-title a').first()).toBeVisible();
  });
 
  test('sort results by updated date', async ({ page }) => {
    // Scenario 4: Sort Results — radio button, dynamic content
    await page.goto('/search/search-results/?query=driver+licence');
await page.waitForSelector('.result-title a');
await page.getByLabel('Updated date (new to old)').check();
await page.getByRole('button', { name: 'Apply', exact: true }).click();
await expect(page.locator('.result-title a').first()).toBeVisible();
  });
 
  test('pagination navigates to next page', async ({ page }) => {
    // Scenario 6: Pagination — click navigation, URL assertions
    await page.goto('/search/search-results/?query=driver+licence');
await page.waitForSelector('.search-pagination');
await page.getByRole('button', { name: 'Go to page 2' }).click();
await expect(page.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute('aria-current', 'page');
  });
 
  test('search with no results shows empty state', async ({ page }) => {
    // Scenario 7: No Results Edge Case — negative testing
    await page.goto('/search/search-results/?query=xyznonexistentquery12345');
await expect(
  page.locator('h2.results-summary-title').filter({ hasText: /0 results/ })
).toBeVisible({ timeout: 10000 });
  });
 
  test('search input field is visible and functional', async ({ page }) => {
    // Bonus: Verify search input field presence and interaction
   await page.goto('/search/search-results/?query=driver+licence');
const searchInput = page.getByRole('combobox', { name: 'Search' });
await expect(searchInput).toBeVisible();
await searchInput.clear();
await searchInput.fill('health card');
await searchInput.press('Enter');
await page.waitForSelector('.result-title a');
await expect(page.locator('.result-title a').first()).toBeVisible();
  });
});