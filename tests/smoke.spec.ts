import { expect, Page, test } from '@playwright/test';

const sessionKey = 'hyderabad-residences:enquiry-seen';

async function suppressAutoOpen(page: Page) {
  await page.addInitScript((key) => window.sessionStorage.setItem(key, 'true'), sessionKey);
}

test('auto-opens once per session and exposes exactly three safe floating actions', async ({ page }) => {
  await page.goto('/');

  const dialog = page.getByRole('dialog', { name: 'General enquiry' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Interested project *')).toHaveValue('team4-aria');
  await expect(dialog.getByLabel('Enquiry type *')).toHaveValue('General enquiry');

  const floatingActions = page.locator('[aria-label="Quick enquiry actions"] > *');
  await expect(floatingActions).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Open enquiry form' })).toBeEnabled();
  await expect(page.getByRole('button', { name: /Call unavailable/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: /WhatsApp unavailable/ })).toBeDisabled();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.reload();
  await page.waitForTimeout(1400);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('all enquiry CTAs use the shared modal with project, intent, context, and focus return', async ({ page }, testInfo) => {
  await suppressAutoOpen(page);
  await page.goto('/');

  const planVisitButton = page.getByRole('button', { name: 'Plan Visit' });
  await planVisitButton.click();

  let dialog = page.getByRole('dialog', { name: 'Site visit' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Interested project *')).toHaveValue('team4-aria');
  await expect(dialog.getByLabel('Enquiry type *')).toHaveValue('Site visit');

  const closeButton = dialog.getByRole('button', { name: 'Close enquiry form' });
  await closeButton.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Review demo enquiry' })).toBeFocused();
  await closeButton.click();
  await expect(planVisitButton).toBeFocused();

  const floorPlanButton = page.getByRole('button', { name: /Schedule Visit for 3 BHK Type A/ });
  await floorPlanButton.scrollIntoViewIfNeeded();
  await floorPlanButton.click();
  dialog = page.getByRole('dialog', { name: 'Site visit' });
  await expect(dialog.getByText('Context:')).toContainText('3 BHK Type A (Classic)');

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-enquiry-modal.png`),
    fullPage: false,
  });

  await page.getByTestId('enquiry-backdrop').click({ position: { x: 4, y: 4 } });
  await expect(dialog).toBeHidden();
  await expect(floorPlanButton).toBeFocused();
});

test('validates required fields and keeps unconfigured submission in honest demo mode', async ({ page }) => {
  await suppressAutoOpen(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open enquiry form' }).click();

  const dialog = page.getByRole('dialog', { name: 'General enquiry' });
  await dialog.getByRole('button', { name: 'Review demo enquiry' }).click();
  await expect(dialog.getByText('Please enter your name.')).toBeVisible();
  await expect(dialog.getByText('Enter a valid 10-digit Indian mobile number.')).toBeVisible();
  await expect(dialog.getByText('Please confirm that we may respond to this enquiry.')).toBeVisible();

  await dialog.getByLabel('Name *').fill('Local Test Visitor');
  await dialog.getByLabel('Indian mobile number *').fill('9876543210');
  await dialog.getByLabel('Email (optional)').fill('local-test@example.com');
  await dialog.getByText(/I agree to be contacted/).click();
  await dialog.getByRole('button', { name: 'Review demo enquiry' }).click();

  await expect(dialog.getByRole('heading', { name: 'Demo enquiry reviewed' })).toBeVisible();
  await expect(dialog.getByText(/No data was sent or stored/)).toBeVisible();
});

test('preserves navigation, pricing, filters, gallery, and brochure state', async ({ page }, testInfo) => {
  await suppressAutoOpen(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Team4 ARIA' })).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-floating-actions.png`),
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Illustrative Price Calculator' }).click();
  await expect(page.getByRole('heading', { name: /Illustrative Base-Price Example/ })).toBeVisible();
  await expect(page.getByText('Unsupported figures intentionally hidden')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Brochure Not Yet Provided' })).toBeDisabled();

  await page.getByRole('button', { name: 'Sports & Fitness' }).click();
  await expect(page.getByRole('heading', { name: '10 International Badminton Courts' })).toBeVisible();

  await page.getByRole('button', { name: /View 3.5-Acre Central Courtyard/ }).click();
  await expect(page.getByRole('img', { name: /3.5-Acre Central Courtyard/ }).first()).toBeVisible();

  if ((await page.viewportSize())?.width === 390) {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    await expect(page.getByRole('link', { name: 'Project Overview' })).toBeVisible();
  }
});
