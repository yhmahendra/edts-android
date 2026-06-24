import { When, Then } from '@wdio/cucumber-framework';
import { addAttachment } from '@wdio/allure-reporter';
import cartPage from '@pages/cart.page';
import paymentPage from '@pages/payment.page';
import orderData from '@data/order.data';
import { PriceCalculator } from '@support/price-calculator';

When('User taps "Beli" button to proceed to payment', async () => {
  await cartPage.proceedToCheckout();
});

When('User selects "BCA Virtual Account" payment method', async () => {
  const onPaymentPage = await paymentPage.isOnPaymentPage();
  if (!onPaymentPage) {
    throw new Error('Pembayaran page not found after tapping Beli from cart.');
  }
  await paymentPage.selectBcaVirtualAccount();
});

When('User records fees from payment summary', async () => {
  await paymentPage.expandTotalSection();

  const shippingText = await paymentPage.getShippingFeeText();
  const insuranceText = await paymentPage.getInsuranceFeeText();
  const totalText = await paymentPage.getTotalAmountText();

  orderData.shippingFee = await paymentPage.getShippingFeeValue();
  orderData.insuranceFee = await paymentPage.getInsuranceFeeValue();
  orderData.displayedTotal = await paymentPage.getTotalAmountValue();

  console.info(`Shipping fee  : ${shippingText} (${orderData.shippingFee})`);
  console.info(`Insurance fee : ${insuranceText} (${orderData.insuranceFee})`);
  console.info(`Total shown   : ${totalText} (${orderData.displayedTotal})`);

  addAttachment(
    'Fee Breakdown (Payment Page)',
    Buffer.from(
      `Product price : Rp${orderData.productPrice.toLocaleString('id-ID')}\n` +
        `Shipping fee  : ${shippingText}\n` +
        `Insurance fee : ${insuranceText}\n` +
        `Total shown   : ${totalText}`
    ),
    'text/plain'
  );
});

When('User taps "Bayar sekarang" to confirm payment', async () => {
  await paymentPage.tapBayarSekarang();
});

Then('User taps "Lihat Detail" to view order total', async () => {
  await paymentPage.tapLihatDetail();
  console.info('Tapped Lihat Detail on Detail Pembayaran page');
});

Then(
  'The total price equals product price plus shipping fee plus insurance fee',
  async () => {
    const expectedTotal = PriceCalculator.calculateExpectedTotal(
      orderData.productPrice,
      orderData.shippingFee,
      orderData.insuranceFee
    );

    console.info(
      `Price check:\n` +
        `  ${PriceCalculator.format(orderData.productPrice)} (product)\n` +
        `+ ${PriceCalculator.format(orderData.shippingFee)} (shipping)\n` +
        `+ ${PriceCalculator.format(orderData.insuranceFee)} (insurance)\n` +
        `= ${PriceCalculator.format(expectedTotal)} (expected)\n` +
        `  ${PriceCalculator.format(orderData.displayedTotal)} (displayed)`
    );

    addAttachment(
      'Price Calculation',
      Buffer.from(
        `Product price : ${PriceCalculator.format(orderData.productPrice)}\n` +
          `Shipping fee  : ${PriceCalculator.format(orderData.shippingFee)}\n` +
          `Insurance fee : ${PriceCalculator.format(orderData.insuranceFee)}\n` +
          `─────────────────────────────────────────\n` +
          `Expected total: ${PriceCalculator.format(expectedTotal)}\n` +
          `Displayed total:${PriceCalculator.format(orderData.displayedTotal)}\n` +
          `Match: ${expectedTotal === orderData.displayedTotal ? '✓ PASS' : '✗ FAIL'}`
      ),
      'text/plain'
    );

    PriceCalculator.assertTotalsMatch(expectedTotal, orderData.displayedTotal);
  }
);
