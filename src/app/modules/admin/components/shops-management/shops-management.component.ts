import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shops-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shops-management-container">
      <h1>Shops Management</h1>
      <div class="filters-section">
        <input type="search" placeholder="Search shops..." class="search-input" />
        <select class="filter-select">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>
      <table class="shops-table">
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Owner</th>
            <th>Products</th>
            <th>Commission Rate</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="empty-message">No shops found</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .shops-management-container {
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
    .shops-table {
      width: 100%;
      border-collapse: collapse;
    }
    .shops-table th, .shops-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .shops-table th {
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
export class ShopsManagementComponent {}
