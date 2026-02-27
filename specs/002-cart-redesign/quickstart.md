# Phase 1: Quick Start Implementation Guide

**Version**: 1.0  
**Date**: February 27, 2026  
**Target Audience**: Frontend developers implementing the cart redesign  
**Time Estimate**: 6-8 hours (implementation + testing + accessibility audit)

---

## Overview

This guide provides step-by-step instructions to implement the responsive card-based cart layout redesign. The work is divided into logical phases with testing checkpoints.

---

## Prerequisites

- ✓ Node.js 18+ with npm
- ✓ Angular 17+ with `ng` CLI
- ✓ SCSS knowledge (responsive breakpoints, flexbox)
- ✓ TypeScript strict mode understanding
- ✓ Familiarity with existing CartService, ShopService
- ✓ Access to Firebase console (product image URLs)
- ✓ Browser DevTools (Chrome/Firefox for responsive testing)

---

## Implementation Steps

### Phase 1A: Enhance CartItem Model (30 minutes)

**Goal**: Add optional fields for images, inventory, discounts without breaking changes

**File**: `src/core/models/product.model.ts`

1. **Locate the CartItem interface**:
   ```bash
   grep -n "export interface CartItem" src/core/models/product.model.ts
   ```

2. **Add new optional fields**:
   ```typescript
   export interface CartItem {
     // Existing fields (unchanged)
     id: string;
     name: string;
     nameTA?: string;
     price: number;
     quantity: number;
     unit: string;
     unitTA?: string;
     totalPrice: number;
     imageUrl?: string;        // Already exists
     
     // New fields for redesign
     maxQuantity?: number;              // Stock limit
     originalPrice?: number;            // For discount display
     discountPercentage?: number;       // Discount %
   }
   ```

3. **Verify no breaking changes**: 
   - All new fields are optional (`?`)
   - Existing code continues to work
   - Test: `npm run build -- --configuration production`

**✓ Checkpoint**: Build completes with zero errors

---

### Phase 1B: Update CartService Validation (45 minutes)

**Goal**: Add quantity boundary validation in CartService

**File**: `src/core/services/cart.service.ts`

1. **Locate updateQuantity method**:
   ```typescript
   updateQuantity(productId: string, newQuantity: number): void {
     // Find item
     const item = this.cartSubject.value.find(it => it.id === productId);
     if (!item) throw new Error(`Product ${productId} not in cart`);
     
     // NEW: Validate against maxQuantity
     if (item.maxQuantity && newQuantity > item.maxQuantity) {
       throw new Error(
         `Quantity ${newQuantity} exceeds max ${item.maxQuantity}`
       );
     }
     
     // Update
     item.quantity = newQuantity;
     item.totalPrice = item.price * newQuantity;
     this.cartSubject.next([...this.cartSubject.value]);
   }
   ```

2. **Add test**:
   ```typescript
   it('should reject quantity exceeding maxQuantity', () => {
     const item = { id: 'p1', maxQuantity: 5, quantity: 1, ... };
     cartService.addItem(item, 1);
     
     expect(() => cartService.updateQuantity('p1', 6))
       .toThrowError('exceeds max');
   });
   ```

3. **Run tests**:
   ```bash
   npm run test -- --include='**/cart.service.spec.ts'
   ```

**✓ Checkpoint**: Test passes

---

### Phase 1C: Refactor Cart Component Template (60 minutes)

**Goal**: Replace current layout with card-based design respecting responsive breakpoints

**File**: `src/app/features/customer/cart/cart.component.html`

1. **Backup current template**:
   ```bash
   cp src/app/features/customer/cart/cart.component.html cart.component.html.bak
   ```

