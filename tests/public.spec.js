// @ts-check
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { DashboardPage } from "./pages/dashboard.page";
import { UserProfilePage } from "./pages/userProfile.page";
import { TipsPage } from "./pages/tips.page";

test.describe("Rahasia Dapur Public Tests", () => {
  // =========================
  // Register User Dummy
  // =========================
  test("Register User Baru", async ({ page }) => {
    const timestamp = Date.now(); // generate unique timestamp
    const email = `dummy${timestamp}@gmail.com`;
    const name = `Dummy User ${timestamp}`;

    await page.goto("https://rahasiadapur.easyflow.my.id/");
    await page.getByRole("button", { name: "Daftar" }).click();

    await page.getByRole("textbox").first().fill(name);
    await page.locator('input[type="email"]').fill(email);
    await page.getByRole("textbox").nth(2).fill("dummy123");
    await page.getByRole("textbox").nth(3).fill("dummy123");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Registration successful!")).toBeVisible();
  });

  // =========================
  // Login
  // =========================
  test("Login Aplikasi Rahasia Dapur", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("ahmad@gmail.com", "dummy123");
  });

  // =========================
  // View Tips
  // =========================
  test("Get Detail Data Tips", async ({ page }) => {
    const tipsPage = new TipsPage(page);
    await page.goto("https://rahasiadapur.easyflow.my.id/");
    await tipsPage.openTips();
  });

  // =========================
  // View User Profile
  // =========================
  test("View User Profile", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login("ahmad@gmail.com", "dummy123");
    await dashboard.openUserProfile();
  });

  // =========================
  // Update User Profile
  // =========================
  test("Update User Profile", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const userProfile = new UserProfilePage(page);

    await loginPage.goto();
    await loginPage.login("ahmad@gmail.com", "dummy123");

    await dashboard.openUserProfile();
    await userProfile.updateProfile("Ahmad Dani");

    await dashboard.logout();
  });

  // =========================
  // Logout
  // =========================
  test("Logout Aplikasi Rahasia Dapur", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login("ahmad@gmail.com", "dummy123");

    await dashboard.logout();
  });

  test("Like Tips Without Login", async ({ page }) => {
    await page.goto("https://rahasiadapur.easyflow.my.id/");
    await page
      .getByRole("link", { name: "Cara Mengasah Pisau Tips Cara" })
      .click();
    await page.getByRole("button", { name: "Suka" }).click();
    await expect(page.getByText("Silakan login untuk menyukai")).toBeVisible();
  });
});
