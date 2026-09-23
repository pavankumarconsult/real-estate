import { expect, test } from '@playwright/test';

test('renders the responsive project experience and core controls', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Hyderabad Residences/);
  await expect(page.getByRole('heading', { level: 1, name: 'Team4 ARIA' })).toBeVisible();
  await expect(page.getByText('Demo mode: no enquiry delivery destination is configured.')).toBeAttached();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-home.png`),
    fullPage: false,
  });

  if (testInfo.project.name === 'mobile-chrome') {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    await expect(page.getByRole('link', { name: 'Project Overview' })).toBeVisible();
    await page.getByRole('link', { name: 'Project Overview' }).click();
    await expect(page.locator('#mobile-navigation')).toBeHidden();
  }

  await page.getByRole('button', { name: 'Illustrative Price Calculator' }).click();
  await expect(page.getByRole('heading', { name: /Illustrative Base-Price Example/ })).toBeVisible();
  await expect(page.getByText('Unsupported figures intentionally hidden')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Brochure Not Yet Provided' })).toBeDisabled();

  await page.getByRole('button', { name: 'Sports & Fitness' }).click();
  await expect(page.getByRole('heading', { name: '10 International Badminton Courts' })).toBeVisible();

  await page.getByRole('button', { name: /View 3.5-Acre Central Courtyard/ }).click();
  await expect(page.getByRole('img', { name: /3.5-Acre Central Courtyard/ }).first()).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-interaction.png`),
    fullPage: false,
  });
});

test('validates and previews a local-only site visit request', async ({ page }, testInfo) => {
  await page.goto('/#sitevisit');

  await page.getByLabel('Full Name *').fill('Local Test Visitor');
  await page.getByLabel('Mobile Number *').fill('9876543210');
  await page.getByLabel('Email Address *').fill('local-test@example.com');
  await page.getByRole('button', { name: 'Review Demo Request' }).click();

  await expect(page.getByText('Demo Preview Only')).toBeVisible();
  await expect(page.getByText('No appointment has been sent or confirmed')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download Personal Reminder (.ics)' })).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-demo-preview.png`),
    fullPage: false,
  });
});