2. **Replace cart items section** with card layout:

   **Find**: The current items rendering (likely a loop with `*ngFor="let item of cartItems"`)
   
   **Replace with**:
   ```html
   <!-- CART ITEMS: Card-based responsive layout -->
   <div class="cart-items-section">
     <h2 class="section-title">
       {{ language === 'ta' ? 'பொருட்கள்' : 'Items' }} ({{ getTotalItems() }})
     </h2>
     
     <!-- Empty state -->
     <div *ngIf="!cartItems || cartItems.length === 0" class="empty-state">
       <mat-icon class="empty-icon">shopping_cart</mat-icon>
       <h3>{{ language === 'ta' ? 'கூடை காலியாக உள்ளது' : 'Your cart is empty' }}</h3>
       <button mat-raised-button color="primary" (click)="continueShopping()">
         {{ language === 'ta' ? 'ஷாப்பிங் தொடரவும்' : 'Continue Shopping' }}
       </button>
     </div>
     
     <!-- Cart items as cards -->
     <div *ngIf="cartItems && cartItems.length > 0" class="cart-items-list">
       <article class="cart-item-card" 
                 *ngFor="let item of cartItems; let i = index"
                 [attr.aria-label]="'Product: ' + (language === 'ta' && item.nameTA ? item.nameTA : item.name)">
         
         <!-- Product Image -->
         <div class="item-image-container">
           <img [src]="item.imageUrl || '/assets/placeholder-product.svg'"
                [alt]="'Product: ' + (language === 'ta' && item.nameTA ? item.nameTA : item.name)"
                class="item-image"
                loading="lazy"
                onerror="this.src='/assets/placeholder-product.svg'">
         </div>
         
         <!-- Product Details (Left/Center) -->
         <div class="item-info">
           <h3 class="item-name">
             {{ language === 'ta' && item.nameTA ? item.nameTA : item.name }}
           </h3>
           <p class="item-unit">
             {{ language === 'ta' && item.unitTA ? item.unitTA : item.unit }}
           </p>
           
           <!-- Price Info -->
           <div class="price-info">
             <span class="unit-price">
               ₹{{ item.price }} / {{ language === 'ta' && item.unitTA ? item.unitTA : item.unit }}
             </span>
             
             <!-- Discount badge (if applicable) -->
             <span *ngIf="item.discountPercentage" class="discount-badge">
               -{{ item.discountPercentage }}%
             </span>
           </div>
           
           <!-- Original price strikethrough (if discounted) -->
           <p *ngIf="item.originalPrice" class="original-price">
             ₹{{ item.originalPrice }}
           </p>
         </div>
         
         <!-- Quantity Controls (Right side on desktop, wrapped on mobile) -->
         <div class="item-controls">
           <!-- Quantity Section -->
           <div class="quantity-group" role="group" [attr.aria-label]="'Quantity for ' + item.name">
             <label class="quantity-label">Qty</label>
             <div class="quantity-input">
               <button mat-icon-button 
                       (click)="decrementQuantity(i)"
                       [disabled]="item.quantity <= 1"
                       [attr.aria-label]="'Decrease quantity for ' + item.name">
                 <mat-icon>remove</mat-icon>
               </button>
               
               <span class="quantity-value" aria-live="polite" aria-atomic="true">
                 {{ item.quantity }}
               </span>
               
               <button mat-icon-button 
                       (click)="incrementQuantity(i)"
                       [disabled]="item.maxQuantity && item.quantity >= item.maxQuantity"
                       [attr.aria-label]="'Increase quantity for ' + item.name">
                 <mat-icon>add</mat-icon>
               </button>
             </div>
           </div>
           
           <!-- Total Price -->
           <div class="price-group">
             <label class="price-label">Total</label>
             <p class="total-price">₹{{ item.totalPrice }}</p>
           </div>
           
           <!-- Delete Button -->
           <button mat-icon-button 
                   color="warn"
                   (click)="removeItem(i)"
                   [attr.aria-label]="'Remove ' + item.name + ' from cart'"
                   class="delete-btn">
             <mat-icon>delete_outline</mat-icon>
           </button>
         </div>
       </article>
     </div>
   </div>
   ```

3. **Verify component imports**: Ensure template uses available Material components
   ```bash
   grep -A 20 "@Component" src/app/features/customer/cart/cart.component.ts | grep "imports"
   ```

