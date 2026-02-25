import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageService } from '../../../core/services/language.service';
import { GlobalStateService, GlobalState } from '../../../core/services/global-state.service';
import { SellerHeaderComponent } from '../components/seller-header.component';
import { Shop } from '../../../core/models/shop.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class DashboardComponent implements OnInit, OnDestroy {
  language = 'ta';
  currentShop: Shop | null = null;
  globalState: GlobalState | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private globalStateService: GlobalStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.language = lang;
      });

    // Get shop slug from route params and load from global state or load it if not already loaded
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(async params => {
        const shopSlug = params.get('shopSlug');
        if (shopSlug) {
          console.log('📊 Dashboard: Route has shopSlug:', shopSlug);
          
          // Get current shop from global state
          const currentGlobalShop = this.globalStateService.getCurrentShop();
          
          // If shop is not loaded or doesn't match, load it
          if (!currentGlobalShop || currentGlobalShop.slug !== shopSlug) {
            console.log('📥 Dashboard: Loading shop from global state or Firebase');
            try {
              await this.globalStateService.loadShop(shopSlug);
            } catch (error) {
              console.error('❌ Failed to load shop:', error);
            }
          }
        }
      });

    // Subscribe to global state - this is the single source of truth
    this.globalStateService.globalState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.globalState = state;
        this.currentShop = state.currentShop;
        console.log('🌍 Dashboard: Global state updated - Shop:', state.currentShop?.name || 'None');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(path: string) {
    // Get shopSlug from global state or route
    const shopSlug = this.currentShop?.slug || this.route.snapshot.paramMap.get('shopSlug');
    if (shopSlug) {
      // path is like '/seller/products', extract 'products'
      const page = path.split('/').pop() || '';
      this.router.navigate(['/seller', shopSlug, page]);
    } else {
      this.router.navigate([path]);
    }
  }

  goBack() {
    // Get shopSlug from global state or route
    const shopSlug = this.currentShop?.slug || this.route.snapshot.paramMap.get('shopSlug');
    if (shopSlug) {
      this.router.navigate(['/', shopSlug, 'home']);
    } else {
      this.router.navigate(['/seller/login']);
    }
  }
}

