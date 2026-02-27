import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { CartService } from '../../../../core/services/cart.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ShopService } from '../../../../core/services/shop.service';
import { Product } from '../../../../core/models/product.model';
import { Shop } from '../../../../core/models/shop.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: { name: string; nameTA?: string }[] = [];
  selectedCategory: string | null = null;
  cartCount = 0;
  language = 'ta';
  currentShop: Shop | null = null;
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
    console.log('📦 Products Component: Initializing');
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get current shop and load its products
    this.shopService.currentShop$.subscribe(shop => {
      console.log('🏪 Products Component: Got shop from ShopService:', shop?.name);
      this.currentShop = shop;
      if (shop) {
        this.loadProducts();
      }
    });
    
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });

    // Check for category filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('🔍 Products Component: Category filter from params:', params['category']);
        this.selectedCategory = params['category'];
        this.filterByCategory(params['category']);
      }
    });
  }

  loadProducts() {
    if (!this.currentShop) {
      console.warn('⚠️ No shop available, cannot load products');
      this.isLoading = false;
      return;
    }

    console.log('📦 Products Component: Loading products for shop:', this.currentShop.id);
    this.isLoading = true;

    this.firebaseService.getProductsByShopId(this.currentShop.id).subscribe({
      next: (products) => {
        console.log('✅ Products Component: Got products:', products.length);
        this.products = products;
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

        // Apply category filter if one is selected
        if (this.selectedCategory) {
          this.filterByCategory(this.selectedCategory);
        }
      },
      error: (err) => {
        console.error('❌ Products Component: Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
    if (category) {
      console.log('🔍 Filtering by category:', category);
      this.filteredProducts = this.products.filter(p => p.category === category);
    } else {
      this.filteredProducts = this.products;
    }
  }

  addToCart(product: Product) {
    console.log('🛒 Adding to cart:', product.name);
    this.cartService.addToCart(product, 1);
  }

  viewProduct(productId: string) {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'product', productId]);
    }
  }

  navigateToCart() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'cart']);
    }
  }

  goBack() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'home']);
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
