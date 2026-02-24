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
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../core/models/product.model';
import { Shop } from '../../../core/models/shop.model';

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

    // Get current shop and load its products
    this.shopService.currentShop$.subscribe(shop => {
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
        this.selectedCategory = params['category'];
        this.filterByCategory(params['category']);
      }
    });
  }

  loadProducts() {
    if (!this.currentShop) return;

    this.firebaseService.getProductsByShopId(this.currentShop.id).subscribe(products => {
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
}

