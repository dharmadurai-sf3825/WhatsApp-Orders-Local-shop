import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <h1>Platform Reports & Analytics</h1>
      <div class="date-range-selector">
        <label>Date Range:</label>
        <select class="date-select">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>
      <div class="reports-grid">
        <div class="report-card">
          <h3>Total Revenue</h3>
          <p class="stat">₹0.00</p>
          <p class="stat-label">All time</p>
        </div>
        <div class="report-card">
          <h3>Total Orders</h3>
          <p class="stat">0</p>
          <p class="stat-label">Platform wide</p>
        </div>
        <div class="report-card">
          <h3>Active Sellers</h3>
          <p class="stat">0</p>
          <p class="stat-label">With active shops</p>
        </div>
        <div class="report-card">
          <h3>Active Shops</h3>
          <p class="stat">0</p>
          <p class="stat-label">Operational</p>
        </div>
      </div>
      <div class="charts-section">
        <div class="chart-container">
          <h2>Revenue Trend</h2>
          <p class="placeholder">Revenue chart will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>Seller Rankings</h2>
          <p class="placeholder">Top sellers list will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>Payment Metrics</h2>
          <p class="placeholder">Payment success rates will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>System Health</h2>
          <p class="placeholder">System metrics will be displayed here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 2rem;
    }
    .date-range-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
    }
    .date-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    .report-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #1a1a1a;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .report-card h3 {
      margin: 0 0 0.5rem 0;
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .stat {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #1a1a1a;
    }
    .stat-label {
      margin: 0.5rem 0 0 0;
      color: #95a5a6;
      font-size: 0.85rem;
    }
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }
    .chart-container {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
      min-height: 300px;
    }
    .placeholder {
      color: #95a5a6;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class ReportsComponent {}
