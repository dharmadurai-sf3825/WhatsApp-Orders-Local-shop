import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      <div class="checkout-content">
        <div class="checkout-form">
          <h2>Delivery Address</h2>
          <form>
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" class="form-control" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="Enter your phone number" class="form-control" />
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea placeholder="Enter your delivery address" class="form-control" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" placeholder="Enter your city" class="form-control" />
            </div>
            <div class="form-group">
              <label>Postal Code</label>
              <input type="text" placeholder="Enter postal code" class="form-control" />
            </div>
          </form>
        </div>
        <div class="checkout-summary">
          <h2>Order Summary</h2>
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>₹0.00</span>
          </div>
          <div class="summary-item">
            <span>Shipping:</span>
            <span>₹0.00</span>
          </div>
          <div class="summary-item total">
            <span>Total:</span>
            <span>₹0.00</span>
          </div>
          <button class="btn-pay" disabled>Proceed to Payment</button>
          <p class="payment-notice">Payment will be processed via Razorpay</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .checkout-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    .checkout-form, .checkout-summary {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ddd;
    }
    .summary-item.total {
      font-weight: bold;
      font-size: 1.1rem;
      border-bottom: none;
      padding-top: 1rem;
      margin-top: 1rem;
    }
    .btn-pay {
      width: 100%;
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
      font-weight: bold;
      font-size: 1rem;
    }
    .btn-pay:hover:not(:disabled) {
      background-color: #229954;
    }
    .btn-pay:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    .payment-notice {
      font-size: 0.85rem;
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {}
