import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-details-container">
      <button routerLink="../orders" class="btn-back">← Back to Orders</button>
      <h1>Order Details</h1>
      <div class="order-content">
        <div class="order-info">
          <h2>Order Information</h2>
          <p><strong>Order ID:</strong> #12345</p>
          <p><strong>Customer:</strong> John Doe</p>
          <p><strong>Date:</strong> 2024-02-26</p>
          <p><strong>Total:</strong> ₹0.00</p>
        </div>
        <div class="order-status">
          <h2>Fulfillment Status</h2>
          <select class="status-select">
            <option>Pending</option>
            <option>Processing</option>
            <option>Ready</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <button class="btn-update">Update Status</button>
        </div>
      </div>
      <div class="order-items">
        <h2>Order Items</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="empty-message">No items in this order</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .order-details-container {
      padding: 2rem;
    }
    .btn-back {
      background-color: #95a5a6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
    }
    .btn-back:hover {
      background-color: #7f8c8d;
    }
    .order-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin: 2rem 0;
    }
    .order-info, .order-status {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .status-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .btn-update {
      width: 100%;
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-update:hover {
      background-color: #229954;
    }
    .order-items {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    table th, table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    table th {
      background-color: #e0e0e0;
      font-weight: bold;
    }
    .empty-message {
      text-align: center;
      color: #95a5a6;
    }
  `]
})
export class OrderDetailsComponent {}
