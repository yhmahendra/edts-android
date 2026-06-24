import { When } from '@wdio/cucumber-framework';
import homePage from '@pages/home.page';
import searchPage from '@pages/search.page';
import productDetailPage from '@pages/product-detail.page';
import cartPage from '@pages/cart.page';
import orderData from '@data/order.data';
import dataConfig from '@config/data-config';

When('User searches for {string}', async (keyword: string) => {
  await homePage.navigateToHome();
  await homePage.tapSearchBar();
  await searchPage.searchFor(keyword);
});

When('User searches for a product', async () => {
  await homePage.navigateToHome();
  await homePage.tapSearchBar();
  await searchPage.searchFor(dataConfig.searchKeyword);
});

When('User opens the first available product', async () => {
  // Wait for at least one result to render before reading the list
  const hasResults = await searchPage.actions.isDisplayed(searchPage.firstProductName, 10000);
  if (!hasResults) {
    throw new Error(`No products found for search keyword "${dataConfig.searchKeyword}"`);
  }

  const totalCount = await searchPage.productNames.length;
  if (totalCount === 0) {
    throw new Error(`No products found for search keyword "${dataConfig.searchKeyword}"`);
  }

  const maxTries = Math.min(totalCount, 5);

  for (let i = 0; i < maxTries; i++) {
    const currentProducts = await searchPage.productNames;
    const currentCount = await searchPage.productNames.length;
    if (i >= currentCount) break;

    const productName = await currentProducts[i].getText();
    await currentProducts[i].click();
    await browser.pause(3000);

    const outOfStock = await productDetailPage.isOutOfStock();
    if (!outOfStock) {
      await browser.pause(2000);
      orderData.productName = productName;
      console.info(`Selected product: ${productName}`);
      return;
    }

    console.warn(`Product "${productName}" is out of stock — trying next`);
    await productDetailPage.goBack();
    await browser.pause(1500);
  }

  throw new Error('No in-stock products found in the first 5 search results');
});

When('User records the product price from product detail', async () => {
  orderData.productPrice = await productDetailPage.getProductPriceValue();
  const priceText = await productDetailPage.getProductPriceText();
  console.info(`Product price captured: ${priceText} (${orderData.productPrice})`);
});

When('User adds the product to cart', async () => {
  await productDetailPage.addToCart();
});

When('User navigates to cart', async () => {
  await cartPage.navigateToCart();
});

When('User selects "Reguler" as order type', async () => {
  await cartPage.selectXpressDelivery();
  await cartPage.selectRegularOrderType();
});
