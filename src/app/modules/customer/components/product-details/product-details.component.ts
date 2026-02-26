import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail-container">
      <h1>Product Details</h1>
      <div class="detail-content">
        <div class="product-image">
          <p>Product image will be displayed here</p>
        </div>
        <div class="product-info">
          <h2>Title</h2>
          <p class="price">Price: ₹0.00</p>
          <p class="description">Product description will be shown here</p>
          <button class="btn-add-cart">Add to Cart</button>
        </div>
      </div>
      <div class="reviews-section">
        <h3>Reviews</h3>
        <p>Customer reviews will appear here</p>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 2rem;
    }
    .detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin: 2rem 0;
    }
    .product-image, .product-info {
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #27ae60;
      margin: 0.5rem 0;
    }
    .btn-add-cart {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
      width: 100%;
    }
    .btn-add-cart:hover {
      background-color: #229954;
    }
    .reviews-section {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
  `]
})
export class ProductDetailsComponent {}
