import { test, expect } from '@playwright/test';

test('Shop page sanity check: Hero, Sidebar, and Products render correctly', async ({ page }) => {
  // 1. Navigate to the shop page (or homepage if routed there)
  await page.goto('/shop');

  // 2. Assert that the main Hero section or header is visible
  // The Shop page has an h1 with the text "Shop"
  const heroHeading = page.locator('h1', { hasText: 'Shop' });
  await expect(heroHeading).toBeVisible();

  // 3. Assert that the Category filter sidebar is successfully rendered on the screen
  // The sidebar has a title "Filter Products" and a button for "CATEGORIES"
  const filterHeading = page.locator('h2', { hasText: 'Filter Products' });
  await expect(filterHeading).toBeVisible();

  const categoriesButton = page.locator('button', { hasText: 'CATEGORIES' });
  await expect(categoriesButton).toBeVisible();

  // 4. Assert that at least one product card is visible in the main grid
  // Products load asynchronously, so we wait for the first "Add to Cart" button to appear
  const firstAddToCartButton = page.locator('button:has-text("Add to Cart")').first();
  await expect(firstAddToCartButton).toBeVisible({ timeout: 15000 });

  // Optionally verify that an image within a product card is also loaded
  const firstProductImage = page.locator('.grid img').first();
  await expect(firstProductImage).toBeVisible();
});
