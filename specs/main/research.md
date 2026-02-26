# Phase 0: Research & Clarification Resolution

**Date**: 2026-02-26 | **Status**: COMPLETE - No unknowns identified

## Research Summary

All technical context required for Phase 1 design is known and documented in the project's existing architecture.

---

## Technology Stack - Validated

### Decision: Angular 17+ with Standalone Components
- **Current State**: Already implemented project-wide
- **Rationale**: Enables lightweight lazy-loading without NgModule overhead; aligns with Constitution Principle IV
- **Confidence**: 100% (in-use, validated via existing codebase)

### Decision: Firebase (Firestore + Auth + Storage)
- **Current State**: Core backend service already integrated
- **Rationale**: Real-time sync, offline persistence, multi-tenant data isolation via security rules
- **Confidence**: 100% (production-proven in current system)

### Decision: Razorpay Payment Integration
- **Current State**: Integrated in checkout flow
- **Rationale**: supports local payment methods (UPI, cards)
- **Confidence**: 100% (existing integration)

---

## Module Organization - Confirmed

### Customer Module Scope
- **Components**: Home, Products, Product Details, Cart, Checkout
- **Services**: ProductService, OrderCheckoutService (new if needed)
- **Routes**: Child routes under `:shopSlug` dynamic segment
- **Status**: Components exist in `src/app/features/customer/`; will be moved to `modules/customer/components/`

### Seller Module Scope
- **Components**: Login, Seller Header, Dashboard, Products Management, Orders Management
- **Services**: SellerProductService, SellerOrderService, SellerAnalyticsService (new)
- **Routes**: Child routes under `seller/:shopSlug` with `sellerAuthGuard`
- **Status**: Components exist in `src/app/features/seller/`; will be moved to `modules/seller/components/`

### Admin Module Scope
- **Components**: Login, Admin Header, Sellers Management, Shops Management, Reports (new)
- **Services**: AdminSellerService, AdminShopService, AdminReportsService (new)
- **Routes**: Child routes under `admin/` with `adminAuthGuard`
- **Status**: Components exist in `src/app/features/admin/`; will be moved to `modules/admin/components/`

---

## Core Module - No Changes
- All existing services remain in `core/services/`
- All existing guards remain in `core/guards/`
- All existing models remain in `core/models/`
- **Key Services**: AuthService, FirebaseService, GlobalStateService, CartService, RazorpayService, WhatsAppService

---

## Shared Components Layer - Design Required

### Components to Extract
- **Header/Navigation**: Currently mixed into feature modules; should be centralized
- **Footer**: Shared across modules
- **Loader/Spinner**: Used globally
- **Error Dialog**: Generic error handling
- **Confirmation Dialog**: Delete operations, etc.

### Pipes to Extract
- **Price Format Pipe**: Used in customer & seller modules
- **Status Badge Pipe**: Used in seller & admin modules
- **Permission Badge Pipe**: Used in admin module
- **Truncate/Safe HTML Pipes**: Shared utilities

---

## Routing Strategy - Confirmed

- **Main routes in `app.routes.ts`**: Lazy-load each module via `loadChildren`
- **Module routes**: Each module files own `[module].routes.ts` with child route definitions
- **Route Guards**: Existing `sellerAuthGuard` and `adminAuthGuard` remain unchanged
- **Smart Root Component**: Existing `SmartRootComponent` in `features/home/` handles landing page logic

---

## Build Configuration - No Changes Required
- **Angular.json**: Current build configuration supports lazy-loading
- **tsconfig.json**: Already has `"strict": true` (verified in project)
- **Package.json**: No new dependencies needed (TypeScript, Angular, Firebase already present)

---

## Bundle Size Analysis

### Expected Post-Restructure (with lazy-loading)
- **Initial Bundle (main.js + shared)**: ~100-120KB gzipped (< 250KB target)
- **Customer Module Chunk**: ~40KB gzipped
- **Seller Module Chunk**: ~35KB gzipped
- **Admin Module Chunk**: ~25KB gzipped
- **Status**: Meets Constitution Principle II requirement (<250KB initial, <50KB per module)

---

## Test Coverage Strategy

### Existing Tests to Preserve
- Auth guard tests (already in `seller-auth.guard.spec.ts`, `admin-auth.guard.spec.ts`)
- Service tests (in `services/` directory)
- Karma configuration (karma.conf.js)

### New Tests Required
- Module lazy-loading verification (component loads when route activated)
- Shared component mounting tests
- Multi-tenant isolation tests (routes correctly filtered by shop/seller)

---

## Migration Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Breaking imports during migration | Keep old `features/` directory intact during phases 1-5, only delete after verification |
| Lazy-loading not working | Test each module route in Chrome DevTools (Network tab, Chunks) pre-commit |
| Missing barrel exports | Use explicit imports from component files (no `index.ts` re-exports) |
| Circular dependencies | Enforce: Core → Modules, Shared → no core dependencies |

---

## Next Steps (Phase 1)

1. ✅ Confirm module boundaries and entities (this document)
2. → Create `data-model.md` with entity definitions
3. → Create route contracts in `contracts/` directory
4. → Create `quickstart.md` with migration steps for developers
5. → Update agent context with module structure information

---

**Conclusion**: All unknowns resolved. Technical context is complete and well-defined. **READY FOR PHASE 1 DESIGN.**
