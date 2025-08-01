import { test, expect } from "@playwright/test";

test.describe("AddContactPage", () => {
    test.beforeEach(async ({ page }) => {
        // Mock endpoint API createContact (POST)
        await page.route("**/api/contacts", async (route) => {
            if (route.request().method() === "POST") {
                const postData = await route.request().postDataJSON();

                // Jika nama khusus untuk test error
                if (postData.name === "Fail") {
                    return route.fulfill({
                        status: 400,
                        contentType: "application/json",
                        body: JSON.stringify({ message: "Failed to add contact" }),
                    });
                }

                return route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: JSON.stringify({ id: 99, ...postData }),
                });
            }

            return route.fallback();
        });
    });

    test("menampilkan error jika form kosong", async ({ page }) => {
        await page.goto("http://localhost:3000/add-contact");

        await page.click('button:has-text("Add Contact")');

        await expect(page.getByText("Name and phone are required.")).toBeVisible();
    });

    test("menambahkan contact sukses dan redirect", async ({ page }) => {
        await page.goto("http://localhost:3000/add-contact");

        await page.fill('input[name="name"]', "John Doe");
        await page.fill('input[name="phone"]', "123456789");
        await page.click('button:has-text("Add Contact")');

        // Tunggu sampai halaman berubah ke "/"
        await page.waitForURL("http://localhost:3000/");
        await expect(page.url()).toBe("http://localhost:3000/");
    });

    test("menampilkan error jika API gagal", async ({ page }) => {
        await page.route("**/api/contacts", async (route) => {
            // Pastikan memicu reject
            return route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({ message: "Failed to add contact" })
            });
        });

        await page.goto("http://localhost:3000/add-contact");

        await page.fill('input[name="name"]', "Fail");
        await page.fill('input[name="phone"]', "123456789");
        await page.click('button:has-text("Add Contact")');

        // Tunggu teks error muncul
        await expect(page.getByText("Failed to add contact", { exact: true })).toBeVisible();
    });

});
