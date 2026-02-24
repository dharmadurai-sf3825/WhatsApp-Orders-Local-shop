import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shop } from '../models/shop.model';
import { FirebaseService } from './firebase.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private currentShopSubject = new BehaviorSubject<Shop | null>(null);
  public currentShop$ = this.currentShopSubject.asObservable();
  // Prevent overlapping loads for same slug
  private loadingShopSlug: string | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    // Listen to route changes to detect shop slug in URL path
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializeShop();
    });
  }

  /**
   * Initialize shop based on URL
   * Supports multiple URL patterns:
   * - Query param: ?shop=ganesh-bakery
   * - Path: /ganesh-bakery
   * - Subdomain: ganesh-bakery.yourapp.com
   */
  initializeShop(shopSlug?: string): void {
    // Skip shop loading entirely for seller routes
    if (this.isSellerRoute()) {
      console.log('Seller route detected, skipping shop initialization');
      return;
    }

    if (!shopSlug) {
      // Try to get from URL
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('shop');
      shopSlug = queryParam || this.getShopFromPath() || this.getShopFromSubdomain() || undefined;
    }

    if (shopSlug) {
      this.loadShop(shopSlug);
    } else {
      console.error('No shop identifier found in URL');
      // Redirect to shop selection or error page
      this.handleNoShop();
    }
  }

  /**
   * Load shop data from Firebase
   */
  private loadShop(shopSlug: string): void {
    // Prevent duplicate/concurrent loads for the same slug
    if (this.loadingShopSlug === shopSlug) {
      console.log('Shop load already in progress for', shopSlug);
      return;
    }
    this.loadingShopSlug = shopSlug;
    console.log('Loading shop:', shopSlug);
    this.firebaseService.getShopBySlug(shopSlug).subscribe({
      next: (shop) => {
        if (shop && shop.isActive) {
          this.currentShopSubject.next(shop);
          this.applyShopTheme(shop);
        } else {
          console.warn('Shop not found or inactive:', shopSlug);
          // Do not navigate away here. Set current shop to null so seller
          // routes (login) can render even when shop data is missing.
          this.currentShopSubject.next(null);
        }
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        // On Firestore/network errors, do not block seller routes.
        this.currentShopSubject.next(null);
      }
    ,
      complete: () => {
        // Clear loading flag when observable completes
        this.loadingShopSlug = null;
        console.log('Finished loading shop:', shopSlug);
      }
    });
  }

  /**
   * Get current shop
   */
  getCurrentShop(): Shop | null {
    return this.currentShopSubject.value;
  }

  /**
   * Get shop slug from URL path
   * Example: /ganesh-bakery/products → ganesh-bakery
   */
  private getShopFromPath(): string | null {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    
    // Exclude known non-shop routes
    const excludedRoutes = ['seller', 'home', 'products', 'product', 'cart', 'admin'];
    const firstSegment = segments[0];
    
    if (firstSegment && !excludedRoutes.includes(firstSegment)) {
      return firstSegment;
    }
    
    return null;
  }

  /**
   * Get shop slug from subdomain
   * Example: ganesh-bakery.yourapp.com → ganesh-bakery
   */
  private getShopFromSubdomain(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // If subdomain exists (more than 2 parts)
    if (parts.length > 2) {
      return parts[0]; // Return subdomain
    }
    
    return null;
  }

  /**
   * Apply shop-specific theme
   */
  private applyShopTheme(shop: Shop): void {
    if (shop.theme?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', shop.theme.primaryColor);
    }
    if (shop.theme?.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', shop.theme.secondaryColor);
    }
    
    // Update page title
    document.title = shop.name;
    
    // Update favicon if logo exists
    if (shop.theme?.logoUrl) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = shop.theme.logoUrl;
      }
    }
  }

  /**
   * Handle case when no shop is specified
   */
  private handleNoShop(): void {
    console.error('No shop specified in URL');
    this.router.navigate(['/error'], { queryParams: { message: 'No shop specified' }});
  }

  /**
   * Handle invalid or inactive shop
   */
  private handleInvalidShop(): void {
    console.error('Shop not found or inactive');
    this.router.navigate(['/error'], { queryParams: { message: 'Shop not found' }});
  }

  /**
   * Check if current route is a seller route
   */
  private isSellerRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/seller');
  }
}
