import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="products-container">
      <h1>Products</h1>
      <div class="filters-section">
        <h3>Filters</h3>
        <p>Filter options will be available here</p>
      </div>
      <div class="products-grid">
        <p>Products will be displayed here in a grid</p>
        <p class="placeholder">Loading products...</p>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 2rem;
    }
    .filters-section {
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }
    .placeholder {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #95a5a6;
    }
  `]
})
export class ProductsComponent {}
