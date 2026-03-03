// @ts-check
import { expect } from '@playwright/test';

export class UserProfilePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.selectors = {
      editProfileLink: { role: 'link', name: 'Ubah Profil' },
      nameInput: { role: 'textbox' },
      saveButton: { role: 'button', name: 'Simpan Perubahan' },
      successText: 'Profil berhasil diperbarui',
    };
  }

  /**
   * Update nama user di profil
   * @param {string} newName - Nama baru untuk profil
   */
  async updateProfile(newName) {
    await this.page.getByRole('link', this.selectors.editProfileLink).click();
    await this.page.getByRole('textbox').first().fill(newName);
    await this.page.getByRole('button', this.selectors.saveButton).click();
    await expect(this.page.getByText(this.selectors.successText)).toBeVisible();
  }
}