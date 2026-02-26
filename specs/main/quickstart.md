# Phase 1: Quickstart Guide - Module-Based Restructure

**Target Audience**: Developers implementing the folder restructure  
**Estimated Duration**: 6-8 hours (phased over days to minimize conflict)  
**Status**: Ready for Phase 2 (task breakdown)

---

## Pre-Implementation Checklist

- [ ] Review [plan.md](./plan.md) for overall strategy
- [ ] Read [data-model.md](./data-model.md) to understand entity boundaries
- [ ] Review route contracts in [contracts/](./contracts/) directory
- [ ] Ensure git branch is clean: `git status`
- [ ] Pull latest main: `git pull origin main`

---

## Directory Structure Quick Reference

### Before (Current)
```
src/app/
├── core/
├── features/
│   ├── admin/
│   ├── customer/
│   ├── home/
│   └── seller/
└── app.routes.ts
```

### After (Target)
```
src/app/
├── core/
├── modules/
│   ├── customer/
│   ├── seller/
│   └── admin/
├── shared/
├── app.routes.ts
└── app.component.ts
```

**Key Point**: Old `features/` directory remains during Phase 1-5; only delete after Phase 6 verification.

---

## Phase 1: Create New Directory Structure

### Step 1: Create Module Directories

```powershell
# Navigate to project root
cd ~/WhatsApp-Orders-Local-shop

# Create module structure
mkdir -p src/app/modules/customer/components/{home,products,product-details,cart,checkout}
mkdir -p src/app/modules/customer/services
mkdir -p src/app/modules/customer/pipes

mkdir -p src/app/modules/seller/components/{login,seller-header,dashboard,products-management,orders-management,analytics}
mkdir -p src/app/modules/seller/services
mkdir -p src/app/modules/seller/pipes

mkdir -p src/app/modules/admin/components/{login,admin-header,sellers-management,shops-management,reports}
mkdir -p src/app/modules/admin/services
mkdir -p src/app/modules/admin/pipes

mkdir -p src/app/shared/components/{header,footer,loader,error-dialog}
mkdir -p src/app/shared/pipes
mkdir -p src/app/shared/directives
mkdir -p src/app/shared/utilities
```

### Step 2: Verify Structure

```powershell
# List newly created directories
tree src/app/modules -L 3
tree src/app/shared -L 3
```

---

## Phase 2: Copy Components (No Deletions Yet)

### Customer Module

```powershell
# Copy existing customer components
Copy-Item src/app/features/customer/* src/app/modules/customer/components/ -Recurse -Force

# Update imports in copied files (see Import Path Updates section below)
```

**Components to move**:
- `home/` → `modules/customer/components/home/`
- `products/` → `modules/customer/components/products/`
- `product-details/` → `modules/customer/components/product-details/`
- `cart/` → `modules/customer/components/cart/`
- `checkout/` → `modules/customer/components/checkout/` (if exists)

### Seller Module

```powershell
# Copy existing seller components
Copy-Item src/app/features/seller/* src/app/modules/seller/components/ -Recurse -Force
```

**Components to move**:
- `login/` → `modules/seller/components/login/`
- `seller-header/` → `modules/seller/components/seller-header/`
- `dashboard/` → `modules/seller/components/dashboard/`
- `products-management/` → `modules/seller/components/products-management/`
- `orders-management/` → `modules/seller/components/orders-management/`
- `analytics/` → `modules/seller/components/analytics/` (new component)

### Admin Module

```powershell
# Copy existing admin components
Copy-Item src/app/features/admin/* src/app/modules/admin/components/ -Recurse -Force
```

**Components to move**:
- `login/` → `modules/admin/components/login/`
- `admin-header/` → `modules/admin/components/admin-header/`
- `sellers-management/` → `modules/admin/components/sellers-management/`
- `shops-management/` → `modules/admin/components/shops-management/`
- `reports/` → `modules/admin/components/reports/` (new component)

---

## Phase 3: Update Import Paths

