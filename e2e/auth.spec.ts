import { test, expect } from '@playwright/test';

test('authentication flow', async ({ page }) => {
  // Sign up
  await page.goto('/auth/signup');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="name"]', 'Test User');
  await page.click('button[type="submit"]');
  
  // Should redirect to home after signup
  await expect(page).toHaveURL('/');
  
  // Sign out
  await page.click('text=Sign Out');
  
  // Should redirect to sign in
  await expect(page).toHaveURL('/auth/signin');
});
