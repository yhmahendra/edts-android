import { BasePage } from './base.page';
import { PriceCalculator } from '@support/price-calculator';

class OrderSuccessPage extends BasePage {
  get successHeader() {
    return $(
      '//android.widget.TextView[contains(@text,"Berhasil")] | ' +
        '//android.widget.TextView[contains(@text,"Sukses")] | ' +
        '//android.widget.TextView[contains(@text,"Pesanan dibuat")]'
    );
  }

  get orderNumber() {
    return $(
      '//android.widget.TextView[contains(@text,"#")] | ' +
        '//android.widget.TextView[contains(@text,"No. Pesanan")]' +
        '/following-sibling::android.widget.TextView[1]'
    );
  }

  get totalPriceLabel() {
    return $(
      '//android.widget.TextView[contains(@text,"Total")] | ' +
        '//android.widget.TextView[contains(@text,"Nominal")]'
    );
  }

  get totalPriceValue() {
    return $(
      '//android.widget.TextView[contains(@text,"Total")]' +
        '/following-sibling::android.widget.TextView[contains(@text,"Rp")][1] | ' +
        '//android.widget.TextView[contains(@text,"Rp") and ' +
        'preceding-sibling::android.widget.TextView[contains(@text,"Total")]]'
    );
  }

  get backToHomeButton() {
    return $(
      '//android.widget.TextView[@text="Kembali ke Beranda"] | ' +
        '//android.widget.TextView[@text="Belanja Lagi"]'
    );
  }

  async isOrderSuccessful(): Promise<boolean> {
    return this.actions.isDisplayed(this.successHeader, 15000);
  }

  async getTotalPriceText(): Promise<string> {
    await this.actions.swipeToElement(this.totalPriceLabel, 'down', 3);
    return this.actions.getTextOrEmpty(this.totalPriceValue, 8000);
  }

  async getTotalPriceValue(): Promise<number> {
    const text = await this.getTotalPriceText();
    return PriceCalculator.parseRupiah(text);
  }

  async assertSuccessPageVisible(): Promise<void> {
    await this.actions.expectToDisplayed(this.successHeader);
  }
}

export default new OrderSuccessPage();
