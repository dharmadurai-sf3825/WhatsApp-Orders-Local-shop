import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="shop-details-container">
      <button routerLink="../shops" class="btn-back">← Back to Shops</button>
      <h1>Shop Configuration</h1>
      <div class="details-content">
        <div class="shop-info">
          <h2>Shop Information</h2>
          <p><strong>Name:</strong> Shop Name</p>
          <p><strong>Slug:</strong> shop-slug</p>
          <p><strong>Owner:</strong> Owner Name</p>
          <p><strong>Created Date:</strong> 2024-01-15</p>
          <p><strong>Status:</strong> Active</p>
          <p><strong>Total Orders:</strong> 150</p>
        </div>
        <div class="shop-settings">
          <h2>Settings</h2>
          <div class="setting-item">
            <label>Commission Rate (%)</label>
            <input type="number" value="10" min="0" max="100" class="form-control" />
          </div>
          <div class="setting-item">
            <label>Status</label>
            <select class="form-control">
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
          <button class="btn-save">Save Settings</button>
        </div>
      </div>
      <div class="audit-logs">
        <h2>Audit Logs</h2>
        <p>Recent activities and changes for this shop</p>
      </div>
    </div>
  `,
  styles: [`
    .shop-details-container {
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
    .details-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin: 2rem 0;
    }
    .shop-info, .shop-settings {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .setting-item {
      margin-bottom: 1rem;
    }
    .setting-item label {
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
    }
    .btn-save {
      width: 100%;
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 1rem;
    }
    .btn-save:hover {
      background-color: #229954;
    }
    .audit-logs {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
      margin-top: 2rem;
    }
  `]
})
export class ShopDetailsComponent {}
