import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Auth, signOut, User } from '@angular/fire/auth';
import { LanguageService } from '../../../core/services/language.service';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-seller-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './seller-header.component.html',
  styleUrl: './seller-header.component.scss'
})
export class SellerHeaderComponent implements OnInit {
  currentUser: User | null = null;
  currentShop: Shop | null = null;
  language = 'en';

  constructor(
    private auth: Auth,
    private router: Router,
    private languageService: LanguageService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.currentUser = user;
    });

    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
    });

    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });
  }

  async logout() {
    try {
      console.log('🔓 Logging out...');
      await signOut(this.auth);
      console.log('✅ Logout successful');
      
      // Redirect to login page
      const shopSlug = this.currentShop?.slug || 'ganesh-bakery';
      this.router.navigate([shopSlug, 'seller', 'login']);
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  goToDashboard() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'seller', 'dashboard']);
    }
  }

  goToProducts() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'seller', 'products']);
    }
  }

  goToOrders() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'seller', 'orders']);
    }
  }

  goToCustomerSite() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'home']);
    }
  }

  toggleLanguage() {
    const newLang = this.language === 'en' ? 'ta' : 'en';
    this.languageService.setLanguage(newLang);
  }
}

