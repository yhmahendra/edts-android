import { BasePage } from './base.page';

class CartPage extends BasePage {
  get keranjangTab() {
    return $('//android.widget.TextView[@text="Keranjang"]');
  }

  // Cart summary bar at the bottom of search results after adding to cart (rid=duq, SDK 36)
  get cartSummaryBar() {
    return $('//android.widget.FrameLayout[@resource-id="com.indomaret.klikindomaret:id/duq"]');
  }

  get belanjaXpressTab() {
    return $(
      '//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/4rk"]'
    );
  }

  get belanjaXtraTab() {
    return $(
      '//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/cgl"]'
    );
  }

  get emptyCartMessage() {
    return $('//android.widget.TextView[contains(@text,"masih")]');
  }

  get cartItemNames() {
    return $$('//android.widget.TextView[@resource-id="com.indomaret.klikindomaret:id/e85"]');
  }

  // Button text can be "Beli (1)" when items are in cart
  get beliButton() {
    return $(
      '//android.widget.TextView[starts-with(@text,"Beli")] | ' +
        '//android.widget.Button[starts-with(@text,"Beli")] | ' +
        '//android.widget.TextView[@text="Checkout"] | ' +
        '//android.widget.TextView[@text="Lanjut ke Pembayaran"]'
    );
  }

  async navigateToCart(): Promise<void> {
    // Cart icon (rid=ce7) in the floating bar on the product detail page
    const productDetailCartIcon = $(
      '//android.widget.FrameLayout[@resource-id="com.indomaret.klikindomaret:id/ce7"]'
    );
    if (await this.actions.isDisplayed(productDetailCartIcon, 3000)) {
      await this.actions.tapOn(productDetailCartIcon);
      await browser.pause(2000);
      return;
    }

    await browser.keys(['']);
    await browser.pause(1000);
    if (await this.actions.isDisplayed(this.cartSummaryBar, 5000)) {
      await this.actions.tapOn(this.cartSummaryBar);
      await browser.pause(2000);
      return;
    }

    await this.actions.tapOn(this.keranjangTab);
    await browser.pause(1500);
  }

  async selectXtraDelivery(): Promise<void> {
    await this.actions.tapOn(this.belanjaXtraTab);
    await browser.pause(1000);
  }

  async selectXpressDelivery(): Promise<void> {
    // Tab may already be active — skip rather than throw if not found
    if (await this.actions.isDisplayed(this.belanjaXpressTab, 5000)) {
      await this.actions.tapOn(this.belanjaXpressTab);
      await browser.pause(1000);
    }
  }

  async selectRegularOrderType(): Promise<void> {
    const regularOption = $('//android.widget.TextView[@text="Reguler"]');
    if (await this.actions.isDisplayed(regularOption, 3000)) {
      await this.actions.tapOn(regularOption);
      await browser.pause(500);
    }
  }

  async isCartEmpty(): Promise<boolean> {
    return this.actions.isDisplayed(this.emptyCartMessage, 3000);
  }

  async proceedToCheckout(): Promise<void> {
    await this.actions.swipeToElement(this.beliButton, 'up', 5);
    await this.actions.tapOn(this.beliButton);
    await browser.pause(3000);
  }
}

export default new CartPage();
