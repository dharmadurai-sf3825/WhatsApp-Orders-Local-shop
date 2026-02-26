import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="products-management-container">
      <div class="header">
        <h1>Products Management</h1>
        <button class="btn-add">+ Add New Product</button>
      </div>
      <div class="filters-section">
        <input type="search" placeholder="Search products..." class="search-input" />
        <select class="filter-select">
          <option>All Categories</option>
          <option>Category 1</option>
          <option>Category 2</option>
        </select>
      </div>
      <table class="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="empty-message">No products found. Create your first product.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .products-management-container {
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .btn-add {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-add:hover {
      background-color: #229954;
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
    .products-table {
      width: 100%;
      border-collapse: collapse;
    }
    .products-table th, .products-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .products-table th {
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
export class ProductsManagementComponent {}
