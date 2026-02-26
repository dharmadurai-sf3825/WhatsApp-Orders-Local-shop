# 📁 Folder Restructure & Module-Based Support Specification

## 🎯 Overview

This specification defines the restructuring of the WhatsApp Ordering PWA project to support **module-based organization** during the build process. Components and features will be grouped by functional modules (Customer, Seller, Admin) with clear separation of concerns.

## 📊 Current vs. Proposed Structure

### Current Structure
```
src/app/
├── core/                          # Shared services & models
│   ├── models/
│   ├── guards/
│   └── services/
└── features/
    ├── admin/                     # Admin module
    ├── customer/                  # Customer module
    ├── home/                      # Home/smart routing
    └── seller/                    # Seller module
```

### Proposed Module-Based Structure
```
src/app/
├── core/                          # Global services, models, guards (shared)
│   ├── models/
│   │   ├── order.model.ts
│   │   ├── product.model.ts
│   │   ├── shop.model.ts
│   │   ├── user.model.ts
│   │   └── payment.model.ts
│   ├── guards/
│   │   ├── admin-auth.guard.ts
│   │   └── seller-auth.guard.ts
│   └── services/
│       ├── auth.service.ts
│       ├── firebase.service.ts
│       ├── global-state.service.ts
│       ├── language.service.ts
│       ├── razorpay.service.ts
│       ├── whatsapp.service.ts
│       └── cart.service.ts
│
├── modules/                       # NEW: Module-based organization
│   ├── customer/                  # Customer shopfront module
│   │   ├── customer.routes.ts     # Customer-specific routes
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.scss
│   │   │   ├── products/
│   │   │   ├── product-details/
│   │   │   ├── cart/
│   │   │   └── checkout/         # NEW: Checkout flow
│   │   ├── services/              # Customer-specific services
│   │   │   ├── product.service.ts
│   │   │   └── order-checkout.service.ts
│   │   └── pipes/                 # Module-specific pipes
│   │       └── price-format.pipe.ts
│   │
│   ├── seller/                    # Seller dashboard module
│   │   ├── seller.routes.ts
│   │   ├── components/
│   │   │   ├── seller-header/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── products-management/
│   │   │   ├── orders-management/
│   │   │   └── analytics/         # NEW: Sales analytics
│   │   ├── services/              # Seller-specific services
│   │   │   ├── seller-product.service.ts
│   │   │   ├── seller-order.service.ts
│   │   │   └── seller-analytics.service.ts
│   │   └── pipes/
│   │       └── status-badge.pipe.ts
│   │
│   └── admin/                     # Admin panel module
│       ├── admin.routes.ts
│       ├── components/
│       │   ├── admin-header/
│       │   ├── login/
│       │   ├── sellers-management/
│       │   ├── shops-management/
│       │   └── reports/           # NEW: Admin reports
│       ├── services/              # Admin-specific services
│       │   ├── admin-seller.service.ts
│       │   ├── admin-shop.service.ts
│       │   └── admin-reports.service.ts
│       └── pipes/
│           └── permission-badge.pipe.ts
│
├── shared/                        # NEW: Shared components & utilities
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── loader/
│   │   └── error-dialog/
│   ├── pipes/
│   │   └── truncate.pipe.ts
│   ├── directives/
│   ├── constants/
│   └── utilities/
│
├── app.component.ts
├── app.component.html
├── app.routes.ts                  # Main routing file
└── app.config.ts                  # App configuration
```

---

## 🔄 Module Organization Details

### 1. **Customer Module** (`modules/customer/`)

#### Purpose
- Shopping storefront for end customers
- Browse products, manage cart, checkout
- PWA-optimized for mobile

#### Components
- `home/` - Shop homepage & featured products
- `products/` - Product catalog & filtering
- `product-details/` - Individual product view
- `cart/` - Shopping cart management
- `checkout/` - Payment & order confirmation

#### Services
- `ProductService` - Product fetching & caching
- `OrderCheckoutService` - Cart to order conversion

#### Routes
```typescript
export const CUSTOMER_ROUTES: Routes = [
  {
    path: ':shopSlug',
    children: [
      { path: 'home', loadComponent: () => import('./components/home/...') },
      { path: 'products', loadComponent: () => import('./components/products/...') },
      { path: 'product/:id', loadComponent: () => import('./components/product-details/...') },
      { path: 'cart', loadComponent: () => import('./components/cart/...') }
    ]
  }
];
```

---

### 2. **Seller Module** (`modules/seller/`)

#### Purpose
- Seller dashboard for shop management
- Product & order management
- Sales analytics & reporting

