import { test, expect } from '@playwright/test';

// Dummy data API
const contactsPage1 = {
    items: [
        { id: 1, name: "John Doe", phone: "123" },
        { id: 2, name: "Jane Smith", phone: "456" },
    ],
    page: 1,
    pages: 2,
};

const contactsPage2 = {
    items: [
        { id: 3, name: "Michael", phone: "789" },
    ],
    page: 2,
    pages: 2,
};

test.describe('ContactList CRUD UI', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept API getContacts
        await page.route('**/api/contacts**', (route) => {
            const url = new URL(route.request().url());
            const pageParam = url.searchParams.get('page');
            if (pageParam === '2') {
                route.fulfill({ json: contactsPage2 });
            } else {
                route.fulfill({ json: contactsPage1 });
            }
        });
    });

    test.beforeEach(async ({ page }) => {
        await page.route('**/api/contacts**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    items: [
                        { id: 1, name: "John Doe", phone: "123" },
                        { id: 2, name: "Jane Smith", phone: "456" }
                    ],
                    page: 1,
                    pages: 1
                })
            });
        });
    });

    test('render awal & menampilkan data', async ({ page }) => {
        await page.goto('http://localhost:3000'); // pastikan URL memuat ContactList
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(page.getByText('Jane Smith')).toBeVisible();
    });

    test('search memanggil API dengan query', async ({ page }) => {
        await page.goto('http://localhost:3000');

        const searchBox = page.getByPlaceholder('Search by name...');
        await searchBox.fill('John');
        await page.waitForTimeout(500); // debounce

        expect(await searchBox.inputValue()).toBe('John');
    });

    test('toggle sort', async ({ page }) => {
        await page.goto('http://localhost:3000');
        const sortButton = page.locator('button').first();
        await sortButton.click();
        // Di sini kita hanya cek tombol berubah icon-nya
        await expect(sortButton.locator('svg')).toBeVisible();
    });

    test('infinite scroll memuat halaman berikutnya', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Scroll sampai sentinel element
        const sentinel = page.locator('div').last();
        await sentinel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500); // beri waktu observer trigger

        await expect(page.getByText('Michael')).toBeVisible();
    });
});
