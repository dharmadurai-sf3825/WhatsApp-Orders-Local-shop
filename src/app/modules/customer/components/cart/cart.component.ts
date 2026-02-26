import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      <div class="cart-items">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="empty-message">Your cart is empty</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cart-summary">
        <h3>Cart Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹0.00</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>₹0.00</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>₹0.00</span>
        </div>
        <button routerLink="../checkout" class="btn-checkout" disabled>Proceed to Checkout</button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 2rem;
    }
    .cart-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    .cart-table th, .cart-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .cart-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .empty-message {
      text-align: center;
      color: #95a5a6;
      padding: 2rem !important;
    }
    .cart-summary {
      max-width: 300px;
      margin-left: auto;
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ddd;
    }
    .summary-row.total {
      font-weight: bold;
      font-size: 1.1rem;
      border-bottom: none;
      padding-top: 1rem;
    }
    .btn-checkout {
      width: 100%;
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
      font-weight: bold;
    }
    .btn-checkout:hover:not(:disabled) {
      background-color: #229954;
    }
    .btn-checkout:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
  `]
})
export class CartComponent {}
