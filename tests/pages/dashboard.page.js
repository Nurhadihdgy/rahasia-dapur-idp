// @ts-check
import { expect } from '@playwright/test';

export class DashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.selectors = {
      okButton: { role: 'button', name: 'Ok' },
      logoutButton: { role: 'button', name: 'Logout' },
      userMenu: { role: 'button', name: /Hai, .+/ },
    };
  }

  async logout() {
    await this.page.getByRole('button', this.selectors.okButton).click();
    await this.page.getByRole('button', this.selectors.logoutButton).click();
    await expect(this.page.getByText('Berhasil keluar akun')).toBeVisible();
  }

  async openUserProfile() {
    await this.page.getByRole('button', this.selectors.userMenu).click();
  }
}