#### Components
- `seller-header/` - Module navigation header
- `login/` - Seller authentication
- `dashboard/` - Overview dashboard
- `products-management/` - CRUD operations for products
- `orders-management/` - Order tracking & fulfillment
- `analytics/` - Sales reports & insights (NEW)

#### Services
- `SellerProductService` - Product management for sellers
- `SellerOrderService` - Order management & tracking
- `SellerAnalyticsService` - Sales metrics & reporting (NEW)

#### Routes
```typescript
export const SELLER_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/...') },
  {
    path: ':shopSlug',
    canActivate: [sellerAuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/...') },
      { path: 'products', loadComponent: () => import('./components/products-management/...') },
      { path: 'orders', loadComponent: () => import('./components/orders-management/...') },
      { path: 'analytics', loadComponent: () => import('./components/analytics/...') }
    ]
  }
];
```

---

### 3. **Admin Module** (`modules/admin/`)

#### Purpose
- Platform administration
- Seller management & shop oversight
- Platform reports & monitoring

#### Components
- `admin-header/` - Admin navigation
- `login/` - Admin authentication
- `sellers-management/` - Add/edit/manage sellers
- `shops-management/` - Shop configuration & monitoring
- `reports/` - Platform-wide reports (NEW)

#### Services
- `AdminSellerService` - Seller account management
- `AdminShopService` - Shop configuration
- `AdminReportsService` - Platform analytics (NEW)

#### Routes
```typescript
export const ADMIN_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/...') },
  {
    path: '',
    canActivate: [adminAuthGuard],
    children: [
      { path: 'sellers', loadComponent: () => import('./components/sellers-management/...') },
      { path: 'shops', loadComponent: () => import('./components/shops-management/...') },
      { path: 'reports', loadComponent: () => import('./components/reports/...') }
    ]
  }
];
```

---

## 🏗️ Core Module (Unchanged - Shared Resources)

The `core/` directory remains unchanged and accessible to all modules.

```
core/
├── models/           # Shared data models
├── services/         # Global services (Auth, Firebase, etc.)
├── guards/           # Route guards
├── interceptors/     # HTTP interceptors
└── constants/        # Global constants
```

### Shared Services (No Changes Required)
- `AuthService` - Firebase authentication
- `FirebaseService` - Firestore data access
- `GlobalStateService` - App-wide state
- `LanguageService` - i18n support
- `CartService` - Global cart state
- `RazorpayService` - Payment processing
- `WhatsAppService` - WhatsApp integration
- `ShopService` - Current shop context

---

## 📦 Shared Module (NEW)

Create reusable components, pipes, and directives used across modules.

```
shared/
├── components/
│   ├── header/
│   ├── footer/
│   ├── loader/
│   └── error-dialog/
├── pipes/
│   ├── truncate.pipe.ts
│   ├── safe-html.pipe.ts
│   └── currency-format.pipe.ts
├── directives/
│   ├── debounce.directive.ts
│   └── click-outside.directive.ts
└── utilities/
    ├── validators.ts
    └── helpers.ts
```

---

## 🛠️ Build-Time Module Resolution

### Angular Build Configuration

Update `angular.json` to support module-based builds:

```json
{
  "projects": {
    "whatsapp-ordering-pwa": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/whatsapp-ordering-pwa",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": [],
            "optimization": {
              "scripts": true,
              "styles": true,
              "fonts": true
            }
          }
        }
      }
    }
  }
}
```

### Main Routing File

The `app.routes.ts` orchestrates module loading:

```typescript
import { Routes } from '@angular/router';
import { sellerAuthGuard } from './core/guards/seller-auth.guard';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  // Customer routes (public)
  {
    path: ':shopSlug',
    loadChildren: () => import('./modules/customer/customer.routes')
      .then(m => m.CUSTOMER_ROUTES)
  },

  // Seller routes (protected)
  {
    path: 'seller',
    loadChildren: () => import('./modules/seller/seller.routes')
      .then(m => m.SELLER_ROUTES)
  },

  // Admin routes (protected)
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    canActivate: [adminAuthGuard]
  },

  // Landing/smart routing
  {
    path: '',
    loadComponent: () => import('./features/home/smart-root.component')
      .then(m => m.SmartRootComponent),
    pathMatch: 'full'
  },

  // Error handling
  { path: 'error', redirectTo: '/unauthorized' },
  { path: '**', redirectTo: '/error' }
];
```

---

## 📋 File Migration Plan

