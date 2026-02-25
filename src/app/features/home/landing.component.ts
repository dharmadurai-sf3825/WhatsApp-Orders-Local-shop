import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Shop } from '../../core/models/shop.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    FormsModule
  ],
  template: `
    <div class="landing-container">
      <mat-card class="landing-card">
        <mat-card-header>
          <mat-card-title>
            🛒 Select Your Shop
          </mat-card-title>
          <mat-card-subtitle>
            Choose a shop to view products and place orders
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="isLoadingShops" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading available shops...</p>
          </div>

          <div *ngIf="!isLoadingShops">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Select a Shop</mat-label>
              <mat-select [(value)]="selectedShop" [compareWith]="compareShops">
                <mat-optgroup label="Available Shops" *ngIf="shops.length > 0">
                  <mat-option *ngFor="let shop of shops" [value]="shop">
                    <div class="shop-option">
                      <strong>{{ shop.name }}</strong>
                      <span class="shop-slug">({{ shop.slug }})</span>
                    </div>
                  </mat-option>
                </mat-optgroup>
              </mat-select>
              <mat-hint *ngIf="shops.length === 0" class="no-shops">
                No shops available
              </mat-hint>
            </mat-form-field>

            <small class="hint-text" *ngIf="shops.length > 0">
              💡 Select a shop from the dropdown to browse products
            </small>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="navigateToShop()"
            [disabled]="!selectedShop || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!isLoading">Continue Shopping</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .landing-card {
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      font-size: 24px !important;
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      font-size: 14px !important;
      color: rgba(0, 0, 0, 0.6) !important;
    }

    .full-width {
      width: 100%;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 40px 20px;
    }

    .loading-container p {
      color: #666;
      margin: 0;
    }

    .shop-option {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 0;
    }

    .shop-slug {
      font-size: 12px;
      color: #999;
      font-weight: normal;
    }

    .hint-text {
      display: block;
      margin-top: 12px;
      color: #666;
      font-size: 12px;
    }

    .no-shops {
      color: #f44336 !important;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
      gap: 8px;
    }

    button {
      min-width: 150px;
    }

    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      margin-right: 8px;
    }

    ::ng-deep .mat-mdc-select-trigger {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  shops: Shop[] = [];
  selectedShop: Shop | null = null;
  isLoading: boolean = false;
  isLoadingShops: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    console.log('🏠 Landing Component Initialized');
    this.loadShops();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all active shops from Firestore
   */
  async loadShops(): Promise<void> {
    console.log('📥 Loading shops from Firestore...');
    this.isLoadingShops = true;

    try {
      // First try to load from shops collection
      const shopsRef = collection(this.firestore, 'shops');
      const q = query(shopsRef, where('isActive', '==', true));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log('✅ Found shops in shops collection');
        const shopsData: Shop[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          shopsData.push({
            id: data['id'] || doc.id,
            slug: data['slug'] || '',
            name: data['name'] || '',
            address: data['address'] || '',
            phoneE164: data['phoneE164'] || '',
            gstNo: data['gstNo'],
            upiId: data['upiId'],
            razorpayKeyId: data['razorpayKeyId'],
            isActive: data['isActive'] || false,
            theme: data['theme'],
            ownerId: data['ownerId'],
            createdAt: data['createdAt'],
            updatedAt: data['updatedAt']
          } as Shop);
        });

        console.log('✅ Loaded shops from Firestore:', shopsData.length);
        this.shops = shopsData.sort((a, b) => a.name.localeCompare(b.name));
        return;
      }

      // Fallback: Load from shop_ownership collection (get unique shops)
      console.warn('⚠️ No shops found in shops collection, trying shop_ownership...');
      const ownershipRef = collection(this.firestore, 'shop_ownership');
      const ownershipQuery = query(ownershipRef, where('status', '==', 'active'));
      const ownershipSnapshot = await getDocs(ownershipQuery);

      if (!ownershipSnapshot.empty) {
        console.log('✅ Found shops in shop_ownership collection');
        const shopsMap = new Map<string, Shop>();

        ownershipSnapshot.forEach(doc => {
          const data = doc.data();
          const slug = data['shopSlug'];
          
          // Create unique Shop entry for each unique shopSlug
          if (!shopsMap.has(slug)) {
            shopsMap.set(slug, {
              id: slug,
              slug: slug,
              name: data['shopName'] || slug,
              address: '',
              phoneE164: data['phoneE164'] || '',
              isActive: data['status'] === 'active',
              ownerId: data['userId'],
              createdAt: data['createdAt'],
              updatedAt: data['createdAt']
            } as Shop);
          }
        });

        const shopsData = Array.from(shopsMap.values());
        console.log('✅ Loaded shops from shop_ownership:', shopsData.length);
        this.shops = shopsData.sort((a, b) => a.name.localeCompare(b.name));
        return;
      }

      console.warn('⚠️ No active shops found in either collection');
      this.shops = [];
    } catch (error) {
      console.error('❌ Error loading shops from Firestore:', error);
      this.shops = [];
    } finally {
      this.isLoadingShops = false;
    }
  }

  /**
   * Compare function for mat-select
   */
  compareShops(a: Shop | null, b: Shop | null): boolean {
    return a && b ? a.slug === b.slug : a === b;
  }

  /**
   * Navigate to selected shop
   */
  navigateToShop() {
    if (this.selectedShop && this.selectedShop.slug) {
      console.log('🛍️ Navigating to shop:', this.selectedShop.name, this.selectedShop.slug);
      this.isLoading = true;
      this.router.navigate([`/${this.selectedShop.slug}/home`]);
    }
  }
}