4. **Test rendering**:
   ```bash
   ng serve
   # Navigate to cart page, verify no console errors
   ```

**✓ Checkpoint**: Cart component renders without errors; product list displays

---

### Phase 1D: Create Responsive SCSS Styling (90 minutes)

**Goal**: Implement mobile-first responsive layout with breakpoints

**File**: `src/app/features/customer/cart/cart.component.scss`

1. **Backup existing styles**:
   ```bash
   cp src/app/features/customer/cart/cart.component.scss cart.component.scss.bak
   ```

2. **Write mobile-first SCSS**:

   ```scss
   // ============================================================================
   // Cart Component Responsive Styles (Mobile-First)
   // ============================================================================
   
   // CSSVAR: Color variables (inherit from Material theme)
   @import '@angular/material/prebuilt-themes/indigo-pink.css';
   
   // ============================================================================
   // BASE STYLES (Mobile-first, < 480px)
   // ============================================================================
   
   .cart-container {
     max-width: 1200px;
     margin: 0 auto;
     padding: 12px;
     background: #fafafa;
     min-height: 100vh;
   }
   
   // Header
   .cart-header {
     display: flex;
     align-items: center;
     gap: 12px;
     margin-bottom: 16px;
     padding: 12px;
     background: white;
     border-radius: 8px;
     box-shadow: 0 1px 3px rgba(0,0,0,0.1);
   
     h1 {
       flex: 1;
       margin: 0;
       font-size: 18px;
       font-weight: 600;
       color: #222;
     }
   
     button {
       flex-shrink: 0;
     }
   }
   
   // Items Section Container
   .cart-items-section {
     margin-bottom: 16px;
   }
   
   .section-title {
     font-size: 16px;
     font-weight: 600;
     margin: 0 0 12px 0;
     padding: 0 12px;
     color: #222;
   }
   
   // Empty State
   .empty-state {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     padding: 40px 20px;
     background: white;
     border-radius: 8px;
     text-align: center;
   
     .empty-icon {
       font-size: 64px;
       width: 64px;
       height: 64px;
       color: #ccc;
       margin-bottom: 16px;
     }
   
     h3 {
       margin: 0 0 16px 0;
       font-size: 16px;
       color: #666;
     }
   }
   
   // ============================================================================
   // CART ITEMS LIST & CARDS
   // ============================================================================
   
   .cart-items-list {
     display: flex;
     flex-direction: column;
     gap: 8px;
   }
   
   // Individual Card
   .cart-item-card {
     display: flex;
     flex-wrap: wrap;  // Items wrap on mobile
     gap: 12px;
     padding: 12px;
     background: white;
     border: 1px solid #e0e0e0;
     border-radius: 8px;
     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
   
     &:hover {
       box-shadow: 0 2px 8px rgba(0,0,0,0.1);
       transition: box-shadow 0.2s ease;
     }
   }
   
   // Product Image
   .item-image-container {
     flex-shrink: 0;
     width: 70px;
     height: 70px;
     border-radius: 6px;
     overflow: hidden;
     background: #f5f5f5;
     border: 1px solid #ddd;
   }
   
   .item-image {
     width: 100%;
     height: 100%;
     object-fit: cover;
   }
   
   // Product Info (Name, Price, Unit)
   .item-info {
     flex: 1;
     min-width: 150px;  // Prevent squishing on narrow screens
     display: flex;
     flex-direction: column;
     justify-content: center;
   
     .item-name {
       margin: 0 0 4px 0;
       font-size: 14px;
       font-weight: 600;
       color: #222;
       word-break: break-word;  // Handle long names
     }
   
     .item-unit {
       margin: 0 0 4px 0;
       font-size: 11px;
       color: #999;
       text-transform: uppercase;
     }
   
     .price-info {
       display: flex;
       align-items: center;
       gap: 8px;
       font-size: 12px;
       color: #666;
   
       .unit-price {
         font-weight: 500;
       }
   
       .discount-badge {
         padding: 2px 6px;
         background: #2e7d32;
         color: white;
         border-radius: 4px;
         font-size: 10px;
         font-weight: 600;
       }
     }
   
     .original-price {
       margin: 0;
       font-size: 12px;
       color: #999;
       text-decoration: line-through;
     }
   }
   
   // Controls Section (Quantity, Delete)
   .item-controls {
     width: 100%;  // Full width on mobile
     display: flex;
     flex-wrap: wrap;
     gap: 8px;
     align-items: center;
     justify-content: space-between;
     padding: 8px 0 0 0;
     border-top: 1px solid #f0f0f0;
   }
   
   // Quantity Controls Group
   .quantity-group {
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 4px;
   
     .quantity-label {
       font-size: 10px;
       color: #999;
       text-transform: uppercase;
       margin: 0;
     }
   
     .quantity-input {
       display: flex;
       align-items: center;
       gap: 4px;
       padding: 4px;
       border: 1px solid #ddd;
       border-radius: 4px;
       background: #fafafa;
   
       button {
         width: 32px;
         height: 32px;
         min-width: 32px;
         padding: 0;
   
         mat-icon {
           font-size: 18px;
           width: 18px;
           height: 18px;
         }
       }
   
       .quantity-value {
         min-width: 24px;
         text-align: center;
         font-weight: 600;
         font-size: 14px;
       }
     }
   }
   
   // Total Price Group
   .price-group {
     display: flex;
     flex-direction: column;
     align-items: flex-end;
     gap: 4px;
   
     .price-label {
       font-size: 10px;
       color: #999;
       text-transform: uppercase;
       margin: 0;
     }
   
     .total-price {
       margin: 0;
       font-size: 16px;
       font-weight: 700;
       color: #2e7d32;
     }
   }
   
   // Delete Button
   .delete-btn {
     flex-shrink: 0;
   }
   
   // ============================================================================
   // RESPONSIVE BREAKPOINTS
   // ============================================================================
   
   // Small Mobile (480px - 768px)
   @media (min-width: 480px) {
     .cart-container {
       padding: 16px;
     }
   
     .cart-header {
       gap: 16px;
       padding: 16px;
   
       h1 {
         font-size: 20px;
       }
     }
   
     .item-image-container {
       width: 80px;
       height: 80px;
     }
   
     .cart-item-card {
       gap: 16px;
       padding: 16px;
     }
   
     .quantity-group .quantity-input {
       button {
         width: 36px;
         height: 36px;
         min-width: 36px;
   
         mat-icon {
           font-size: 20px;
           width: 20px;
           height: 20px;
         }
       }
     }
   
     .item-name {
       font-size: 15px;
     }
   }
   
   // Tablet (768px - 1024px)
   @media (min-width: 768px) {
     .cart-item-card {
       flex-wrap: nowrap;  // Single row on tablet
       gap: 20px;
   }
   
     .item-info {
       min-width: 200px;
     }
   
     .item-controls {
       width: auto;  // Shrink to fit
       flex-wrap: nowrap;
       gap: 16px;
       padding: 0;
       border-top: none;
     }
   
     .quantity-group {
       flex-direction: row;
       align-items: center;
     }
   
     .price-group {
       align-items: flex-end;
     }
   }
   
   // Desktop (1024px+)
   @media (min-width: 1024px) {
     .cart-container {
       padding: 24px;
     }
   
     .cart-header {
       gap: 24px;
       padding: 20px;
   
       h1 {
         font-size: 24px;
       }
     }
   
     .item-image-container {
       width: 100px;
       height: 100px;
     }
   
     .cart-item-card {
       gap: 24px;
       padding: 20px;
   
       &:hover {
         box-shadow: 0 4px 12px rgba(0,0,0,0.12);
       }
     }
   
     .item-info {
       min-width: 250px;
     }
   
     .item-name {
       font-size: 16px;
     }
   
     .quantity-group .quantity-input {
       button {
         width: 40px;
         height: 40px;
         min-width: 40px;
       }
     }
   }
   
   // Extra Large Desktop (1440px+)
   @media (min-width: 1440px) {
     .cart-container {
       padding: 32px;
     }
   
     .cart-header {
       padding: 24px;
       border-radius: 12px;
     }
   
     .item-image-container {
       width: 120px;
       height: 120px;
     }
   }
   
   // ============================================================================
   // ACCESSIBILITY & HIGH CONTRAST
   // ============================================================================
   
   // High contrast mode
   @media (prefers-contrast: more) {
     .cart-item-card {
       border: 2px solid #000;
     }
   
     .item-name {
       font-weight: 700;
     }
   
     button {
       border: 2px solid currentColor;
     }
   }
   
   // Reduced motion
   @media (prefers-reduced-motion: reduce) {
     .cart-item-card {
       transition: none;
     }
   
     .cart-item-card:hover {
       box-shadow: none;
     }
   }
   
   // ============================================================================
   // TOUCH DEVICE ADJUSTMENTS
   // ============================================================================
   
   @media (hover: none) and (pointer: coarse) {
     // Larger touch targets on mobile
     button {
       min-height: 48px;
       min-width: 48px;
     }
   
     .quantity-group .quantity-input {
       padding: 8px;
   
       button {
         width: 44px;
         height: 44px;
         min-width: 44px;
       }
     }
   }
   
   // ============================================================================
   // CUSTOMER DETAILS & SUMMARY SECTIONS (Unchanged)
   // ============================================================================
   // Keep existing styles for details-card and summary-card if already optimized
   // Or apply similar responsive patterns
   
   .details-card,
   .summary-card {
     margin-bottom: 16px;
     padding: 16px;
     background: white;
     border-radius: 8px;
     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
   }
   
   @media (min-width: 768px) {
     .details-card,
     .summary-card {
       margin-bottom: 20px;
       padding: 20px;
     }
   }
   ```

