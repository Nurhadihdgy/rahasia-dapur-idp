// @ts-check
import { expect } from '@playwright/test';

export class TipsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Selector untuk halaman tips
    this.selectors = {
      tipsLink: { role: 'link', name: 'Cara Mengasah Pisau Tips Cara' },
      heading: { role: 'heading', name: 'Penjelasan Lengkap' },
    };
  }

  /**
   * Membuka halaman tips dan memverifikasi heading
   */
  async openTips() {
    await this.page.getByRole('link', this.selectors.tipsLink).click();
    // Perbaikan: name harus berada di dalam object
    await expect(
      this.page.getByRole('heading', { name: this.selectors.heading.name })
    ).toBeVisible();
  }
}