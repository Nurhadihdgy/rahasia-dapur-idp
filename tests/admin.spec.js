// @ts-check
import { test, expect } from "@playwright/test";
import path from "path";

const ADMIN_URL = "https://rahasiadapur.easyflow.my.id/admin";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

/**
 * Helper login admin
 * @param {import('@playwright/test').Page} page
 */

async function loginAdmin(page) {
  await page.goto(ADMIN_URL);

  await page
    .getByRole("textbox", { name: "admin@dapur.com" })
    .fill(ADMIN_EMAIL);
  await page
    .getByRole("textbox", { name: "Masukkan Password" })
    .fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login as Admin" }).click();

  await expect(page.getByText("Welcome back, Admin!")).toBeVisible();

  await page.getByRole("button", { name: "Ok" }).click();
}

let recipeTitle = ""; // Variabel global untuk menyimpan judul resep yang dibuat, agar bisa digunakan di test delete

test.describe("Admin Tests", () => {
  test("Admin Login", async ({ page }) => {
    await loginAdmin(page);
  });

  test("Add Recipe", async ({ page }) => {
    await loginAdmin(page);

    // Handle popup OK jika ada
    const okButton = page.getByRole("button", { name: "Ok" });
    if (await okButton.isVisible()) {
      await okButton.click();
    }

    // 🔥 Generate unique recipe (anti duplicate)
    const uniqueId = Date.now();
    recipeTitle = `Soto Ayam ${uniqueId}`;
    const recipeStory = `Soto ayam lamongan ${uniqueId}`;

    await page.getByRole("link", { name: "Recipes" }).click();
    await page.getByRole("button", { name: "Add Recipe" }).click();

    await page
      .getByRole("textbox", { name: /Masukkan judul/ })
      .fill(recipeTitle);
    await page
      .getByRole("textbox", { name: "Tuliskan cerita singkat" })
      .fill(recipeStory);

    await page.getByRole("combobox").selectOption("Beverage");

    await page
      .getByRole("textbox", { name: /Contoh: 2 siung bawang putih/ })
      .first()
      .fill("Bawang Merah");

    await page.getByRole("button", { name: "Tambah Bahan" }).click();

    await page
      .getByRole("textbox", { name: /Contoh: 2 siung bawang putih/ })
      .nth(1)
      .fill("Cabe Ijo");

    await page
      .getByRole("textbox", { name: /Contoh: Tumis bumbu hingga/ })
      .first()
      .fill("Goreng Goreng");

    await page.getByRole("button", { name: "Tambah Langkah" }).click();

    await page
      .getByRole("textbox", { name: /Contoh: Tumis bumbu hingga/ })
      .nth(1)
      .fill("Masak Masak");

    await page.getByRole("button", { name: "Tambah Langkah" }).click();

    await page
      .getByRole("textbox", { name: /Contoh: Tumis bumbu hingga/ })
      .nth(2)
      .fill("Rebus");

    // FIX Upload file (hindari ENOENT)
    const filePath = path.resolve(__dirname, "../tests/test-data/sample.jpg");
    await page.setInputFiles('input[type="file"]', filePath);

    await page.getByRole("button", { name: "Simpan Resep" }).click();

    await expect(page.getByText("Resep berhasil ditambahkan")).toBeVisible();
  });

  test("Delete Recipe", async ({ page }) => {
    await loginAdmin(page);

    await page.getByRole("link", { name: "Recipes" }).click();

    page.once("dialog", async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Delete Recipe" }).first().click();
    await expect(page.getByText("Recipe deleted successfully")).toBeVisible();
  });
});