3. **Verify styles compile**:
   ```bash
   ng serve
   # Check browser DevTools: No SCSS errors
   ```

4. **Test responsive breakpoints**:
   ```bash
   # In browser DevTools, test these widths:
   # 320px (minimal mobile)
   # 480px (small mobile)
   # 768px (tablet portrait)
   # 1024px (tablet landscape)
   # 1440px (desktop)
   # Verify: NO horizontal scrolling at any width
   ```

**✓ Checkpoint**: Cart displays correctly at all 5 breakpoints; no horizontal scroll

---

### Phase 1E: Add Accessibility Features (60 minutes)

**Goal**: Implement WCAG 2.1 Level AA compliance

**File**: `src/app/features/customer/cart/cart.component.html` (add semantic HTML)

1. **Add semantic wrappers**:
   ```html
   <!-- Wrap items in semantic list -->
   <section class="cart-items-section" role="main" aria-label="Shopping Cart">
     <h2 class="section-title">Items</h2>
     
     <ul role="list" class="cart-items-list">
       <li role="listitem" class="cart-item-card">
         <!-- Card content -->
       </li>
     </ul>
   </section>
   ```

2. **Add ARIA labels to all buttons**:
   ```html
   <button (click)="decrementQuantity(i)"
           [attr.aria-label]="'Decrease quantity for ' + item.name">
   
   <button (click)="incrementQuantity(i)"
           [attr.aria-label]="'Increase quantity for ' + item.name">
   
   <button (click)="removeItem(i)"
           [attr.aria-label]="'Remove ' + item.name + ' from cart'">
   ```

