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
import { ShopService } from '../../../core/services/shop.service';
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
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
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get current shop from ShopService
    this.shopService.currentShop$.subscribe(shop => {
      this.shop = shop;
      if (shop) {
        this.loadProducts();
      }
    });
    
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  loadProducts() {
    if (!this.shop) return;

    this.firebaseService.getProductsByShopId(this.shop.id).subscribe(products => {
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
    if (this.shop) {
      this.router.navigate([this.shop.slug, 'product', productId]);
    }
  }

  navigateToProducts(category?: { name: string; nameTA?: string }) {
    if (this.shop) {
      this.router.navigate([this.shop.slug, 'products'], { 
        queryParams: category ? { category: category.name } : {} 
      });
    }
  }

  navigateToCart() {
    if (this.shop) {
      this.router.navigate([this.shop.slug, 'cart']);
    }
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

