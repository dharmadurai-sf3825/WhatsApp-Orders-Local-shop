import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Shop } from '../models/shop.model';
import { SellerUser } from '../models/user.model';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { Auth } from '@angular/fire/auth';

export interface GlobalState {
  currentUser: SellerUser | null;
  currentShop: Shop | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private auth = inject(Auth);
  private authService = inject(AuthService);
  private firebaseService = inject(FirebaseService);

  // Global state subjects
  private currentUserSubject = new BehaviorSubject<SellerUser | null>(null);
  private currentShopSubject = new BehaviorSubject<Shop | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  public currentShop$ = this.currentShopSubject.asObservable().pipe(distinctUntilChanged());
  public isLoading$ = this.isLoadingSubject.asObservable().pipe(distinctUntilChanged());
  public error$ = this.errorSubject.asObservable().pipe(distinctUntilChanged());

  // Combined state observable
  public globalState$: Observable<GlobalState> = combineLatest([
    this.currentUser$,
    this.currentShop$,
    this.isLoading$,
    this.error$
  ]).pipe(
    map(([user, shop, loading, error]) => ({
      currentUser: user,
      currentShop: shop,
      isLoading: loading,
      error
    })),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  );

  constructor() {
    console.log('🌍 GlobalStateService initialized');
  }

  /**
   * Initialize state after user login
   * Load current user and their shop
   */
  async initializeUserState(shopSlug?: string): Promise<void> {
    console.log('🔄 Initializing user state for shop:', shopSlug);
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const authUser = this.auth.currentUser;
      
      if (!authUser) {
        console.error('❌ No authenticated user');
        this.errorSubject.next('No authenticated user');
        this.isLoadingSubject.next(false);
        return;
      }

      // Create seller user object
      const sellerUser: SellerUser = {
        uid: authUser.uid,
        email: authUser.email || '',
        displayName: authUser.displayName || '',
        shopIds: [],
        createdAt: new Date(),
        lastLogin: new Date()
      };

      this.currentUserSubject.next(sellerUser);
      console.log('✅ User loaded:', sellerUser.email);

      // Load shop if slug provided
      if (shopSlug) {
        await this.loadShop(shopSlug);
      }

    } catch (error: any) {
      console.error('❌ Error initializing user state:', error);
      this.errorSubject.next(error.message || 'Failed to initialize user state');
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Load shop by slug and verify ownership
   */
  async loadShop(shopSlug: string): Promise<void> {
    console.log('📦 Loading shop:', shopSlug);
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const authUser = this.auth.currentUser;
      
      if (!authUser) {
        throw new Error('No authenticated user');
      }

      // Verify user has access to this shop
      const hasAccess = await this.authService.canAccessShop(shopSlug);
      if (!hasAccess) {
        throw new Error(`User doesn't have access to shop: ${shopSlug}`);
      }

      // Load shop details
      const shop = await new Promise<Shop | null>((resolve, reject) => {
        this.firebaseService.getShopBySlug(shopSlug).subscribe({
          next: (shop) => resolve(shop),
          error: (err) => reject(err)
        });
      });

      if (!shop) {
        throw new Error(`Shop not found: ${shopSlug}`);
      }

      this.currentShopSubject.next(shop);
      console.log('✅ Shop loaded:', shop.name);

    } catch (error: any) {
      console.error('❌ Error loading shop:', error);
      this.errorSubject.next(error.message || 'Failed to load shop');
      throw error;
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Load all shops for the user
   */
  async loadUserShops(): Promise<string[]> {
    console.log('📋 Loading user shops');
    
    try {
      const shops = await this.authService.getUserShops();
      console.log('✅ Shops loaded:', shops);
      return shops;
    } catch (error: any) {
      console.error('❌ Error loading shops:', error);
      this.errorSubject.next(error.message || 'Failed to load shops');
      throw error;
    }
  }

  /**
   * Update current shop
   */
  setCurrentShop(shop: Shop | null): void {
    console.log('🔄 Setting current shop:', shop?.name || 'null');
    this.currentShopSubject.next(shop);
  }

  /**
   * Update current user
   */
  setCurrentUser(user: SellerUser | null): void {
    console.log('🔄 Setting current user:', user?.email || 'null');
    this.currentUserSubject.next(user);
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): SellerUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current shop synchronously
   */
  getCurrentShop(): Shop | null {
    return this.currentShopSubject.value;
  }

  /**
   * Get current state synchronously
   */
  getCurrentState(): GlobalState {
    return {
      currentUser: this.currentUserSubject.value,
      currentShop: this.currentShopSubject.value,
      isLoading: this.isLoadingSubject.value,
      error: this.errorSubject.value
    };
  }

  /**
   * Clear all state (on logout)
   */
  clearState(): void {
    console.log('🧹 Clearing global state');
    this.currentUserSubject.next(null);
    this.currentShopSubject.next(null);
    this.isLoadingSubject.next(false);
    this.errorSubject.next(null);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }
}
