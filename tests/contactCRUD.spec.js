import { test, expect } from '@playwright/test';

let contactId;

test.describe('ContactList CRUD UI (Real API)', () => {

    test('create contact', async ({ page, request }) => {
        await page.goto('http://localhost:3000/add-contact');

        await page.fill('input[name="name"]', 'Playwright User');
        await page.fill('input[name="phone"]', '5551234');
        await page.click('button:has-text("Add Contact")');

        await page.waitForURL('http://localhost:3000/');

        // Ambil ID contact dari API
        const res = await request.get('http://localhost:3000/api/contacts?search=Playwright%20User');
        const data = await res.json();
        expect(data.items.length).toBeGreaterThan(0);

        contactId = data.items[0].id;
    });

    test('read contact detail', async ({ page }) => {
        await page.goto(`http://localhost:3000/api/contacts/${contactId}`);

        await expect(page.getByText('Playwright User')).toBeVisible();
        await expect(page.getByText('5551234')).toBeVisible();
    });

    test('update contact', async ({ page }) => {
        await page.goto(`http://localhost:3000/api/contacts/${contactId}`);

        await page.getByRole('button', { name: /edit/i }).click();
        await page.fill('input[name="name"]', 'Playwright Updated');
        await page.fill('input[name="phone"]', '999999');
        await page.click('button:has-text("Save Changes")');

        await expect(page.getByText('Playwright Updated')).toBeVisible();
    });

    test('delete contact', async ({ page, request }) => {
        await page.goto(`http://localhost:3000/api/contacts/${contactId}`);
        await page.getByRole('button', { name: /delete/i }).click();
        await page.getByRole('button', { name: /confirm/i }).click();

        // Pastikan sudah terhapus di database
        const res = await request.get(`http://localhost:3000/api/contacts/${contactId}`);
        expect(res.status()).toBe(404);
    });

});
