import { BasePage } from './base.page';

class SearchPage extends BasePage {
  get searchInput() {
    return $('//android.widget.EditText');
  }

  get firstProductName() {
    return $(
      '(//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/e85"])[1]'
    );
  }

  get productNames() {
    return $$('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/e85"]');
  }

  get productPrices() {
    return $$('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/28j"]');
  }

  async searchFor(query: string): Promise<void> {
    await this.actions.waitForDisplayed(this.searchInput, 10000);
    await this.actions.typeTextSlow(this.searchInput, query);
    await browser.pause(500);
    await browser.keys(['']);
    await browser.pause(3000);
  }

  async tapFirstAvailableProduct(): Promise<void> {
    const count = await this.productNames.length;
    if (count === 0) {
      throw new Error('No products found in search results');
    }
    const products = await this.productNames;
    await products[0].click();
    await browser.pause(3000);
  }
}

export default new SearchPage();