### Phase 1: Create New Structure (No Deletions)
```powershell
# Create new directories
mkdir src/app/modules/customer/components/{home,products,product-details,cart,checkout}
mkdir src/app/modules/customer/services
mkdir src/app/modules/customer/pipes

mkdir src/app/modules/seller/components/{login,dashboard,products-management,orders-management,analytics}
mkdir src/app/modules/seller/services
mkdir src/app/modules/seller/pipes

mkdir src/app/modules/admin/components/{login,sellers-management,shops-management,reports}
mkdir src/app/modules/admin/services
mkdir src/app/modules/admin/pipes

mkdir src/app/shared/{components,pipes,directives,utilities}
```

### Phase 2: Copy & Update Components
- Copy customer components from `features/customer/` → `modules/customer/components/`
- Copy seller components from `features/seller/` → `modules/seller/components/`
- Copy admin components from `features/admin/` → `modules/admin/components/`
- Update import paths in copied files

### Phase 3: Create Module Routes
- Create `customer.routes.ts` in `modules/customer/`
- Create `seller.routes.ts` in `modules/seller/`
- Create `admin.routes.ts` in `modules/admin/`

### Phase 4: Create Module Services
- Create module-specific services in each `modules/*/services/` directory
- Keep core services in `core/services/`

### Phase 5: Update Main App Routes
- Update `app.routes.ts` to use `loadChildren` for each module
- Verify all lazy loading works correctly

### Phase 6: Testing & Cleanup
- Run `npm start` to test development builds
- Run `npm run build:prod` to test production builds
- Once verified, delete old `features/` directory structure

---

## 🚀 Build Optimization

### Lazy Loading Benefits
Each module will be split into separate chunks during the build:
```
dist/whatsapp-ordering-pwa/browser/
├── main.js                    # App shell + core services
├── customer-routes.js         # Customer module (lazy-loaded)
├── seller-routes.js           # Seller module (lazy-loaded)
├── admin-routes.js            # Admin module (lazy-loaded)
├── shared-components.js       # Shared utilities (lazy-loaded)
└── [other assets]
```

### Build Commands

```powershell
# Development with module structure
npm start

# Production build with module optimization
npm run build:prod

# Build with bundle analysis
npm run build:prod -- --stats-json
npm run bundle-report
```

---

## 📊 Import Path Guidelines

### Core Services (Global)
```typescript
import { AuthService } from '@app/core/services/auth.service';
import { Order } from '@app/core/models/order.model';
```

### Module-Specific Services
```typescript
// In customer module
import { ProductService } from '../services/product.service';

// In seller module
import { SellerProductService } from '../services/seller-product.service';
```

### Shared Components
```typescript
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { TruncatePipe } from '@app/shared/pipes/truncate.pipe';
```

---

## ✅ Implementation Checklist

- [ ] Create module-based directory structure
- [ ] Move customer components to `modules/customer/components/`
- [ ] Move seller components to `modules/seller/components/`
- [ ] Move admin components to `modules/admin/components/`
- [ ] Create module-specific route files
- [ ] Create module-specific services
- [ ] Update `app.routes.ts` with module loading
- [ ] Create alias paths in `tsconfig.json` (optional)
- [ ] Update import statements throughout project
- [ ] Test development build (`npm start`)
- [ ] Test production build (`npm run build:prod`)
- [ ] Verify lazy loading in Chrome DevTools
- [ ] Run lighthouse audit for PWA score
- [ ] Delete old `features/` directory (after verification)
- [ ] Update README with new project structure
- [ ] Commit changes with clear git history

---

## 🔗 Path Aliases (Optional - For Cleaner Imports)

Update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@modules/*": ["src/app/modules/*"],
      "@shared/*": ["src/app/shared/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

Then use cleaner imports:
```typescript
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@modules/customer/services/product.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
```

---

## 📈 Expected Outcomes

✅ **Cleaner Code Organization**
- Each module is self-contained and maintainable

✅ **Better Performance**
- Only required modules are loaded
- Reduced initial bundle size

✅ **Easier Scaling**
- Adding new features is straightforward
- Module-based testing is simpler

✅ **Team Scalability**
- Multiple developers can work on different modules
- Clear separation of concerns

✅ **Improved Maintainability**
- Easy to locate related code
- Reduced cross-module dependencies

---

## 🔄 Rollback Plan

If issues occur during migration:
1. Keep old `features/` structure intact during Phase 1-3
2. Only delete after Phase 6 verification
3. All changes tracked in git for easy revert
4. Can rollback with: `git revert <commit-hash>`

---

## 📝 Notes

- This restructuring **does not require module-level `NgModule` declarations** (standalone components maintain their independence)
- All lazy loading is handled via `loadChildren` and `loadComponent`
- Core services remain globally available to all modules
- Firestore security rules and authentication flows remain unchanged

---

**Last Updated:** February 26, 2026
**Status:** Ready for Implementation
