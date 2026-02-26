import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sellers-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sellers-management-container">
      <h1>Sellers Management</h1>
      <div class="filters-section">
        <input type="search" placeholder="Search sellers by name or email..." class="search-input" />
        <select class="filter-select">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending Approval</option>
          <option>Suspended</option>
        </select>
      </div>
      <table class="sellers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Shop</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="empty-message">No sellers found</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .sellers-management-container {
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
    .sellers-table {
      width: 100%;
      border-collapse: collapse;
    }
    .sellers-table th, .sellers-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .sellers-table th {
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
export class SellersManagementComponent {}
