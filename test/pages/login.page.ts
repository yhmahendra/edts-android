import { BasePage } from './base.page';

class LoginPage extends BasePage {
  get akunTab() {
    // Exclude the "Akun" label inside product cards (rid=8vd)
    return $(
      '//android.widget.TextView[@text="Akun"][not(ancestor::*[@resource-id="com.indomaret.klikindomaret:id/8vd"])]'
    );
  }

  get masukDaftarButton() {
    return $('//android.widget.TextView[@text="Masuk / Daftar"]');
  }

  get phoneEmailInput() {
    return $('//android.widget.EditText');
  }

  get lanjutButton() {
    return $('//android.widget.TextView[@text="Lanjut"]');
  }

  get passwordInput() {
    return $('//android.widget.EditText');
  }

  get masukButton() {
    return $('//android.widget.TextView[@text="Masuk"]');
  }

  get nantiSajaButton() {
    return $('//android.widget.TextView[@text="Nanti Saja"]');
  }

  get loggedInPhone() {
    return $(`//android.widget.TextView[@text="${process.env.USER_PHONE ?? ''}"]`);
  }

  get loginPrompt() {
    return $('//android.widget.TextView[contains(@text,"Login dulu yuk")]');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.actions.isDisplayed(this.masukDaftarButton, 3000).then((v) => !v);
  }

  async navigateToLoginScreen(): Promise<void> {
    await this.actions.tapOn(this.akunTab);
    await browser.pause(1000);
    await this.actions.tapOn(this.masukDaftarButton);
    await browser.pause(1000);
  }

  async enterPhone(phone: string): Promise<void> {
    await this.actions.typeTextSlow(this.phoneEmailInput, phone);
    await browser.pause(500);
    await this.actions.tapOn(this.lanjutButton);
    await browser.pause(3000);
  }

  async enterPassword(password: string): Promise<void> {
    await this.actions.waitForDisplayed(this.passwordInput, 10000);
    await this.actions.typeTextSlow(this.passwordInput, password, 150);
    await browser.pause(500);
    await this.actions.tapOn(this.masukButton);
    await browser.pause(4000);
  }

  async dismissBiometricPrompt(): Promise<void> {
    const dismissed = await this.actions.tapIfDisplayed(this.nantiSajaButton, 5000);
    if (dismissed) await browser.pause(1000);
  }

  async login(phone: string, password: string): Promise<void> {
    await this.navigateToLoginScreen();
    await this.enterPhone(phone);
    await this.enterPassword(password);
    await this.dismissBiometricPrompt();
  }
}

export default new LoginPage();