3. **Add `aria-live` to quantity display** (announces changes):
   ```html
   <span class="quantity-value" 
         aria-live="polite" 
         aria-atomic="true">{{ item.quantity }}</span>
   ```

4. **Test with screen reader**:
   ```bash
   # Windows: Install NVDA (free)
   # Download: https://www.nvaccess.org/download/
   # Start NVDA, navigate cart with arrow keys
   # Verify: All items and controls announced correctly
   ```

5. **Test color contrast** (WCAG 4.5:1 for normal text):
   ```bash
   # Use axe DevTools browser extension:
   # 1. Install from Chrome Web Store
   # 2. Open DevTools, run "Scan All"
   # 3. Fix any "Contrast" violations
   ```

**✓ Checkpoint**: Screen reader reads all items; axe scan shows 0 contrast errors

---

### Phase 1F: Implement Lazy-Loading Images (45 minutes)

**Goal**: Optimize performance by lazy-loading product images

**File**: Create `src/app/shared/directives/lazy-load.directive.ts`

1. **Create lazy-load directive**:

   ```typescript
   import { Directive, ElementRef, OnInit } from '@angular/core';
   
   @Directive({
     selector: '[appLazyLoad]',
     standalone: true,
     host: {
       '[style.opacity]': '!loaded ? 0.5 : 1',
       '[style.transition]': '"opacity 0.3s ease-in"'
     }
   })
   export class LazyLoadDirective implements OnInit {
     loaded = false;
     private observer?: IntersectionObserver;
   
     constructor(private el: ElementRef<HTMLImageElement>) {}
   
     ngOnInit(): void {
       if ('IntersectionObserver' in window) {
         this.observer = new IntersectionObserver(
           entries => {
             entries.forEach(entry => {
               if (entry.isIntersecting) {
                 const img = entry.target as HTMLImageElement;
                 img.src = img.dataset['src']!;
                 img.addEventListener('load', () => {
                   this.loaded = true;
                   this.observer?.unobserve(img);
                 });
               }
             });
           },
           { rootMargin: '50px' }  // Start loading 50px before visible
         );
         this.observer.observe(this.el.nativeElement);
       } else {
         // Fallback for browsers without IntersectionObserver
         this.el.nativeElement.src = this.el.nativeElement.dataset['src']!;
       }
     }
   
     ngOnDestroy(): void {
       this.observer?.disconnect();
     }
   }
   ```

