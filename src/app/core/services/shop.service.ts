import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shop } from '../models/shop.model';
import { FirebaseService } from './firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private currentShopSubject = new BehaviorSubject<Shop | null>(null);
  public currentShop$ = this.currentShopSubject.asObservable();

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  /**
   * Initialize shop based on URL
   * Supports multiple URL patterns:
   * - Query param: ?shop=ganesh-bakery
   * - Path: /ganesh-bakery
   * - Subdomain: ganesh-bakery.yourapp.com
   */
  initializeShop(shopSlug?: string): void {
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
    this.firebaseService.getShopBySlug(shopSlug).subscribe({
      next: (shop) => {
        if (shop && shop.isActive) {
          this.currentShopSubject.next(shop);
          this.applyShopTheme(shop);
        } else {
          console.error('Shop not found or inactive:', shopSlug);
          this.handleInvalidShop();
        }
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        this.handleInvalidShop();
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
    return segments[0] || null;
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
    // Option 1: Redirect to shop selection page
    // this.router.navigate(['/select-shop']);
    
    // Option 2: Show error message
    // this.router.navigate(['/error'], { queryParams: { message: 'No shop specified' }});
    
    // For now, load a default demo shop
    console.warn('No shop specified, loading default demo shop');
    this.loadShop('demo-shop');
  }

  /**
   * Handle invalid or inactive shop
   */
  private handleInvalidShop(): void {
    // this.router.navigate(['/error'], { queryParams: { message: 'Shop not found' }});
    console.error('Invalid shop, loading default demo shop');
    this.loadShop('demo-shop');
  }
}
