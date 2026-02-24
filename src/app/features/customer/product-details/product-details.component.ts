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
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
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

