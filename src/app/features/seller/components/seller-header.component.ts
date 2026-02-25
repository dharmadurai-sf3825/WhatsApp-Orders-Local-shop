import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Auth, signOut, User } from '@angular/fire/auth';
import { LanguageService } from '../../../core/services/language.service';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { Shop } from '../../../core/models/shop.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class SellerHeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentShop: Shop | null = null;
  language = 'en';

  private destroy$ = new Subject<void>();

  constructor(
    private auth: Auth,
    private router: Router,
    private languageService: LanguageService,
    private globalStateService: GlobalStateService
  ) {}

  ngOnInit() {
    // Listen to auth state
    this.auth.onAuthStateChanged(user => {
      this.currentUser = user;
    });

    // Subscribe to global shop state instead of ShopService
    this.globalStateService.currentShop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(shop => {
        this.currentShop = shop;
      });

    // Subscribe to language changes
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.language = lang;
      });

    this.language = this.languageService.getCurrentLanguage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async logout() {
    try {
      console.log('🔓 Seller logging out...');
      await signOut(this.auth);
      console.log('✅ Logout successful');
      
      // Clear global state
      this.globalStateService.clearState();
      
      // Redirect to seller login page (NOT landing page)
      this.router.navigate(['/seller/login']);
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  goToDashboard() {
    if (this.currentShop) {
      this.router.navigate(['/seller', this.currentShop.slug, 'dashboard']);
    }
  }

  goToProducts() {
    if (this.currentShop) {
      this.router.navigate(['/seller', this.currentShop.slug, 'products']);
    }
  }

  goToOrders() {
    if (this.currentShop) {
      this.router.navigate(['/seller', this.currentShop.slug, 'orders']);
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

