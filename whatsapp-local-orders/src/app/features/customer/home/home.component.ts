import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';
import { Product } from '../../../core/models/product.model';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <div class="home-container">
      <!-- Shop Header -->
      <div class="shop-header" *ngIf="shop">
        <h1>{{ shop.name }}</h1>
        <p class="address">{{ shop.address }}</p>
      </div>

      <!-- Categories -->
      <div class="categories-section">
        <h2>{{ language === 'ta' ? 'வகைகள்' : 'Categories' }}</h2>
        <div class="categories-grid">
          <div class="category-card" *ngFor="let category of categories" 
               (click)="navigateToProducts(category)">
            <mat-icon>{{ getCategoryIcon(category) }}</mat-icon>
            <span>{{ language === 'ta' && category.nameTA ? category.nameTA : category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Featured Products -->
      <div class="products-section">
        <h2>{{ language === 'ta' ? 'பிரபலமான பொருட்கள்' : 'Popular Items' }}</h2>
        <div class="products-grid">
          <mat-card *ngFor="let product of featuredProducts" class="product-card">
            <div class="product-image" 
                 [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : 'none'">
              <span class="badge" *ngIf="!product.inStock">
                {{ language === 'ta' ? 'கையிருப்பு இல்லை' : 'Out of Stock' }}
              </span>
            </div>
            <mat-card-content>
              <h3>{{ language === 'ta' && product.nameTA ? product.nameTA : product.name }}</h3>
              <p class="price">₹{{ product.price }} / {{ language === 'ta' && product.unitTA ? product.unitTA : product.unit }}</p>
              <p class="description">
                {{ language === 'ta' && product.descriptionTA ? product.descriptionTA : product.description }}
              </p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" 
                      [disabled]="!product.inStock"
                      (click)="addToCart(product)">
                <mat-icon>add_shopping_cart</mat-icon>
                {{ language === 'ta' ? 'கூடையில் சேர்' : 'Add to Cart' }}
              </button>
              <button mat-button (click)="viewProduct(product.id!)">
                {{ language === 'ta' ? 'விவரங்கள்' : 'Details' }}
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- View Cart FAB -->
      <button mat-fab class="cart-fab whatsapp-btn" 
              *ngIf="cartCount > 0"
              (click)="navigateToCart()">
        <mat-icon [matBadge]="cartCount" matBadgeColor="warn">shopping_cart</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .shop-header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, var(--whatsapp-teal), var(--whatsapp-green));
      color: white;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .shop-header h1 {
      margin: 0 0 10px 0;
      font-size: 2rem;
    }

    .shop-header .address {
      margin: 0;
      opacity: 0.9;
    }

    .categories-section,
    .products-section {
      margin-bottom: 40px;
    }

    h2 {
      margin-bottom: 20px;
      color: var(--whatsapp-teal);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .category-card mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      margin-bottom: 10px;
      color: var(--whatsapp-green);
    }

    .category-card span {
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .product-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .product-image {
      height: 200px;
      background-color: #f0f0f0;
      background-size: cover;
      background-position: center;
      border-radius: 8px 8px 0 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image:not([style*="url"]):before {
      content: "📦";
      font-size: 64px;
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
      margin: 10px 0;
      font-size: 1.2rem;
      color: #333;
    }

    .price {
      font-size: 1.1rem;
      color: var(--whatsapp-green);
      font-weight: 600;
      margin: 5px 0;
    }

    .description {
      font-size: 0.9rem;
      color: #666;
      margin: 10px 0;
      line-height: 1.4;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }

    .cart-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 15px;
      }

      .shop-header h1 {
        font-size: 1.5rem;
      }

      .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  shop: Shop | null = null;
  categories: { name: string; nameTA?: string }[] = [];
  featuredProducts: Product[] = [];
  cartCount = 0;
  language = 'ta';

  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.loadShopData();
    this.loadProducts();
    
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  loadShopData() {
    this.firebaseService.getShopById('shop-1').subscribe(shop => {
      this.shop = shop;
    });
  }

  loadProducts() {
    this.firebaseService.getProductsByShopId('shop-1').subscribe(products => {
      this.featuredProducts = products;
      
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

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  navigateToProducts(category?: { name: string; nameTA?: string }) {
    this.router.navigate(['/products'], { 
      queryParams: category ? { category: category.name } : {} 
    });
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  getCategoryIcon(category: { name: string }): string {
    const iconMap: { [key: string]: string } = {
      'Snacks': 'fastfood',
      'Beverages': 'local_cafe',
      'Bakery': 'bakery_dining',
      'Groceries': 'shopping_basket',
      'Dairy': 'emoji_food_beverage',
      'Vegetables': 'spa',
      'Fruits': 'apple'
    };
    return iconMap[category.name] || 'category';
  }
}
