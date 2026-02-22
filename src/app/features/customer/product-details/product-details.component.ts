import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { FirebaseService } from '../../../core/services/firebase.service';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../core/models/product.model';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule
  ],
  template: `
    <div class="product-details-container" *ngIf="product">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ language === 'ta' ? 'பொருள் விவரங்கள்' : 'Product Details' }}</h1>
      </div>

      <mat-card class="product-card">
        <div class="product-image" 
             [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : 'none'">
          <span class="badge out-of-stock" *ngIf="!product.inStock">
            {{ language === 'ta' ? 'கையிருப்பு இல்லை' : 'Out of Stock' }}
          </span>
          <span class="badge in-stock" *ngIf="product.inStock">
            {{ language === 'ta' ? 'கையிருப்பில் உள்ளது' : 'In Stock' }}
          </span>
        </div>

        <mat-card-content>
          <div class="product-info">
            <h2>{{ language === 'ta' && product.nameTA ? product.nameTA : product.name }}</h2>
            <p class="category">
              {{ language === 'ta' && product.categoryTA ? product.categoryTA : product.category }}
            </p>
            <p class="price">₹{{ product.price }} / {{ language === 'ta' && product.unitTA ? product.unitTA : product.unit }}</p>
            
            <p class="description" *ngIf="product.description || product.descriptionTA">
              {{ language === 'ta' && product.descriptionTA ? product.descriptionTA : product.description }}
            </p>

            <!-- Quantity Selector -->
            <div class="quantity-selector">
              <label>{{ language === 'ta' ? 'அளவு' : 'Quantity' }}:</label>
              <div class="quantity-controls">
                <button mat-icon-button (click)="decrementQuantity()" [disabled]="quantity <= 1">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="quantity-display">{{ quantity }}</span>
                <button mat-icon-button (click)="incrementQuantity()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>

            <p class="subtotal">
              {{ language === 'ta' ? 'மொத்தம்' : 'Subtotal' }}: 
              <strong>₹{{ product.price * quantity }}</strong>
            </p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button 
                  color="primary" 
                  class="add-to-cart-btn"
                  [disabled]="!product.inStock"
                  (click)="addToCart()">
            <mat-icon>add_shopping_cart</mat-icon>
            {{ language === 'ta' ? 'கூடையில் சேர்' : 'Add to Cart' }}
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Cart FAB -->
      <button mat-fab class="cart-fab whatsapp-btn" 
              *ngIf="cartCount > 0"
              (click)="navigateToCart()">
        <mat-icon [matBadge]="cartCount" matBadgeColor="warn">shopping_cart</mat-icon>
      </button>
    </div>

    <div class="loading-container" *ngIf="!product">
      <p>{{ language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...' }}</p>
    </div>
  `,
  styles: [`
    .product-details-container {
      padding: 20px;
      max-width: 800px;
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

    .product-card {
      overflow: hidden;
    }

    .product-image {
      height: 400px;
      background-color: #f0f0f0;
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image:not([style*="url"]):before {
      content: "📦";
      font-size: 120px;
    }

    .badge {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }

    .badge.in-stock {
      background: var(--whatsapp-green);
      color: white;
    }

    .badge.out-of-stock {
      background: #f44336;
      color: white;
    }

    .product-info {
      padding: 20px;
    }

    .product-info h2 {
      margin: 0 0 10px 0;
      font-size: 1.8rem;
      color: #333;
    }

    .category {
      font-size: 0.9rem;
      color: #999;
      margin: 5px 0;
    }

    .price {
      font-size: 1.5rem;
      color: var(--whatsapp-green);
      font-weight: 600;
      margin: 15px 0;
    }

    .description {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin: 20px 0;
    }

    .quantity-selector {
      margin: 30px 0;
    }

    .quantity-selector label {
      display: block;
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 10px;
      color: #333;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .quantity-display {
      font-size: 1.5rem;
      font-weight: 600;
      min-width: 40px;
      text-align: center;
    }

    .subtotal {
      font-size: 1.2rem;
      color: #333;
      margin: 20px 0;
    }

    .subtotal strong {
      color: var(--whatsapp-green);
    }

    mat-card-actions {
      padding: 20px;
    }

    .add-to-cart-btn {
      width: 100%;
      height: 50px;
      font-size: 1.1rem;
    }

    .cart-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
      font-size: 1.2rem;
      color: #999;
    }

    @media (max-width: 768px) {
      .product-details-container {
        padding: 10px;
      }

      .product-image {
        height: 300px;
      }

      .product-info h2 {
        font-size: 1.4rem;
      }

      .price {
        font-size: 1.3rem;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  cartCount = 0;
  language = 'ta';
  currentShop: Shop | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private languageService: LanguageService,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get current shop
    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
    });

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  loadProduct(productId: string) {
    this.firebaseService.getProductById(productId).subscribe(product => {
      this.product = product;
    });
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product && this.currentShop) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate([this.currentShop.slug, 'cart']);
    }
  }

  navigateToCart() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'cart']);
    }
  }

  goBack() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'products']);
    }
  }
}
