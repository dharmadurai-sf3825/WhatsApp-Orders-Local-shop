import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { CartService } from '../../../../core/services/cart.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ShopService } from '../../../../core/services/shop.service';
import { Product } from '../../../../core/models/product.model';
import { Shop } from '../../../../core/models/shop.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
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
  filteredProducts: Product[] = [];
  cartCount = 0;
  language = 'ta';
  selectedCategory: string | null = null;
  isLoading = true;

  constructor(
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private languageService: LanguageService,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('🏠 Home Component: Initializing');
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get current shop from ShopService
    this.shopService.currentShop$.subscribe(shop => {
      console.log('🏪 Home Component: Got shop from ShopService:', shop?.name);
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
    if (!this.shop) {
      console.warn('⚠️ No shop available, cannot load products');
      this.isLoading = false;
      return;
    }

    console.log('📦 Home Component: Loading products for shop:', this.shop.id);
    this.isLoading = true;

    this.firebaseService.getProductsByShopId(this.shop.id).subscribe({
      next: (products) => {
        console.log('✅ Home Component: Got products:', products.length);
        this.featuredProducts = products;
        this.filteredProducts = products;
        this.isLoading = false;
        
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

        console.log('📊 Categories found:', this.categories.length);
      },
      error: (err) => {
        console.error('❌ Home Component: Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    if (category) {
      this.filteredProducts = this.featuredProducts.filter(p => p.category === category);
    } else {
      this.filteredProducts = this.featuredProducts;
    }
  }

  addToCart(product: Product) {
    console.log('🛒 Adding to cart:', product.name);
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

  isMobile(): boolean {
    return window.innerWidth < 768;
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
