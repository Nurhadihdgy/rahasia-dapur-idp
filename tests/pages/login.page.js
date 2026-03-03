// @ts-check
import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // URL halaman login
    this.url = 'https://rahasiadapur.easyflow.my.id/';

    // Selector untuk elemen-elemen penting di halaman login
    this.selectors = {
      masukButton: { role: 'button', name: 'Masuk' },
      usernameInput: { role: 'textbox', name: 'nama@email.com' },
      passwordInput: { role: 'textbox', name: '••••••••' },
      loginButton: { role: 'button', name: 'Login' },
      welcomeText: 'Selamat datang kembali!',
    };
  }

  /**
   * Buka halaman login
   */
  async goto() {
    await this.page.goto(this.url);
  }

  /**
   * Melakukan login dengan email dan password
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.page.getByRole('button', this.selectors.masukButton).click();
    await this.page.getByRole('textbox', this.selectors.usernameInput).fill(email);
    await this.page.getByRole('textbox', this.selectors.passwordInput).fill(password);
    await this.page.getByRole('button', this.selectors.loginButton).click();
    await expect(this.page.getByText(this.selectors.welcomeText)).toBeVisible();
  }
}