2. **Update component to use lazy-load**:

   In `cart.component.ts`, import the directive:
   ```typescript
   import { LazyLoadDirective } from '../../../shared/directives/lazy-load.directive';
   
   @Component({
     // ...
     imports: [
       // ... existing imports
       LazyLoadDirective
     ]
   })
   ```

3. **Update template to use data-src**:
   ```html
   <img appLazyLoad
        [attr.data-src]="item.imageUrl || '/assets/placeholder-product.svg'"
        alt="Product: {{ item.name }}"
        class="item-image"
        onerror="this.src='/assets/placeholder-product.svg'">
   ```

4. **Test lazy-loading**:
   ```bash
   ng serve
   # Open DevTools > Network tab
   # Filter by Images
   # Scroll cart: images load only when scrolled into view
   ```

**✓ Checkpoint**: Images load on scroll; initial load < 2s on 4G

---

### Phase 1G: Testing & Verification (90 minutes)

**Goal**: Comprehensive testing across devices, browsers, and accessibility

#### Unit Tests

1. **Add test for quantity validation**:
   ```bash
   npm run test -- --include='**/cart.component.spec.ts'
   ```

   In `cart.component.spec.ts`:
   ```typescript
   describe('CartComponent', () => {
     it('should disable increment button at maxQuantity', () => {
       const item = { ...mockItem, maxQuantity: 5, quantity: 5 };
       component.cartItems = [item];
       fixture.detectChanges();
       
       const incrementBtn = fixture.debugElement.query(
         By.css('button[aria-label*="Increase"]')
       );
       expect(incrementBtn.nativeElement.disabled).toBe(true);
     });
   });
   ```

2. **Add test for image fallback**:
   ```typescript
   it('should show placeholder when image fails to load', () => {
     component.cartItems = [{ ...mockItem, imageUrl: 'invalid-url' }];
     fixture.detectChanges();
     
     const img = fixture.debugElement.query(By.css('img'));
     img.nativeElement.onerror();  // Simulate error
     
     expect(img.nativeElement.src).toContain('placeholder');
   });
   ```

#### Responsive Testing

