import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from './core/services/language.service';
import { ShopService } from './core/services/shop.service';
import { Shop } from './core/models/shop.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  currentLang = 'ta';
  shopName: string | null = null;
  currentShop: Shop | null = null;

  constructor(
    private languageService: LanguageService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    // Initialize language
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Subscribe to current shop changes for customer routes
    // 
    // NOTE: Role Separation
    // ✅ Customer routes (/:shopSlug/*): ShopService provides shop via currentShop$
    // ✅ Seller routes (/seller/*): GlobalStateService provides shop via currentShop$
    // ✅ Admin routes (/admin/*): No shop context needed
    // 
    // ShopService is OPTIMIZED to only initialize for customer routes
    // Seller/admin routes skip ShopService entirely (filter in constructor)
    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
      this.shopName = shop?.name || null;
    });
    
    // Trigger initial shop load (for customer routes)
    this.shopService.initializeShop();
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}

