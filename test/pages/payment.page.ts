import { BasePage } from './base.page';
import { PriceCalculator } from '@support/price-calculator';

class PaymentPage extends BasePage {
  get bcaVirtualAccountOption() {
    return $('//android.widget.TextView[@text="BCA Virtual Account"]');
  }

  get pembayaranHeader() {
    return $('//android.widget.TextView[@text="Pembayaran"]');
  }

  get totalPembayaranRow() {
    return $(
      '//android.widget.TextView[contains(@text,"Total Pembayaran")] | ' +
        '//android.widget.TextView[contains(@text,"Total Tagihan")]'
    );
  }

  // First Rp element that follows a "Total" label
  get totalAmountValue() {
    return $(
      '(//android.widget.TextView[contains(@text,"Rp")]' +
        '[preceding-sibling::android.widget.TextView[contains(@text,"Total")]])[1]'
    );
  }

  get shippingFeeValue() {
    return $(
      '//android.widget.TextView[contains(@text,"Ongkos Kirim") or ' +
        'contains(@text,"Biaya Pengiriman") or contains(@text,"Pengiriman")]' +
        '/following-sibling::android.widget.TextView[contains(@text,"Rp")][1]'
    );
  }

  get insuranceFeeValue() {
    return $(
      '//android.widget.TextView[contains(@text,"Asuransi")]' +
        '/following-sibling::android.widget.TextView[contains(@text,"Rp")][1]'
    );
  }

  get bayarSekarangButton() {
    return $(
      '//android.widget.TextView[@text="Bayar sekarang"] | ' +
        '//android.widget.Button[@text="Bayar sekarang"] | ' +
        '//android.widget.TextView[@text="Bayar Sekarang"] | ' +
        '//android.widget.Button[@text="Bayar Sekarang"]'
    );
  }

  get lihatDetailButton() {
    return $('//android.widget.TextView[@text="Lihat Detail"]');
  }

  async isOnPaymentPage(): Promise<boolean> {
    return this.actions.isDisplayed(this.pembayaranHeader, 8000);
  }

  async selectBcaVirtualAccount(): Promise<void> {
    await this.actions.swipeToElement(this.bcaVirtualAccountOption, 'up', 6);
    await this.actions.tapOn(this.bcaVirtualAccountOption);
    await browser.pause(1500);
  }

  async expandTotalSection(): Promise<void> {
    const visible = await this.actions.isDisplayed(this.totalPembayaranRow, 5000);
    if (visible) {
      await this.actions.tapOn(this.totalPembayaranRow);
      await browser.pause(1000);
    }
  }

  async getTotalAmountText(): Promise<string> {
    return this.actions.getTextOrEmpty(this.totalAmountValue, 5000);
  }

  async getTotalAmountValue(): Promise<number> {
    const text = await this.getTotalAmountText();
    return PriceCalculator.parseRupiah(text);
  }

  async getShippingFeeText(): Promise<string> {
    return this.actions.getTextOrEmpty(this.shippingFeeValue, 4000);
  }

  async getShippingFeeValue(): Promise<number> {
    return PriceCalculator.parseRupiah(await this.getShippingFeeText());
  }

  async getInsuranceFeeText(): Promise<string> {
    const visible = await this.actions.isDisplayed(this.insuranceFeeValue, 3000);
    if (!visible) return 'Rp0';
    return this.actions.getTextOrEmpty(this.insuranceFeeValue, 3000);
  }

  async getInsuranceFeeValue(): Promise<number> {
    return PriceCalculator.parseRupiah(await this.getInsuranceFeeText());
  }

  async tapBayarSekarang(): Promise<void> {
    // Extra pause — swiping immediately after BCA VA selection crashes UiAutomator2
    await browser.pause(2000);
    if (await this.actions.isDisplayed(this.bayarSekarangButton, 5000)) {
      await this.actions.tapOn(this.bayarSekarangButton);
    } else {
      await this.actions.swipeToElement(this.bayarSekarangButton, 'up', 5);
      await this.actions.tapOn(this.bayarSekarangButton);
    }
    await browser.pause(4000);
  }

  async tapLihatDetail(): Promise<void> {
    await this.actions.swipeToElement(this.lihatDetailButton, 'up', 5);
    await this.actions.tapOn(this.lihatDetailButton);
    await browser.pause(2000);
  }
}

export default new PaymentPage();
