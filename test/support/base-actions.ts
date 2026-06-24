import type { ChainablePromiseElement } from 'webdriverio';

class BaseActions {
  async tapOn(selector: ChainablePromiseElement, timeout = 15000): Promise<void> {
    const element = await selector;
    await element.waitForDisplayed({ timeout });
    await element.click();
  }

  async tapOnText(text: string, timeout = 10000): Promise<void> {
    const el = $(`//android.widget.TextView[@text='${text}']`);
    await this.tapOn(el, timeout);
  }

  async tapOnTextContains(text: string, timeout = 10000): Promise<void> {
    const el = $(`//android.widget.TextView[contains(@text,'${text}')]`);
    await this.tapOn(el, timeout);
  }

  async tapIfDisplayed(selector: ChainablePromiseElement, timeout = 5000): Promise<boolean> {
    const visible = await this.isDisplayed(selector, timeout);
    if (visible) {
      await this.tapOn(selector);
    }
    return visible;
  }

  async typeText(selector: ChainablePromiseElement, text: string): Promise<void> {
    const element = await selector;
    await element.waitForDisplayed({ timeout: 10000 });
    await element.clearValue();
    await element.setValue(text);
  }

  async typeTextSlow(
    selector: ChainablePromiseElement,
    text: string,
    delayMs = 120
  ): Promise<void> {
    const element = await selector;
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
    // clearValue() is atomic — avoids queued Backspace events interleaving with typing
    await element.clearValue();
    await browser.pause(300);
    // browser.keys() appends to the focused field; element.addValue() calls setText() which replaces
    for (const char of text) {
      await browser.keys([char]);
      await browser.pause(delayMs);
    }
  }

  async clearAndType(selector: ChainablePromiseElement, text: string): Promise<void> {
    const element = await selector;
    await element.waitForDisplayed({ timeout: 10000 });
    await element.clearValue();
    await browser.pause(300);
    await element.setValue(text);
  }

  async getText(selector: ChainablePromiseElement, timeout = 10000): Promise<string> {
    const element = await selector;
    await element.waitForDisplayed({ timeout });
    return element.getText();
  }

  async getTextOrEmpty(selector: ChainablePromiseElement, timeout = 5000): Promise<string> {
    try {
      return await this.getText(selector, timeout);
    } catch {
      return '';
    }
  }

  async waitForDisplayed(selector: ChainablePromiseElement, timeout = 15000): Promise<void> {
    await (await selector).waitForDisplayed({ timeout });
  }

  async waitForExist(selector: ChainablePromiseElement, timeout = 15000): Promise<void> {
    await (await selector).waitForExist({ timeout });
  }

  async isDisplayed(selector: ChainablePromiseElement, timeout = 5000): Promise<boolean> {
    try {
      await (await selector).waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async expectToDisplayed(selector: ChainablePromiseElement): Promise<void> {
    await expect(selector).toBeDisplayed();
  }

  async expectText(selector: ChainablePromiseElement, expectedText: string): Promise<void> {
    const actual = await this.getText(selector);
    expect(actual).toContain(expectedText);
  }

  async expectTextEquals(selector: ChainablePromiseElement, expectedText: string): Promise<void> {
    const actual = await this.getText(selector);
    expect(actual).toBe(expectedText);
  }

  async swipeUp(times = 1): Promise<void> {
    const { width, height } = await browser.getWindowSize();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.7);
    const endY = Math.floor(height * 0.3);

    for (let i = 0; i < times; i++) {
      await browser
        .action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: 700, x: startX, y: endY })
        .up({ button: 0 })
        .perform();
      await browser.pause(600);
    }
  }

  async swipeDown(times = 1): Promise<void> {
    const { width, height } = await browser.getWindowSize();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.3);
    const endY = Math.floor(height * 0.7);

    for (let i = 0; i < times; i++) {
      await browser
        .action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ duration: 0, x: startX, y: startY })
        .down({ button: 0 })
        .move({ duration: 700, x: startX, y: endY })
        .up({ button: 0 })
        .perform();
      await browser.pause(600);
    }
  }

  async swipeToElement(
    selector: ChainablePromiseElement,
    direction: 'up' | 'down' = 'up',
    maxSwipes = 8
  ): Promise<void> {
    for (let i = 0; i < maxSwipes; i++) {
      if (await this.isDisplayed(selector, 2000)) return;
      direction === 'up' ? await this.swipeUp() : await this.swipeDown();
    }
    throw new Error(`Element not found after ${maxSwipes} swipes`);
  }

  async activateApp(bundleId: string): Promise<void> {
    await driver.activateApp(bundleId);
    await browser.pause(2000);
  }

  async pressBack(): Promise<void> {
    await browser.keys(['']);
  }
}

export default new BaseActions();
