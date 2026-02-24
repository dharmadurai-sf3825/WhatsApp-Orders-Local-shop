import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageService } from '../../../core/services/language.service';
import { ShopService } from '../../../core/services/shop.service';
import { SellerHeaderComponent } from '../components/seller-header.component';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SellerHeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  language = 'ta';
  currentShop: Shop | null = null;

  constructor(
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

    // Get shop slug from route params and load shop
    this.route.paramMap.subscribe(params => {
      const shopSlug = params.get('shopSlug');
      if (shopSlug) {
        console.log('Dashboard: Loading shop', shopSlug);
        this.shopService.initializeShop(shopSlug);
      }
    });

    // Subscribe to shop changes
    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
      console.log('Dashboard: Current shop', shop?.name || 'None');
    });
  }

  navigateTo(path: string) {
    // Get shopSlug from current route
    this.route.paramMap.subscribe(params => {
      const shopSlug = params.get('shopSlug');
      if (shopSlug) {
        // path is like '/seller/products', extract 'products'
        const page = path.split('/').pop() || '';
        this.router.navigate(['/seller', shopSlug, page]);
      } else {
        this.router.navigate([path]);
      }
    }).unsubscribe();
  }

  goBack() {
    // Get shopSlug from current route
    this.route.paramMap.subscribe(params => {
      const shopSlug = params.get('shopSlug');
      if (shopSlug) {
        this.router.navigate(['/', shopSlug, 'home']);
      } else {
        this.router.navigate(['/seller/login']);
      }
    }).unsubscribe();
  }
}

