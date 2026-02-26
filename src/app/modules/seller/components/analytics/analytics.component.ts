import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <h1>Analytics & Reports</h1>
      <div class="date-range-selector">
        <label>Date Range:</label>
        <select class="date-select">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>
      <div class="charts-section">
        <div class="chart-container">
          <h2>Sales Trend</h2>
          <p class="placeholder">Sales chart will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>Top Products</h2>
          <p class="placeholder">Product analytics will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>Customer Metrics</h2>
          <p class="placeholder">Customer data will be displayed here</p>
        </div>
        <div class="chart-container">
          <h2>Revenue Breakdown</h2>
          <p class="placeholder">Revenue chart will be displayed here</p>
        </div>
      </div>
      <button class="btn-export">📥 Export Report</button>
    </div>
  `,
  styles: [`
    .analytics-container {
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
    .btn-export {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 1rem;
    }
    .btn-export:hover {
      background-color: #2980b9;
    }
  `]
})
export class AnalyticsComponent {}
