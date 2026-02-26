import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Sales</h3>
          <p class="stat-value">₹0.00</p>
          <p class="stat-label">This month</p>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p class="stat-value">0</p>
          <p class="stat-label">Pending fulfillment</p>
        </div>
        <div class="stat-card">
          <h3>Products</h3>
          <p class="stat-value">0</p>
          <p class="stat-label">Active products</p>
        </div>
        <div class="stat-card">
          <h3>Rating</h3>
          <p class="stat-value">0/5</p>
          <p class="stat-label">Customer rating</p>
        </div>
      </div>
      <div class="recent-orders">
        <h2>Recent Orders</h2>
        <p>No orders yet</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    .stat-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #2c3e50;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .stat-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #2c3e50;
    }
    .stat-label {
      margin: 0.5rem 0 0 0;
      color: #95a5a6;
      font-size: 0.85rem;
    }
    .recent-orders {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
  `]
})
export class DashboardComponent {}
