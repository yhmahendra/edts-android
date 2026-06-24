import { BasePage } from './base.page';

class HomePage extends BasePage {
  get berandaTab() {
    return $('//android.widget.TextView[@text="Beranda"]');
  }

  get keranjangTab() {
    return $('//android.widget.TextView[@text="Keranjang"]');
  }

  get searchBar() {
    return $('//android.widget.TextView[@text="Cari di Klik Indomaret"]');
  }

  get deliveryAddress() {
    return $('//android.widget.TextView[contains(@text,"Dikirim ke")]');
  }

  get loginPrompt() {
    return $('//android.widget.TextView[contains(@text,"Login dulu yuk")]');
  }

  async navigateToHome(): Promise<void> {
    // Press BACK up to 5× in case the app is stuck on a sub-screen from a previous run
    for (let i = 0; i < 5; i++) {
      if (await this.actions.isDisplayed(this.berandaTab, 3000)) break;
      await browser.keys(['']);
      await browser.pause(800);
    }
    await this.actions.tapOn(this.berandaTab);
    await browser.pause(1000);
  }

  async tapSearchBar(): Promise<void> {
    await this.actions.tapOn(this.searchBar);
    await browser.pause(1000);
  }

  async isOnHomePage(): Promise<boolean> {
    return this.actions.isDisplayed(this.searchBar, 5000);
  }
}

export default new HomePage();
