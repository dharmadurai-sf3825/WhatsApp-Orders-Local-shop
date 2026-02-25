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
    // Listen to route changes BUT filter out non-customer routes
    // This prevents unnecessary ShopService initialization for:
    // - seller/admin routes (where GlobalStateService handles shop loading)
    // - root path / (handled by SmartRootComponent)
    // - landing page (manual shop selection)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => !this.isSellerOrAdminRoute()), // Skip seller/admin routes
      filter(() => !this.isSpecialRoute()) // Skip root, landing, etc.
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
   * 
   * NOTE: This is called ONLY for customer routes (:shopSlug/*)
   * For seller routes, GlobalStateService handles shop loading instead
   */
  initializeShop(shopSlug?: string): void {
    console.log('🏪 ShopService.initializeShop (CUSTOMER ROUTE):', { 
      providedSlug: shopSlug, 
      currentUrl: this.router.url
    });

    // Safety check: skip if somehow called from seller/admin route
    if (this.isSellerOrAdminRoute()) {
      console.log('⚠️ Seller/Admin route detected, ShopService should not initialize. Skipping.');
      return;
    }

    if (!shopSlug) {
      // Try to get from URL - multiple sources
      console.log('📍 Attempting to extract shop slug from URL...');
      
      // 1. Try query parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('shop');
      if (queryParam) {
        shopSlug = queryParam;
        console.log('✅ Found shop in query param:', shopSlug);
      }
      
      // 2. Try path-based extraction
      if (!shopSlug) {
        const pathSlug = this.getShopFromPath();
        if (pathSlug) {
          shopSlug = pathSlug;
          console.log('✅ Found shop in path:', shopSlug);
        }
      }
      
      // 3. Try subdomain extraction
      if (!shopSlug) {
        const subdomainSlug = this.getShopFromSubdomain();
        if (subdomainSlug) {
          shopSlug = subdomainSlug;
          console.log('✅ Found shop in subdomain:', shopSlug);
        }
      }
    }

    if (shopSlug) {
      const trimmedSlug = shopSlug.trim();
      console.log('🔄 Loading shop with slug:', trimmedSlug);
      this.loadShop(trimmedSlug);
    } else {
      console.error('❌ No shop identifier found in URL');
      console.log('📍 URL Details:', {
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hostname: window.location.hostname
      });
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
      console.log('⚠️ Shop load already in progress for', shopSlug);
      return;
    }
    
    this.loadingShopSlug = shopSlug;
    console.log('📥 Loading shop from Firebase:', shopSlug);
    
    this.firebaseService.getShopBySlug(shopSlug).subscribe({
      next: (shop) => {
        console.log('📦 Firebase response:', { shop: shop?.name || 'null', isActive: shop?.isActive });
        
        if (shop && shop.isActive) {
          console.log('✅ Shop loaded and active:', shop.name);
          this.currentShopSubject.next(shop);
          this.applyShopTheme(shop);
        } else {
          console.warn('⚠️ Shop not found or inactive:', shopSlug);
          console.log('   Details:', { foundShop: !!shop, isActive: shop?.isActive });
          // Do not navigate away here. Set current shop to null so seller
          // routes (login) can render even when shop data is missing.
          this.currentShopSubject.next(null);
        }
      },
      error: (error) => {
        console.error('❌ Error loading shop:', error);
        // On Firestore/network errors, do not block seller routes.
        this.currentShopSubject.next(null);
      },
      complete: () => {
        // Clear loading flag when observable completes
        this.loadingShopSlug = null;
        console.log('✅ Finished loading shop:', shopSlug);
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
   * Example: /ganesh-bakery → ganesh-bakery
   */
  private getShopFromPath(): string | null {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    
    console.log('🔍 Analyzing path segments:', { path, segments });
    
    if (segments.length === 0) {
      console.log('⚠️ No path segments found');
      return null;
    }
    
    // Get the first segment
    const firstSegment = segments[0];
    
    // Exclude known non-shop routes
    const excludedRoutes = ['seller', 'home', 'products', 'product', 'cart', 'admin', 'error', 'unauthorized'];
    
    if (excludedRoutes.includes(firstSegment)) {
      console.log('⚠️ First segment is excluded route:', firstSegment);
      
      // Check if second segment could be a shop (for nested paths like /shop/products)
      if (segments.length > 1) {
        const secondSegment = segments[1];
        if (!excludedRoutes.includes(secondSegment) && secondSegment !== '') {
          console.log('✅ Using second segment as shop slug:', secondSegment);
          return secondSegment;
        }
      }
      
      return null;
    }
    
    console.log('✅ Using first segment as shop slug:', firstSegment);
    return firstSegment;
  }

  /**
   * Get shop slug from subdomain
   * Example: ganesh-bakery.yourapp.com → ganesh-bakery
   */
  private getShopFromSubdomain(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    console.log('🔍 Analyzing subdomain:', { hostname, parts });
    
    // If subdomain exists (more than 2 parts)
    if (parts.length > 2) {
      const subdomain = parts[0];
      // Exclude 'www' and other common subdomains
      if (subdomain !== 'www' && subdomain !== 'localhost') {
        console.log('✅ Using subdomain as shop slug:', subdomain);
        return subdomain;
      }
    }
    
    console.log('⚠️ No valid subdomain found');
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
    console.error('❌ No shop specified in URL');
    console.log('💡 Make sure your URL includes one of:');
    console.log('   - Query param: ?shop=revathy-hdb');
    console.log('   - Path: /revathy-hdb');
    console.log('   - Subdomain: revathy-hdb.yourapp.com');
    
    // Only redirect to error if not already on a root/special route
    if (!this.isSpecialRoute() && !this.isSellerRoute()) {
      this.router.navigate(['/error'], { queryParams: { message: 'No shop specified' }});
    }
  }

  /**
   * Check if current route is a seller or admin route
   * Used to skip ShopService initialization for seller/admin routes
   * where GlobalStateService handles shop loading instead
   */
  private isSellerOrAdminRoute(): boolean {
    const currentUrl = this.router.url;
    // Short-circuit: return immediately if seller or admin route
    return currentUrl.includes('/seller') || currentUrl.includes('/admin');
  }

  /**
   * Check if current route is a special route that ShopService should skip
   * - Root path / (handled by SmartRootComponent)
   * - Landing page (manual shop selection)
   * - Error/unauthorized pages
   */
  private isSpecialRoute(): boolean {
    const currentUrl = this.router.url;
    
    // Skip root path (exactly "/")
    if (currentUrl === '/') {
      console.log('⏭️ Skipping ShopService for root path');
      return true;
    }
    
    // Skip landing page
    if (currentUrl === '/landing' || currentUrl.startsWith('/landing?')) {
      console.log('⏭️ Skipping ShopService for landing page');
      return true;
    }
    
    // Skip error/unauthorized pages
    if (currentUrl.includes('/error') || currentUrl.includes('/unauthorized')) {
      console.log('⏭️ Skipping ShopService for error page');
      return true;
    }
    
    return false;
  }

  /**
   * Check if current route is a seller route
   */
  private isSellerRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/seller') || currentUrl.includes('/admin');
  }
}
