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
  template: `
    <mat-toolbar color="primary" class="seller-header">
      <div class="header-content">
        <div class="left-section">
          <button mat-icon-button (click)="goToDashboard()">
            <mat-icon>dashboard</mat-icon>
          </button>
          <span class="shop-name" *ngIf="currentShop">{{ currentShop.name }}</span>
        </div>

        <div class="right-section">
          <span class="user-email" *ngIf="currentUser">{{ currentUser.email }}</span>
          
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="goToDashboard()">
              <mat-icon>dashboard</mat-icon>
              <span>{{ language === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard' }}</span>
            </button>
            
            <button mat-menu-item (click)="goToProducts()">
              <mat-icon>inventory_2</mat-icon>
              <span>{{ language === 'ta' ? 'தயாரிப்புகள்' : 'Products' }}</span>
            </button>
            
            <button mat-menu-item (click)="goToOrders()">
              <mat-icon>receipt_long</mat-icon>
              <span>{{ language === 'ta' ? 'ஆர்டர்கள்' : 'Orders' }}</span>
            </button>
            
            <mat-divider></mat-divider>
            
            <button mat-menu-item (click)="goToCustomerSite()">
              <mat-icon>store</mat-icon>
              <span>{{ language === 'ta' ? 'வாடிக்கையாளர் தளம்' : 'Customer Site' }}</span>
            </button>
            
            <button mat-menu-item (click)="toggleLanguage()">
              <mat-icon>language</mat-icon>
              <span>{{ language === 'ta' ? 'English' : 'தமிழ்' }}</span>
            </button>
            
            <mat-divider></mat-divider>
            
            <button mat-menu-item (click)="logout()" class="logout-button">
              <mat-icon>logout</mat-icon>
              <span>{{ language === 'ta' ? 'வெளியேறு' : 'Logout' }}</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .seller-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 16px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .shop-name {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-email {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .logout-button {
      color: #f44336;
    }

    .logout-button mat-icon {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .user-email {
        display: none;
      }
      
      .shop-name {
        font-size: 1rem;
      }
    }
  `]
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