### Import Pattern Updates

**Before (from `features/`)**:
```typescript
import { AuthService } from '@app/core/services/auth.service';
import { CartComponent } from '@app/features/customer/cart/cart.component';
```

**After (module-based)**:
```typescript
import { AuthService } from '@app/core/services/auth.service';
import { CartComponent } from '../components/cart/cart.component';  // Relative within module
```

### Key Rules

1. **Core imports**: Always absolute
   ```typescript
   import { AuthService } from '@app/core/services/auth.service';
   import { Order } from '@app/core/models/order.model';
   ```

2. **Module-internal imports**: Use relative paths
   ```typescript
   import { ProductService } from '../services/product.service';
   import { ProductComponent } from '../components/product/product.component';
   ```

3. **Shared imports**: Use absolute paths
   ```typescript
   import { LoaderComponent } from '@app/shared/components/loader/loader.component';
   import { PriceFormatPipe } from '@app/shared/pipes/price-format.pipe';
   ```

4. **Never import between modules**
   ```typescript
   // ❌ BAD: seller module importing from customer
   import { CartComponent } from '@app/modules/customer/components/cart/cart.component';
   
   // ✅ GOOD: extract to shared if needed
   import { SharedCartComponent } from '@app/shared/components/cart/cart.component';
   ```

### Tool: Find & Replace

Use VS Code find/replace to update imports:

**Pattern 1**: `features/customer/` → `modules/customer/components/`
- Find: `@app/features/customer/([^/]+)([^"]+)`
- Replace: `@app/modules/customer/components/$1$2`

**Pattern 2**: `features/seller/` → `modules/seller/components/`
- Find: `@app/features/seller/([^/]+)([^"]+)`
- Replace: `@app/modules/seller/components/$1$2`

**Pattern 3**: `features/admin/` → `modules/admin/components/`
- Find: `@app/features/admin/([^/]+)([^"]+)`
- Replace: `@app/modules/admin/components/$1$2`

---

## Phase 4: Create Module Route Files

### Customer Routes

**File**: `src/app/modules/customer/customer.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: ':shopSlug',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products.component')
          .then(m => m.ProductsComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./components/product-details/product-details.component')
          .then(m => m.ProductDetailsComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart/cart.component')
          .then(m => m.CartComponent)
      }
    ]
  }
];
```

### Seller Routes

**File**: `src/app/modules/seller/seller.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { sellerAuthGuard } from '@app/core/guards/seller-auth.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/seller-login.component')
      .then(m => m.SellerLoginComponent)
  },
  {
    path: ':shopSlug',
    canActivate: [sellerAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products-management/products-management.component')
          .then(m => m.ProductsManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/orders-management/orders-management.component')
          .then(m => m.OrdersManagementComponent)
      }
    ]
  }
];
```

### Admin Routes

**File**: `src/app/modules/admin/admin.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { adminAuthGuard } from '@app/core/guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/admin-login.component')
      .then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    children: [
      {
        path: 'sellers',
        loadComponent: () => import('./components/sellers-management/sellers-management.component')
          .then(m => m.SellersManagementComponent)
      },
      {
        path: 'shops',
        loadComponent: () => import('./components/shops-management/shops-management.component')
          .then(m => m.ShopsManagementComponent)
      }
    ]
  }
];
```

---

## Phase 5: Update Main App Routes

**File**: `src/app/app.routes.ts`

Replace the old routing structure with module lazy-loading:

```typescript
import { Routes } from '@angular/router';
import { sellerAuthGuard } from './core/guards/seller-auth.guard';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  // Smart routing home page
  {
    path: '',
    loadComponent: () => import('./features/home/smart-root.component')
      .then(m => m.SmartRootComponent),
    pathMatch: 'full'
  },

  // Customer public routes (NO guard)
  {
    path: ':shopSlug',
    loadChildren: () => import('./modules/customer/customer.routes')
      .then(m => m.CUSTOMER_ROUTES)
  },

  // Seller protected routes
  {
    path: 'seller',
    loadChildren: () => import('./modules/seller/seller.routes')
      .then(m => m.SELLER_ROUTES)
  },

  // Admin protected routes
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    canActivate: [adminAuthGuard]
  },

  // Error pages
  { path: 'unauthorized', loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '/unauthorized' }
];
```

