@Payment @VirtualAccount
Feature: Klik Indomaret - Payment with Virtual Account

  Background:
    Given The Klik Indomaret app is launched

  @Smoke @VirtualAccountPayment
  Scenario: TC-001 - Successful purchase using Virtual Account from login to order success
    When User logs in with valid credentials
    And User searches for "Indomie Goreng"
    And User opens the first available product
    And User records the product price from product detail
    And User adds the product to cart
    And User navigates to cart
    And User selects "Reguler" as order type
    And User taps "Beli" button to proceed to payment
    And User selects "BCA Virtual Account" payment method
    And User records fees from payment summary
    And User taps "Bayar sekarang" to confirm payment
    Then User taps "Lihat Detail" to view order total
    And The total price equals product price plus shipping fee plus insurance fee
