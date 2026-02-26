import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-edit-container">
      <h1>Product Details</h1>
      <form class="product-form">
        <div class="form-group">
          <label>Product Name *</label>
          <input type="text" placeholder="Enter product name" class="form-control" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea placeholder="Enter product description" class="form-control" rows="4"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" placeholder="Enter price" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Cost Price</label>
            <input type="number" placeholder="Enter cost price" class="form-control" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>SKU</label>
            <input type="text" placeholder="Enter SKU" class="form-control" />
          </div>
          <div class="form-group">
            <label>Stock *</label>
            <input type="number" placeholder="Enter stock quantity" class="form-control" required />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-save">Save Product</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-edit-container {
      padding: 2rem;
      max-width: 800px;
    }
    .product-form {
      margin-top: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
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
      font-family: inherit;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn-cancel, .btn-save {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-cancel {
      background-color: #95a5a6;
      color: white;
    }
    .btn-cancel:hover {
      background-color: #7f8c8d;
    }
    .btn-save {
      background-color: #27ae60;
      color: white;
    }
    .btn-save:hover {
      background-color: #229954;
    }
  `]
})
export class ProductEditComponent {}