1. **Chrome DevTools Responsive Mode**:
   ```bash
   ng serve
   # Open http://localhost:4200
   # Dev Tools > Toggle device toolbar (Ctrl+Shift+M)
   # Test: iPhone SE (375px), iPad (768px), Desktop (1440px)
   # Verify: NO horizontal scroll, all controls visible
   ```

2. **Lighthouse Audit**:
   ```bash
   # Device: Simulated 4G
   # CPU: 4x slowdown
   # Target: 
   #   - Performance: > 90
   #   - Accessibility: 95+
   #   - Best Practices: 90+
   ```

#### Accessibility Audit

1. **WAVE Browser Extension** (Free):
   - Install from Chrome Web Store
   - On cart page: click WAVE icon
   - Fix all errors (red icons)
   - Warnings (yellow) reviewed manually

2. **axe DevTools** (Free):
   - Install from Chrome Web Store
   - On cart page: click axe DevTools
   - "Scan ALL of my page"
   - Fix all violations

3. **Keyboard Navigation**:
   ```bash
   # No mouse - only Tab, Enter, arrow keys
   # Tab through: header button > items > buttons > form > submit button
   # Enter: toggles buttons
   # Expected: All controls reachable, no traps
   ```

4. **Screen Reader Test** (NVDA - Windows/free):
   ```bash
   # Download NVDA from https://www.nvaccess.org/download/
   # Start NVDA
   # Press Ctrl+Alt+N to start
   # Navigate cart with arrow keys
   # Verify: Items, prices, buttons announced correctly
   ```

#### Performance Testing

1. **Lighthouse Performance Score**:
   ```bash
   ng serve --configuration=production
   # DevTools > Lighthouse
   # Measure on 4G connection
   # Target: < 2s page load
   # LCP (Largest Contentful Paint): < 2.5s
   # CLS (Cumulative Layout Shift): < 0.1
   ```

2. **Bundle Size Check**:
   ```bash
   npm run build -- --configuration=production --stats-json
   webpack-bundle-analyzer dist/stats.json
   # Verify: No unexpected size increases
   ```

**✓ Checkpoint**: All tests pass; Lighthouse > 90; 0 accessibility violations

---

### Phase 1H: Test on Physical Devices (if available)

1. **iPhone**:
   - Install TestFlight app or access via ngrok tunnel
   - Tap and swipe through cart
   - Check: Touch targets are 48px+, no horizontal scroll

2. **Android**:
   - Access via device IP on same network
   - Test same as iPhone

3. **Tablets**:
   - iPad and Android tablet for 768px test

4. **Slow Network**:
   - Chrome DevTools > Network > Slow 4G
   - Verify images load with obvious loading state (not jarring)

**✓ Checkpoint**: Works smoothly on iPhone, Android, tablets

---

## Testing Checklist

Use this checklist before deploying:

```markdown
## Pre-Deployment Testing Checklist

### Visual & Layout (Responsive)
- [ ] 320px (iPhone SE) - no horizontal scroll
- [ ] 480px (small mobile) - no horizontal scroll  
- [ ] 768px (iPad) - cards displayed well
- [ ] 1024px (iPad Pro) - full width optimal
- [ ] 1440px (desktop) - hover effects work
- [ ] Product images display or show placeholder
- [ ] Text readable without truncation (long names)
- [ ] Touch targets 48px minimum on mobile

### Functionality
- [ ] Add item to cart works
- [ ] Increment quantity works (respects maxQuantity)
- [ ] Decrement quantity works (minimum 1)
- [ ] Remove item works
- [ ] Enter customer info works
- [ ] "Order on WhatsApp" generates correct link
- [ ] Language switcher works (English/Tamil)
- [ ] Empty cart state displays

### Accessibility
- [ ] All buttons have aria-labels
- [ ] Keyboard Tab navigation works
- [ ] Screen reader reads items correctly
- [ ] Color contrast >= 4.5:1 (axe verified)
- [ ] Images have alt text
- [ ] Form labels associated with inputs

### Performance
- [ ] Lighthouse score > 90
- [ ] Page load < 2s on 4G throttle
- [ ] Images lazy-load on scroll
- [ ] CLS < 0.1 (no jarring layout shifts)
- [ ] Bundle size not increased > 10%

### Browser Compatibility
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari (if iOS access available)
- [ ] Edge (if Windows device available)

### Multi-Tenant / Security
- [ ] Only current shop's cart displays
- [ ] No cross-shop data visible
- [ ] localStorage cleared on logout
- [ ] Seller phone correctly associated with shop

### Backwards Compatibility
- [ ] Existing CartService API unchanged
- [ ] CartItem interface backwards compatible
- [ ] No breaking changes to component public API
```

