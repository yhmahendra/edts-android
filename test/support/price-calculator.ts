/**
 * Utility for parsing and validating Indonesian Rupiah prices from UI text.
 *
 * Klik Indomaret displays prices in the format "Rp15.000" or "Rp 15.000".
 * Dots (.) are thousands separators; commas (,) are decimal separators.
 */
export class PriceCalculator {
  /**
   * Parses a Rupiah price string to a numeric value.
   *
   * Examples:
   *   "Rp15.000"      → 15000
   *   "Rp 15.000"     → 15000
   *   "Rp15.000,00"   → 15000
   *   "Rp0"           → 0
   */
  static parseRupiah(priceText: string): number {
    if (!priceText) return 0;

    const cleaned = priceText
      .replace(/Rp\.?\s*/gi, '')   // remove "Rp" prefix (with or without dot/space)
      .replace(/\s/g, '')           // remove any whitespace
      .replace(/\./g, '')           // remove dots (thousands separator)
      .replace(/,\d+$/, '')         // remove decimal portion (e.g. ",00")
      .trim();

    const value = parseInt(cleaned, 10);
    return isNaN(value) ? 0 : value;
  }

  /**
   * Calculates the expected total order price.
   *
   * totalPrice = productPrice + shippingFee + insuranceFee
   */
  static calculateExpectedTotal(
    productPrice: number,
    shippingFee: number,
    insuranceFee: number
  ): number {
    return productPrice + shippingFee + insuranceFee;
  }

  /**
   * Asserts that the expected and displayed totals match.
   * Throws a descriptive error if they differ.
   */
  static assertTotalsMatch(expected: number, displayed: number): void {
    const diff = Math.abs(expected - displayed);
    if (diff > 0) {
      throw new Error(
        `Price mismatch!\n` +
          `  Expected total : ${PriceCalculator.format(expected)}\n` +
          `  Displayed total: ${PriceCalculator.format(displayed)}\n` +
          `  Difference     : ${PriceCalculator.format(diff)}`
      );
    }
  }

  /** Formats a number as an Indonesian Rupiah string. */
  static format(amount: number): string {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
}
