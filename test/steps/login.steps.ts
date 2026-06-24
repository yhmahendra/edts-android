import { Given, When } from '@wdio/cucumber-framework';
import loginPage from '@pages/login.page';
import homePage from '@pages/home.page';
import loginData from '@data/login.data';

Given('The Klik Indomaret app is launched', async () => {
  await homePage.navigateToHome();
  await browser.pause(1000);
});

When('User logs in with valid credentials', async () => {
  await loginPage.actions.tapOn(loginPage.akunTab);
  await browser.pause(1000);

  // If "Masuk / Daftar" is absent, the user is already logged in
  const needsLogin = await loginPage.actions.isDisplayed(loginPage.masukDaftarButton, 3000);
  if (!needsLogin) {
    await homePage.navigateToHome();
    return;
  }

  await loginPage.actions.tapOn(loginPage.masukDaftarButton);
  await browser.pause(1000);
  await loginPage.enterPhone(loginData.phone);
  await loginPage.enterPassword(loginData.password);
  await loginPage.dismissBiometricPrompt();
  await homePage.navigateToHome();
});
