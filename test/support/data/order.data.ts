/**
 * Shared order state captured during the test run.
 * Used to verify the price calculation at the end of the flow.
 */
class OrderData {
  productName = '';
  productPrice = 0;   // captured from product detail page
  shippingFee = 0;    // captured from checkout/order review page
  insuranceFee = 0;   // captured from checkout/order review page
  displayedTotal = 0; // captured from order success / payment confirmation page

  reset(): void {
    this.productName = '';
    this.productPrice = 0;
    this.shippingFee = 0;
    this.insuranceFee = 0;
    this.displayedTotal = 0;
  }

  summary(): string {
    return (
      `Order Summary:\n` +
      `  Product : ${this.productName}\n` +
      `  Price   : Rp${this.productPrice.toLocaleString('id-ID')}\n` +
      `  Shipping: Rp${this.shippingFee.toLocaleString('id-ID')}\n` +
      `  Insurance: Rp${this.insuranceFee.toLocaleString('id-ID')}\n` +
      `  Total   : Rp${this.displayedTotal.toLocaleString('id-ID')}`
    );
  }
}

export default new OrderData();