---

## Phase 6: Testing & Verification

### Test Development Build

```powershell
# Start dev server
npm start

# Verify in browser:
# 1. Navigate to http://localhost:4200
# 2. Open Chrome DevTools → Network tab
# 3. Click through routes (customer → seller → admin)
# 4. Verify new chunks load on demand:
#    - customer-routes → customer.js chunk
#    - seller/login → seller.js chunk
#    - admin → admin.js chunk
```

### Test Production Build

```powershell
# Build for production
npm run build:prod

# Verify bundle analysis
npm run bundle-report  # If configured in package.json

# Check bundle size
# Should be:
# - main.js < 100KB gzipped
# - customer, seller, admin chunks < 50KB each
```

### Verify Import Paths

```powershell
# Run TypeScript compiler
npx tsc --noEmit

# Should have ZERO errors about module resolution
```

### Run Tests

```powershell
# Run unit tests
npm run test

# Verify all tests pass
```

---

## Phase 7: Cleanup (Only After Verification)

**⚠️ Do NOT delete `features/` until all phases 1-6 are verified in production!**

Once Phase 6 is complete and tested:

```powershell
# Delete old features structure
Remove-Item src/app/features -Recurse -Force

# Verify builds still work
npm run build:prod

# Commit cleanup
git add -A
git commit -m "chore: remove old features directory after module restructure"
```

---

## Rollback Plan

If issues occur during migration:

```powershell
# Option 1: Revert last commit
git revert HEAD

# Option 2: Revert to specific commit
git revert <commit-hash>

# Option 3: Full reset (if multiple commits)
git reset --hard origin/main
```

---

## Common Issues & Solutions

### Issue 1: Circular Dependencies
**Error**: `Module has an unresolved dependency`

**Solution**: Use relative paths within modules, absolute paths for core/shared
```typescript
// ❌ BAD
import { ProductService } from '@app/modules/customer/services/product.service';

// ✅ GOOD (if in same module)
import { ProductService } from '../services/product.service';
```

### Issue 2: Missing Components in Routes
**Error**: `Cannot match any routes` when navigating

**Solution**: Verify `customer.routes.ts`, `seller.routes.ts`, `admin.routes.ts` have all components exported

### Issue 3: Bundle Size Larger After Restructure
**Error**: Production build > 250KB gzipped

**Solution**: Verify lazy-loading is working
```powershell
# Check for unused imports that prevent tree-shaking
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/whatsapp-ordering-pwa/browser/stats.json
```

### Issue 4: Service Instances Not Shared
**Error**: Services appear to have multiple instances

**Solution**: Always import services from `core/` (not re-exported from modules)
```typescript
// ✅ CORRECT
import { CartService } from '@app/core/services/cart.service';

// ❌ INCORRECT (if re-exported from module)
import { CartService } from '@app/modules/customer/cart.service';
```

---

## Checking Off Task Phases

Track progress with this checklist:

- [ ] Phase 1: Create directory structure
- [ ] Phase 2: Copy components (no deletions)
- [ ] Phase 3: Update import paths
- [ ] Phase 4: Create module route files
- [ ] Phase 5: Update app.routes.ts
- [ ] Phase 6: Test & verify
- [ ] Phase 7: Commit & cleanup

---

## Next Steps

After completing quickstart:

1. Proceed to **Phase 2 (Tasks)** via `/speckit.tasks` command
2. Tasks will be broken down per component/service for team assignment
3. Each task includes: component name, import updates needed, test requirements

---

**Last Updated**: 2026-02-26  
**Contact**: Team Lead for blockers or clarifications
