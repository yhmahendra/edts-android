import { BasePage } from './base.page';
import { PriceCalculator } from '@support/price-calculator';

class ProductDetailPage extends BasePage {
  get productName() {
    return $('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/4si"]');
  }

  // First price element = current/sale price (second may be the original crossed-out price)
  get productPrice() {
    return $(
      '(//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/28j"])[1]'
    );
  }

  get addToCartButton() {
    return $('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/9kj"]');
  }

  get outOfStockLabel() {
    return $('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/2tr"]');
  }

  get backButton() {
    return $('//android.widget.ImageButton');
  }

  async getProductName(): Promise<string> {
    return this.actions.getText(this.productName);
  }

  async getProductPriceText(): Promise<string> {
    return this.actions.getText(this.productPrice);
  }

  async getProductPriceValue(): Promise<number> {
    const text = await this.getProductPriceText();
    return PriceCalculator.parseRupiah(text);
  }

  async isOutOfStock(): Promise<boolean> {
    return this.actions.isDisplayed(this.outOfStockLabel, 2000);
  }

  async addToCart(): Promise<void> {
    await this.actions.tapOn(this.addToCartButton);
    await browser.pause(2000);
  }

  async tryAddToCart(): Promise<boolean> {
    if (await this.isOutOfStock()) {
      return false;
    }
    await this.addToCart();
    return true;
  }

  async goBack(): Promise<void> {
    await browser.back();
    await browser.pause(1500);
  }
}

export default new ProductDetailPage();
