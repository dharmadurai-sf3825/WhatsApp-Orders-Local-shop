import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <div class="products-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ language === 'ta' ? 'பொருட்கள்' : 'Products' }}</h1>
      </div>

      <!-- Category Filter -->
      <div class="filters" *ngIf="categories.length > 0">
        <mat-chip-set aria-label="Category selection">
          <mat-chip [highlighted]="selectedCategory === null" (click)="filterByCategory(null)">
            {{ language === 'ta' ? 'அனைத்தும்' : 'All' }}
          </mat-chip>
          <mat-chip *ngFor="let category of categories" 
                    [highlighted]="selectedCategory === category.name"
                    (click)="filterByCategory(category.name)">
            {{ language === 'ta' && category.nameTA ? category.nameTA : category.name }}
          </mat-chip>
        </mat-chip-set>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <mat-card *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image" 
               (click)="viewProduct(product.id!)"
               [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : 'none'">
            <span class="badge" *ngIf="!product.inStock">
              {{ language === 'ta' ? 'கையிருப்பு இல்லை' : 'Out of Stock' }}
            </span>
          </div>
          <mat-card-content>
            <h3>{{ language === 'ta' && product.nameTA ? product.nameTA : product.name }}</h3>
            <p class="category">
              {{ language === 'ta' && product.categoryTA ? product.categoryTA : product.category }}
            </p>
            <p class="price">₹{{ product.price }} / {{ language === 'ta' && product.unitTA ? product.unitTA : product.unit }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    [disabled]="!product.inStock"
                    (click)="addToCart(product)">
              <mat-icon>add_shopping_cart</mat-icon>
              {{ language === 'ta' ? 'கூடையில் சேர்' : 'Add' }}
            </button>
            <button mat-button (click)="viewProduct(product.id!)">
              {{ language === 'ta' ? 'பார்' : 'View' }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <p *ngIf="filteredProducts.length === 0" class="no-products">
        {{ language === 'ta' ? 'பொருட்கள் இல்லை' : 'No products found' }}
      </p>

      <!-- Cart FAB -->
      <button mat-fab class="cart-fab whatsapp-btn" 
              *ngIf="cartCount > 0"
              (click)="navigateToCart()">
        <mat-icon [matBadge]="cartCount" matBadgeColor="warn">shopping_cart</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: var(--whatsapp-teal);
    }

    .filters {
      margin-bottom: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .product-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .product-image {
      height: 180px;
      background-color: #f0f0f0;
      background-size: cover;
      background-position: center;
      border-radius: 8px 8px 0 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .product-image:not([style*="url"]):before {
      content: "📦";
      font-size: 56px;
    }

    .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #f44336;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    mat-card-content h3 {
      margin: 10px 0 5px 0;
      font-size: 1.1rem;
      color: #333;
    }

    .category {
      font-size: 0.85rem;
      color: #999;
      margin: 5px 0;
    }

    .price {
      font-size: 1rem;
      color: var(--whatsapp-green);
      font-weight: 600;
      margin: 10px 0;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }

    .no-products {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 1.1rem;
    }

    .cart-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .products-container {
        padding: 15px;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: { name: string; nameTA?: string }[] = [];
  selectedCategory: string | null = null;
  cartCount = 0;
  language = 'ta';

  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.loadProducts();
    
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });

    // Check for category filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filterByCategory(params['category']);
      }
    });
  }

  loadProducts() {
    this.firebaseService.getProductsByShopId('shop-1').subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      
      // Extract unique categories
      const categorySet = new Set<string>();
      products.forEach(product => {
        if (product.category) {
          categorySet.add(product.category);
        }
      });
      
      this.categories = Array.from(categorySet).map(cat => {
        const product = products.find(p => p.category === cat);
        return {
          name: cat,
          nameTA: product?.categoryTA
        };
      });
    });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
    if (category) {
      this.filteredProducts = this.products.filter(p => p.category === category);
    } else {
      this.filteredProducts = this.products;
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
