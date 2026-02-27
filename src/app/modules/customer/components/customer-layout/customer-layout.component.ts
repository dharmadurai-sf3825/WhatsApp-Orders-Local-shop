import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../core/services/shop.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="customer-layout">
      <header class="customer-header">
        <!-- Header content will go here -->
        <h1>Customer Store</h1>
      </header>
      <main class="customer-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="customer-footer">
        <!-- Footer content will go here -->
        <p>&copy; 2024 WhatsApp Orders. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .customer-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .customer-header {
      background-color: #f5f5f5;
      padding: 1rem;
      border-bottom: 1px solid #ddd;
    }
    .customer-content {
      flex: 1;
      padding: 2rem;
    }
    .customer-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      border-top: 1px solid #ddd;
      text-align: center;
    }
  `]
})
export class CustomerLayoutComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    // Get shop slug from route parameter and initialize shop
    this.route.paramMap.subscribe(params => {
      const shopSlug = params.get('shopSlug');
      if (shopSlug) {
        console.log('🏪 Customer Layout: Initializing shop:', shopSlug);
        this.shopService.initializeShop(shopSlug);
      }
    });
  }
}
