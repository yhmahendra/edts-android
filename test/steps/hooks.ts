import { Before, After, Status } from '@wdio/cucumber-framework';
import { addAttachment } from '@wdio/allure-reporter';
import dataCapabilities from '@config/data-capabilities';
import orderData from '@data/order.data';

Before(async () => {
  // Ensure the app is in the foreground before each scenario
  await driver.activateApp(dataCapabilities.bundleId);
  await browser.pause(2000);

  // Reset shared order state
  orderData.reset();
});

After(async (world) => {
  // Attach a screenshot to the Allure report on failure
  if (world.result?.status === Status.FAILED) {
    try {
      const screenshot = await driver.takeScreenshot();
      addAttachment(
        'Failure Screenshot',
        Buffer.from(screenshot, 'base64'),
        'image/png'
      );
    } catch {
      // Screenshot capture failed — non-critical
    }
  }
});
