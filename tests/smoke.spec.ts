import { expect, Page, test } from '@playwright/test';

const sessionKey = 'team4-aria:enquiry-seen';

async function suppressAutoOpen(page: Page) {
  await page.addInitScript((key) => window.sessionStorage.setItem(key, 'true'), sessionKey);
}

async function completeEnquiryForm(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'General enquiry' });
  await dialog.getByLabel('Name *').fill('Local Test Visitor');
  await dialog.getByLabel('Indian mobile number *').fill('9876543210');
  await dialog.getByLabel('Email (optional)').fill('local-test@example.com');
  await dialog.getByText(/I agree to be contacted/).click();
  return dialog;
}

test('auto-opens once per session and preserves the three standalone quick actions', async ({ page }) => {
  await page.goto('/');

  const dialog = page.getByRole('dialog', { name: 'General enquiry' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Interested project *')).toHaveValue('team4-aria');

  const floatingActions = page.locator('[aria-label="Quick enquiry actions"] > *');
  await expect(floatingActions).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Open enquiry form' })).toBeEnabled();
  await expect(page.getByRole('link', { name: /Call \+91 80568 85347/ })).toHaveAttribute('href', 'tel:+918056885347');
  await expect(page.getByRole('link', { name: /Message Team4 Aria on WhatsApp/ })).toHaveAttribute('href', /wa\.me\/918056885347/);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.reload();
  await page.waitForTimeout(1400);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('validates locally, navigates only after confirmed save, and emits one non-PII event', async ({ page }) => {
  await suppressAutoOpen(page);
  let apiCalls = 0;
  await page.route('**/api/enquiries', async (route) => {
    apiCalls += 1;
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, referenceId: 'test-reference' }),
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open enquiry form' }).click();

  const dialog = page.getByRole('dialog', { name: 'General enquiry' });
  await dialog.getByRole('button', { name: 'Submit Enquiry' }).click();
  await expect(dialog.getByText('Please enter your name.')).toBeVisible();
  await expect(dialog.getByText('Enter a valid 10-digit Indian mobile number.')).toBeVisible();
  await expect(dialog.getByText('Please confirm that we may respond to this enquiry.')).toBeVisible();
  await expect(page).toHaveURL('/');

  await completeEnquiryForm(page);
  await dialog.getByRole('button', { name: 'Submit Enquiry' }).click();

  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.getByRole('heading', { name: 'Thank you for contacting Team4 Aria' })).toBeVisible();
  await expect(page.getByText('local-test@example.com')).toHaveCount(0);
  expect(apiCalls).toBe(1);

  const successEvents = await page.evaluate(() => (window.dataLayer ?? []).filter((entry) => entry.event === 'lead_form_success'));
  expect(successEvents).toEqual([{ event: 'lead_form_success', project_id: 'team4-aria' }]);
});

test('retains entered details after a database failure and retries with the same idempotency key', async ({ page }) => {
  await suppressAutoOpen(page);
  const idempotencyKeys: string[] = [];
  let apiCalls = 0;
  await page.route('**/api/enquiries', async (route) => {
    apiCalls += 1;
    idempotencyKeys.push(await route.request().headerValue('x-idempotency-key') ?? '');
    await route.fulfill({
      status: apiCalls === 1 ? 503 : 201,
      contentType: 'application/json',
      body: apiCalls === 1
        ? JSON.stringify({ success: false })
        : JSON.stringify({ success: true, referenceId: 'retry-reference' }),
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open enquiry form' }).click();
  const dialog = await completeEnquiryForm(page);

  await dialog.getByRole('button', { name: 'Submit Enquiry' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Your details are still here');
  await expect(dialog.getByLabel('Name *')).toHaveValue('Local Test Visitor');
  await expect(dialog.getByLabel('Indian mobile number *')).toHaveValue('9876543210');
  await expect(dialog.getByRole('button', { name: 'Submit Enquiry' })).toBeEnabled();
  await expect(page).toHaveURL('/');

  await dialog.getByRole('button', { name: 'Submit Enquiry' }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  expect(apiCalls).toBe(2);
  expect(idempotencyKeys[0]).not.toBe('');
  expect(idempotencyKeys[1]).toBe(idempotencyKeys[0]);
});

test('a direct Thank You visit creates no lead and exposes a way back', async ({ page }) => {
  let apiCalls = 0;
  await page.route('**/api/enquiries', async (route) => {
    apiCalls += 1;
    await route.abort();
  });
  await page.goto('/thank-you');

  await expect(page.getByRole('heading', { name: 'Thank you for contacting Team4 Aria' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to Team4 Aria' })).toHaveAttribute('href', '/');
  expect(apiCalls).toBe(0);
  const successEvents = await page.evaluate(() => (window.dataLayer ?? []).filter((entry) => entry.event === 'lead_form_success'));
  expect(successEvents).toHaveLength(0);
});

test('information pages support direct visits, mobile layout, footer links, and return navigation', async ({ page }) => {
  await suppressAutoOpen(page);
  const pages = [
    { path: '/disclaimer', heading: 'Disclaimer' },
    { path: '/privacy-policy', heading: 'Privacy Policy' },
    { path: '/terms-and-conditions', heading: 'Terms & Conditions' },
  ];

  for (const informationPage of pages) {
    const response = await page.goto(informationPage.path);
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: informationPage.heading })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to project' })).toHaveAttribute('href', '/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await expect(page.getByRole('article').getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy');
  await page.getByRole('link', { name: 'Back to project' }).click();
  await expect(page).toHaveURL(/\/$/);

  const informationLinks = page.getByRole('navigation', { name: 'Information pages' });
  await expect(informationLinks.getByRole('link', { name: 'Disclaimer' })).toHaveAttribute('href', '/disclaimer');
  await expect(informationLinks.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy');
  await expect(informationLinks.getByRole('link', { name: 'Terms & Conditions' })).toHaveAttribute('href', '/terms-and-conditions');
});
