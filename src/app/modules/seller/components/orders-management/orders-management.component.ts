import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-management-container">
      <h1>Orders Management</h1>
      <div class="filters-section">
        <input type="search" placeholder="Search orders..." class="search-input" />
        <select class="filter-select">
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="empty-message">No orders found yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .orders-management-container {
      padding: 2rem;
    }
    .filters-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .search-input, .filter-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .search-input {
      flex: 1;
    }
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    .orders-table th, .orders-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .orders-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .empty-message {
      text-align: center;
      color: #95a5a6;
      padding: 2rem !important;
    }
  `]
})
export class OrdersManagementComponent {}
