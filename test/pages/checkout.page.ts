import { BasePage } from './base.page';
import { PriceCalculator } from '@support/price-calculator';

class CheckoutPage extends BasePage {
  get shippingLabel() {
    return $(
      '//android.widget.TextView[contains(@text,"Pengiriman")] | ' +
        '//android.widget.TextView[contains(@text,"Ongkos Kirim")]'
    );
  }

  get shippingFeeValue() {
    return $(
      '//android.widget.TextView[contains(@text,"Pengiriman")]' +
        '/following-sibling::android.widget.TextView[contains(@text,"Rp")][1]'
    );
  }

  get insuranceLabel() {
    return $('//android.widget.TextView[contains(@text,"Asuransi")]');
  }

  get insuranceFeeValue() {
    return $(
      '//android.widget.TextView[contains(@text,"Asuransi")]' +
        '/following-sibling::android.widget.TextView[contains(@text,"Rp")][1]'
    );
  }

  get subtotalLabel() {
    return $(
      '//android.widget.TextView[contains(@text,"Subtotal")] | ' +
        '//android.widget.TextView[contains(@text,"Harga Produk")]'
    );
  }

  get beliButton() {
    return $(
      '//android.widget.TextView[@text="Beli"] | ' +
        '//android.widget.Button[@text="Beli"] | ' +
        '//android.widget.TextView[@text="Pesan Sekarang"] | ' +
        '//android.widget.TextView[@text="Lanjut"]'
    );
  }

  async getShippingFeeText(): Promise<string> {
    return this.actions.getTextOrEmpty(this.shippingFeeValue, 5000);
  }

  async getShippingFeeValue(): Promise<number> {
    const text = await this.getShippingFeeText();
    return PriceCalculator.parseRupiah(text);
  }

  async getInsuranceFeeText(): Promise<string> {
    const visible = await this.actions.isDisplayed(this.insuranceLabel, 3000);
    if (!visible) return 'Rp0';
    return this.actions.getTextOrEmpty(this.insuranceFeeValue, 5000);
  }

  async getInsuranceFeeValue(): Promise<number> {
    const text = await this.getInsuranceFeeText();
    return PriceCalculator.parseRupiah(text);
  }

  async proceedToPayment(): Promise<void> {
    await this.actions.swipeToElement(this.beliButton, 'up', 8);
    await this.actions.tapOn(this.beliButton);
    await browser.pause(3000);
  }
}

export default new CheckoutPage();
