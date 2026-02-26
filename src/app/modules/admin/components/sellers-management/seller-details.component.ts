import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="seller-details-container">
      <button routerLink="../sellers" class="btn-back">← Back to Sellers</button>
      <h1>Seller Account Details</h1>
      <div class="details-content">
        <div class="seller-info">
          <h2>Account Information</h2>
          <p><strong>Name:</strong> Seller Name</p>
          <p><strong>Email:</strong> seller&#64;example.com</p>
          <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
          <p><strong>Shop:</strong> Shop Name</p>
          <p><strong>Registration Date:</strong> 2024-01-15</p>
          <p><strong>Status:</strong> Active</p>
        </div>
        <div class="seller-actions">
          <h2>Account Actions</h2>
          <button class="btn-action btn-approve">✓ Approve</button>
          <button class="btn-action btn-suspend">⊗ Suspend</button>
          <button class="btn-action btn-reset">↻ Reset Password</button>
          <button class="btn-action btn-view">👁 View Analytics</button>
        </div>
      </div>
      <div class="seller-permissions">
        <h2>Permissions</h2>
        <div class="permissions-list">
          <label class="permission-item">
            <input type="checkbox" checked />
            Manage Products
          </label>
          <label class="permission-item">
            <input type="checkbox" checked />
            Manage Orders
          </label>
          <label class="permission-item">
            <input type="checkbox" checked />
            View Analytics
          </label>
          <label class="permission-item">
            <input type="checkbox" />
            Access Reports
          </label>
        </div>
        <button class="btn-save-permissions">Save Permissions</button>
      </div>
    </div>
  `,
  styles: [`
    .seller-details-container {
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
    .seller-info, .seller-actions {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .btn-action {
      display: block;
      width: 100%;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }
    .btn-approve { background-color: #27ae60; color: white; }
    .btn-approve:hover { background-color: #229954; }
    .btn-suspend { background-color: #e74c3c; color: white; }
    .btn-suspend:hover { background-color: #c0392b; }
    .btn-reset { background-color: #3498db; color: white; }
    .btn-reset:hover { background-color: #2980b9; }
    .btn-view { background-color: #9b59b6; color: white; }
    .btn-view:hover { background-color: #8e44ad; }
    .seller-permissions {
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px;
      margin-top: 2rem;
    }
    .permissions-list {
      margin: 1rem 0;
    }
    .permission-item {
      display: block;
      padding: 0.5rem 0;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    .permission-item input {
      margin-right: 0.5rem;
    }
    .btn-save-permissions {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 1rem;
    }
    .btn-save-permissions:hover {
      background-color: #229954;
    }
  `]
})
export class SellerDetailsComponent {}
