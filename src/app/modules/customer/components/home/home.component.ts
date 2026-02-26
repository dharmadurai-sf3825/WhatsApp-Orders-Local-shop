import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <h1>Welcome to {{ shopSlug }}</h1>
      <div class="featured-section">
        <h2>Featured Products</h2>
        <p>Featured products will be displayed here</p>
        <button routerLink="../products" class="btn-explore">Explore All Products</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
    }
    .featured-section {
      margin-top: 2rem;
      padding: 2rem;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    .btn-explore {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-explore:hover {
      background-color: #229954;
    }
  `]
})
export class HomeComponent implements OnInit {
  shopSlug: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.shopSlug = params.get('shopSlug') || 'Shop';
    });
  }
}