---

## Deployment Steps

### 1. Code Review
```bash
# Run lint & format
npm run lint
npm run format

# For SCSS specifically  
npm run lint -- --fix
```

### 2. Build Production Bundle
```bash
npm run build -- --configuration=production \
  --optimization=true \
  --output-hashing=all \
  --source-map=false

# Verify output size
ls -lh dist/
# Should be < 250KB gzipped
```

### 3. Firebase Deployment (if using)
```bash
# Build for production
npm run build -- --configuration=production

# Deploy to Firebase hosting
firebase deploy --project=your-project-id

# Verify: Check staging URL for functionality
```

### 4. Update DEPLOYMENT.md
```markdown
# Cart Component Layout Redesign - Deployment Record

**Version**: 1.0  
**Date**: [DATE]  
**Deployed By**: [YOUR NAME]  
**Environment**: Production  
**Git Commit**: [COMMIT HASH]  

## Changes
- [x] Replaced table layout with card-based design
- [x] Added responsive breakpoints (5 breakpoints tested)
- [x] Implemented lazy-loading for images
- [x] Added WCAG 2.1 Level AA accessibility
- [x] All tests passing

## Performance Metrics
- Lighthouse Score: 94/100
- Page Load (4G): 1.8s
- CLS: 0.08
- Bundle Size: No increase

## Testing Completed
- [x] Responsive (320px-1440px)
- [x] Accessibility (WAVE, axe, screen reader)
- [x] Functionality (all cart operations)
- [x] Performance (Lighthouse, bundle)

## Rollback Plan
If issues found in production:
1. Revert to commit [PREV-COMMIT]
2. Notify team in #cart-redesign channel
3. Root cause analysis in postmortem
```

### 5. Monitor Post-Deployment
```bash
# Check for errors in browser console
# Monitor Firestore for any issues
# Check user feedback in support channels
# Track: cart abandonment rate (should not increase)
```

---

## Quick Reference

| File | Purpose | Changes |
|------|---------|---------|
| `product.model.ts` | CartItem interface | Add maxQuantity, originalPrice, discountPercentage |
| `cart.service.ts` | State management | Add quantity validation |
| `cart.component.html` | Template | Replace layout with card-based design |
| `cart.component.scss` | Styling | New responsive SCSS with 5 breakpoints |
| `cart.component.ts` | Logic | Add or update methods (keep public API same) |
| `cart.component.spec.ts` | Unit tests | Add quantity, image fallback tests |
| `lazy-load.directive.ts` | Performance | New directive for lazy-load images |

---

## Support & Troubleshooting

### Issue: Horizontal scroll on mobile
**Solution**: Check SCSS media queries; verify max-width: 100% on all containers

### Issue: Images not loading
**Solution**: Verify imageUrl is valid; check Firebase Storage permissions; ensure placeholder.svg exists

### Issue: Keyboard navigation broken
**Solution**: Add tabindex="0" to interactive elements; check for z-index traps

### Issue: Screen reader not announcing changes
**Solution**: Add aria-live="polite" to dynamic elements; verify aria-label on buttons

### Resources
- [WCAG 2.1 Checklist](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Material Accessibility](https://material.angular.io/guide/using-component-harnesses)
- [RxJS Observable Patterns](https://rxjs.dev/guide/observable)
