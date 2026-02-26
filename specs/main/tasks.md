# Tasks: WhatsApp Orders - Module-Based Restructuring

**Input**: Design documents from `/specs/main/`  
**Status**: Generated for Phase 2 Implementation  
**Date**: 2026-02-26

**Tech Stack**: Angular 17+, Firebase (Firestore + Auth), Razorpay, TypeScript  
**Project Structure**: Single Angular application with modular architecture

---

## Overview: Phase 2 - Implementation Tasks

This task list implements the modularization of the WhatsApp Orders platform from a monolithic `features/` structure to a clean, scalable `modules/` architecture with proper separation of concerns.

### Implementation Strategy

**MVP Scope**: Complete User Stories 1-5 (Core Restructuring)
- Phase 1-3: Setup and foundational work
- Phase 4-8: Core user stories (Customer, Seller, Admin modules)
- Phase 9-10: Polish and optional enhancements

**Parallel Execution**: Most file creation tasks are marked [P] and can be run in parallel per phase  
**Independence**: Each user story can be tested independently after completion

### User Story Dependency Graph

```
Phase 1: Setup
    ↓
Phase 2: Foundational (Core Services, Guards, Models - no changes needed)
    ↓
Phase 3: Module Restructuring [US1] (Directory structure, routing framework)
    ↓
├─→ Phase 4: Shared Components [US2] (Pipes, directives, utilities)
├─→ Phase 5: Customer Module [US3] (Home, Products, Cart, Checkout)
├─→ Phase 6: Seller Module [US4] (Dashboard, Products, Orders)
└─→ Phase 7: Admin Module [US5] (Sellers, Shops, Reports)
    ↓
Phase 8: Seller Analytics [US6] (Optional for MVP)
    ↓
Phase 9: Admin Reports [US7] (Optional for MVP)
    ↓
Phase 10: Polish & Cross-Cutting Concerns
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new directory structure and configuration files  
**Estimated Duration**: 30 minutes
**Status**: ✅ COMPLETE

- [x] T001 Create customer module directory structure in src/app/modules/customer/{components,services,pipes}
- [x] T002 Create seller module directory structure in src/app/modules/seller/{components,services,pipes}
- [x] T003 Create admin module directory structure in src/app/modules/admin/{components,services,pipes}
- [x] T004 [P] Create shared module directory structure in src/app/shared/{components,pipes,directives,utilities}
- [x] T005 Create module routing files: src/app/modules/customer/customer.routes.ts, seller/seller.routes.ts, admin/admin.routes.ts
- [x] T006 Update main app.routes.ts to lazy-load modules as children

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify core infrastructure - Core services are already implemented  
**Status**: ✅ No changes needed - existing implementation is correct

**Already Complete**:
- ✅ Core models in `src/app/core/models/`
- ✅ Authentication service in `src/app/core/services/auth.service.ts`
- ✅ Firebase service in `src/app/core/services/firebase.service.ts`
- ✅ Global state management in `src/app/core/services/global-state.service.ts`
- ✅ Auth guards: `seller-auth.guard.ts`, `admin-auth.guard.ts`
- ✅ Multi-tenant isolation via Firestore rules

**Checkpoint**: Foundation ready - User story implementation can now proceed in parallel

---

## Phase 3: User Story 1 - Module Restructuring & Routing (Priority: P1) 🎯 MVP

**Goal**: Establish module-based architecture with lazy-loaded routing for Customer, Seller, and Admin modules

**Independent Test**: Navigate to each module's routing path (`:shopSlug`, `seller/:shopSlug`, `admin/`) and verify layout components render
**Status**: ✅ COMPLETE

**Implementation for User Story 1**:

- [x] T007 [P] [US1] Create CustomerLayoutComponent as standalone in src/app/modules/customer/components/customer-layout/customer-layout.component.ts
- [x] T008 [P] [US1] Create SellerLayoutComponent as standalone in src/app/modules/seller/components/seller-layout/seller-layout.component.ts
- [x] T009 [P] [US1] Create AdminLayoutComponent as standalone in src/app/modules/admin/components/admin-layout/admin-layout.component.ts
- [x] T010 [P] [US1] Implement customer.routes.ts with all child routes (:shopSlug/home, products, product/:id, cart, checkout)
- [x] T011 [P] [US1] Implement seller.routes.ts with all child routes (login, :shopSlug/dashboard, products, orders, analytics)
- [x] T012 [P] [US1] Implement admin.routes.ts with all child routes (login, sellers, shops, reports)
- [x] T013 [US1] Update main app.routes.ts to integrate module routes: loadChildren for each module, update feature routing
- [x] T014 [US1] Verify lazy-loading configuration in angular.json for bundle optimization

**Checkpoint**: Module routing framework complete - all three modules accessible via their routes ✅

---

## Phase 4: User Story 2 - Shared Components & Utilities (Priority: P1) 🎯 MVP

**Goal**: Extract reusable components, pipes, directives, and utilities shared across all modules

**Independent Test**: Import and use shared components in other modules without circular dependencies; verify lazy-loaded bundles exclude shared component duplicates
**Status**: ✅ COMPLETE

**Implementation for User Story 2**:

### Shared Components

- [x] T015 [P] [US2] Extract HeaderComponent (universal header) to src/app/shared/components/header/header.component.ts
- [x] T016 [P] [US2] Extract/Create FooterComponent to src/app/shared/components/footer/footer.component.ts
- [x] T017 [P] [US2] Create LoaderComponent (spinner) in src/app/shared/components/loader/loader.component.ts
- [x] T018 [P] [US2] Create ErrorDialogComponent in src/app/shared/components/error-dialog/error-dialog.component.ts
- [x] T019 [P] [US2] Create ConfirmDialogComponent in src/app/shared/components/confirm-dialog/confirm-dialog.component.ts

### Shared Pipes

- [x] T020 [P] [US2] Create PriceFormatPipe in src/app/shared/pipes/price-format.pipe.ts (format currency)
- [x] T021 [P] [US2] Create StatusBadgePipe in src/app/shared/pipes/status-badge.pipe.ts (order/product status)
- [x] T022 [P] [US2] Create PermissionBadgePipe in src/app/shared/pipes/permission-badge.pipe.ts (admin permissions)
- [x] T023 [P] [US2] Create TruncatePipe in src/app/shared/pipes/truncate.pipe.ts (text truncation)
- [x] T024 [P] [US2] Create SafeHtmlPipe in src/app/shared/pipes/safe-html.pipe.ts (bypassSecurityTrustHtml wrapper)

### Shared Directives

- [x] T025 [P] [US2] Create DebounceDirective in src/app/shared/directives/debounce.directive.ts (input/scroll events)
- [x] T026 [P] [US2] Create ClickOutsideDirective in src/app/shared/directives/click-outside.directive.ts (close modals)

### Shared Utilities

- [x] T027 [P] [US2] Create custom form validators in src/app/shared/utilities/validators.ts
- [x] T028 [P] [US2] Create utility helper functions in src/app/shared/utilities/helpers.ts
- [x] T029 [US2] Create SharedModule or export all shared components/pipes/directives for consumption by other modules

**Checkpoint**: Shared components layer complete - all modules can import from shared without duplication ✅

---

## Phase 5: User Story 3 - Customer Module Implementation (Priority: P1) 🎯 MVP

**Goal**: Implement complete customer shopping interface with product browsing, cart, and checkout

**Independent Test**: 
1. Navigate to customer module (`:shopSlug`)
2. Verify home page displays featured products
3. Search/filter products, add to cart, proceed to checkout
4. Complete payment workflow via Razorpay

**Implementation for User Story 3**:

### Customer Components

- [x] T030 [P] [US3] Create HomeComponent in src/app/modules/customer/components/home/home.component.ts (featured products, shop showcase)
- [x] T031 [P] [US3] Create ProductsComponent in src/app/modules/customer/components/products/products.component.ts (catalog with filters, pagination)
- [x] T032 [P] [US3] Create ProductDetailsComponent in src/app/modules/customer/components/product-details/product-details.component.ts (single product view, reviews)
- [x] T033 [P] [US3] Create CartComponent in src/app/modules/customer/components/cart/cart.component.ts (review items, update quantities)
- [x] T034 [P] [US3] Create CheckoutComponent in src/app/modules/customer/components/checkout/checkout.component.ts (address, payment initiation)

### Customer Services

- [ ] T035 [US3] Create ProductService in src/app/modules/customer/services/product.service.ts with methods:
  - `getProducts(shopId): Observable<Product[]>`
  - `getProductById(shopId, id): Observable<Product>`
  - `getProductsByCategory(shopId, category): Observable<Product[]>`
  - `searchProducts(shopId, query): Observable<Product[]>`
  - `getFeaturedProducts(shopId): Observable<Product[]>`

- [ ] T036 [US3] Create OrderCheckoutService in src/app/modules/customer/services/order-checkout.service.ts with methods:
  - `prepareCheckout(shopId, cartItems): Observable<CheckoutPayload>`
  - `initiatePayment(orderId, amount): Observable<RazorpayOrder>`
  - `verifyPayment(orderId, paymentId): Observable<Order>`
  - `reconcilePayment(orderId): Observable<Order>`

### Customer Pipes

- [ ] T037 [P] [US3] Create or import PriceFormatPipe in src/app/modules/customer/pipes/ (reuse from shared)

### Customer Features

- [ ] T038 [US3] Integrate ProductService with HomeComponent for featured products display
- [ ] T039 [US3] Integrate ProductService with ProductsComponent for catalog rendering with category filters
- [ ] T040 [US3] Integrate CartService (from core) with CartComponent for item management
- [ ] T041 [US3] Integrate OrderCheckoutService with CheckoutComponent for payment processing
- [ ] T042 [US3] Implement multi-tenant isolation: all queries include `shopId` filter via GlobalStateService
- [ ] T043 [US3] Add error handling and loading states for all customer components

**Checkpoint**: Customer module fully functional - users can browse, search, cart, and checkout

---

## Phase 6: User Story 4 - Seller Module Implementation (Priority: P1) 🎯 MVP

**Goal**: Implement seller dashboard with product management and order fulfillment tracking

**Independent Test**:
1. Login as seller to seller/:shopSlug
2. View dashboard with sales metrics
3. Create/edit/delete products with inventory tracking
4. View and update order fulfillment status
5. Verify data isolation (seller only sees own shop's data)

**Implementation for User Story 4**:

### Seller Components

- [x] T044 [P] [US4] Create SellerLoginComponent in src/app/modules/seller/components/login/seller-login.component.ts (Firebase auth UI)
- [x] T045 [P] [US4] Create SellerHeaderComponent in src/app/modules/seller/components/seller-header/seller-header.component.ts (navigation, logout)
- [x] T046 [P] [US4] Create DashboardComponent in src/app/modules/seller/components/dashboard/dashboard.component.ts (KPIs, recent orders, quick stats)
- [x] T047 [P] [US4] Create ProductsManagementComponent in src/app/modules/seller/components/products-management/products-management.component.ts (product list, filters, import/export)
- [x] T048 [P] [US4] Create ProductEditComponent in src/app/modules/seller/components/products-management/product-edit.component.ts (create/edit form, inventory)
- [x] T049 [P] [US4] Create OrdersManagementComponent in src/app/modules/seller/components/orders-management/orders-management.component.ts (order list, status filters)
- [x] T050 [P] [US4] Create OrderDetailsComponent in src/app/modules/seller/components/orders-management/order-details.component.ts (fulfillment workflow, status updates)
- [x] T051 [P] [US4] Create AnalyticsComponent in src/app/modules/seller/components/analytics/analytics.component.ts (stub for US6)

### Seller Services

- [ ] T052 [US4] Create SellerProductService in src/app/modules/seller/services/seller-product.service.ts with methods:
  - `getProducts(shopId): Observable<SellerProduct[]>`
  - `getProductById(shopId, id): Observable<SellerProduct>`
  - `createProduct(shopId, product): Observable<string>`
  - `updateProduct(shopId, id, updates): Observable<void>`
  - `deleteProduct(shopId, id): Observable<void>`
  - `getInventoryStatus(shopId): Observable<InventoryStatus[]>`

- [ ] T053 [US4] Create SellerOrderService in src/app/modules/seller/services/seller-order.service.ts with methods:
  - `getOrders(shopId, filters?: OrderFilter): Observable<SellerOrder[]>`
  - `getOrderDetails(shopId, orderId): Observable<SellerOrder>`
  - `updateOrderStatus(shopId, orderId, status): Observable<void>`
  - `getOrderMetrics(shopId): Observable<OrderMetrics>`
  - `prepareFulfillment(shopId, orderId): Observable<FulfillmentPayload>`

### Seller Pipes

- [ ] T054 [P] [US4] Create or import StatusBadgePipe in src/app/modules/seller/pipes/ (reuse from shared)

### Seller Features

- [ ] T055 [US4] Integrate SellerProductService with ProductsManagementComponent for CRUD operations
- [ ] T056 [US4] Integrate SellerProductService with ProductEditComponent for form population and validation
- [ ] T057 [US4] Integrate SellerOrderService with OrdersManagementComponent for order listing
- [ ] T058 [US4] Integrate SellerOrderService with OrderDetailsComponent for fulfillment workflow
- [ ] T059 [US4] Integrate SellerOrderService with DashboardComponent for KPI calculations
- [ ] T060 [US4] Implement multi-tenant isolation: all queries filter by authenticated `shopId` from GlobalStateService
- [ ] T061 [US4] Add error handling, loading states, and success notifications for all seller operations
- [ ] T062 [US4] Add confirmation dialogs for destructive actions (delete product, cancel order)

**Checkpoint**: Seller module fully functional - sellers can manage products and fulfill orders

---

## Phase 7: User Story 5 - Admin Module Implementation (Priority: P1) 🎯 MVP

**Goal**: Implement admin panel for seller account management, shop configuration, and platform monitoring

**Independent Test**:
1. Login as admin to `/admin`
2. View list of all sellers and shops
3. Approve/disable sellers
4. Update shop commission rates
5. View platform reports (stub)
6. Verify admin-only data access (cannot access seller data)

**Implementation for User Story 5**:

### Admin Components

- [x] T063 [P] [US5] Create AdminLoginComponent in src/app/modules/admin/components/login/admin-login.component.ts (Firebase auth UI)
- [x] T064 [P] [US5] Create AdminHeaderComponent in src/app/modules/admin/components/admin-header/admin-header.component.ts (navigation, system alerts)
- [x] T065 [P] [US5] Create SellersManagementComponent in src/app/modules/admin/components/sellers-management/sellers-management.component.ts (seller list, status)
- [x] T066 [P] [US5] Create SellerDetailsComponent in src/app/modules/admin/components/sellers-management/seller-details.component.ts (account details, permissions, actions)
- [x] T067 [P] [US5] Create ShopsManagementComponent in src/app/modules/admin/components/shops-management/shops-management.component.ts (shop list, commission rates)
- [x] T068 [P] [US5] Create ShopDetailsComponent in src/app/modules/admin/components/shops-management/shop-details.component.ts (shop config, risk assessment)
- [x] T069 [P] [US5] Create ReportsComponent in src/app/modules/admin/components/reports/reports.component.ts (platform analytics stub)

### Admin Services

- [ ] T070 [US5] Create AdminSellerService in src/app/modules/admin/services/admin-seller.service.ts with methods:
  - `getSellers(filters?: SellerFilter): Observable<SellerAccount[]>`
  - `getSellerDetails(userId): Observable<SellerProfile>`
  - `approveSeller(userId): Observable<void>`
  - `disableSeller(userId, reason): Observable<void>`
  - `updatePermissions(userId, permissions): Observable<void>`
  - `resetPassword(userId): Observable<void>`
  - `getFinancialSummary(userId): Observable<FinancialSummary>`

- [ ] T071 [US5] Create AdminShopService in src/app/modules/admin/services/admin-shop.service.ts with methods:
  - `getShops(filters?: ShopFilter): Observable<Shop[]>`
  - `getShopDetails(shopId): Observable<Shop>`
  - `updateCommissionRate(shopId, rate): Observable<void>`
  - `suspendShop(shopId, reason): Observable<void>`
  - `reactivateShop(shopId): Observable<void>`
  - `getAuditLogs(shopId): Observable<AuditLog[]>`

### Admin Pipes

- [ ] T072 [P] [US5] Create or import PermissionBadgePipe in src/app/modules/admin/pipes/ (reuse from shared)

### Admin Features

- [ ] T073 [US5] Integrate AdminSellerService with SellersManagementComponent for seller list and bulk actions
- [ ] T074 [US5] Integrate AdminSellerService with SellerDetailsComponent for account management
- [ ] T075 [US5] Integrate AdminShopService with ShopsManagementComponent for shop list
- [ ] T076 [US5] Integrate AdminShopService with ShopDetailsComponent for shop configuration
- [ ] T077 [US5] Add admin-only data isolation: verify role === 'admin' via AuthService before loading admin data
- [ ] T078 [US5] Implement action confirmations and audit logging for sensitive operations
- [ ] T079 [US5] Add error handling and success notifications for all admin operations

**Checkpoint**: Admin module fully functional - admins can manage platform

---

## Phase 8: User Story 6 - Seller Analytics Service (Priority: P2)

**Goal**: Implement sales metrics, product analytics, and revenue reporting for sellers

**Independent Test**: Navigate to seller analytics page, verify charts render with correct data, filters work, export functionality available

**Implementation for User Story 6**:

- [ ] T080 [US6] Create SellerAnalyticsService in src/app/modules/seller/services/seller-analytics.service.ts with methods:
  - `getSalesMetrics(shopId, dateRange): Observable<SalesMetrics>`
  - `getTopProducts(shopId, limit): Observable<ProductAnalytics[]>`
  - `getRevenueChart(shopId, period): Observable<ChartData>`
  - `getCustomerMetrics(shopId): Observable<CustomerMetrics>`
  - `exportSalesReport(shopId, format): Observable<Blob>`

- [ ] T081 [US6] Implement sales metrics calculations (total revenue, orders count, avg order value)
- [ ] T082 [US6] Implement product performance analytics (top sellers, slow movers, reviews)
- [ ] T083 [US6] Integrate SellerAnalyticsService with AnalyticsComponent
- [ ] T084 [US6] Add date range pickers and filtering UI
- [ ] T085 [US6] Add chart visualization (using a charting library)
- [ ] T086 [US6] Add export to CSV/PDF functionality

---

## Phase 9: User Story 7 - Admin Reports Service (Priority: P2)

**Goal**: Implement platform-wide analytics, fraud detection, and business intelligence

**Independent Test**: Navigate to admin reports, verify platform metrics display, trend analysis available

**Implementation for User Story 7**:

- [ ] T087 [US7] Create AdminReportsService in src/app/modules/admin/services/admin-reports.service.ts with methods:
  - `getRevenueMetrics(dateRange): Observable<RevenueMetrics>`
  - `getSellerRankings(limit): Observable<SellerRanking[]>`
  - `getPaymentMetrics(): Observable<PaymentMetrics>`
  - `detectFraudPatterns(): Observable<FraudAlert[]>`
  - `getSystemHealthMetrics(): Observable<HealthMetrics>`

- [ ] T088 [US7] Implement revenue tracking across all shops
- [ ] T089 [US7] Implement seller performance rankings (by revenue, ratings, orders)
- [ ] T090 [US7] Implement payment success rate and dispute tracking
- [ ] T091 [US7] Implement fraud pattern detection (duplicate orders, chargebacks, etc.)
- [ ] T092 [US7] Integrate AdminReportsService with ReportsComponent
- [ ] T093 [US7] Add real-time dashboard updates via Firestore listeners
- [ ] T094 [US7] Add export and scheduled report email functionality

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Testing, optimization, documentation, and final verification

### Testing & Quality Assurance

- [ ] T095 [P] Run unit tests for all services: `ng test --watch=false`
- [ ] T096 [P] Run integration tests for module routing and lazy-loading
- [ ] T097 [P] Verify bundle size meets targets (<250KB initial, <50KB per module): `ng build --prod --stats-json`
- [ ] T098 [P] Test multi-tenant isolation: verify sellers cannot access other shops' data
- [ ] T099 [P] Test role-based access: verify guards prevent unauthorized access
- [ ] T100 [P] Manual E2E testing: complete full user journeys for each role

### Optimization & Performance

- [ ] T101 [P] Optimize component change detection: review OnPush strategy adoption
- [ ] T102 [P] Implement route preloading strategy (optional for secondary routes)
- [ ] T103 [P] Add service worker for offline capability (if required)
- [ ] T104 [P] Optimize Firestore queries: add composite indexes for common filters

### Documentation & Migration

- [ ] T105 Create MIGRATION-GUIDE.md documenting old features/ → new modules/ mapping
- [ ] T106 Update ARCHITECTURE.md with new module structure and import rules
- [ ] T107 Update README.md with module overview and developer setup
- [ ] T108 Add JSDoc comments to all public service methods
- [ ] T109 Create component stories/examples for shared components
- [ ] T110 Document breaking changes in CHANGELOG.md

### Cleanup & Decommissioning (Phase 6 after verification)

- [ ] T111 (Deferred) Backup old features/ directory: `git archive`
- [ ] T112 (Deferred) Remove features/ directory after Phase 5+ verification
- [ ] T113 (Deferred) Remove feature.routes.ts from app.routes.ts after module routes verified
- [ ] T114 (Deferred) Clean up unused imports and lint warnings

**Checkpoint**: Application fully restructured, tested, and documented

---

## Dependencies & Parallel Opportunities

### Phase-Level Dependencies

```
Phase 1 (Setup) → REQUIRED FOR ALL
    ↓
Phase 2 (Foundational) → REQUIRED FOR ALL
    ↓
Phase 3 (US1: Module Routing) → REQUIRED FOR:
    ├─→ Phase 4 (US2: Shared Components) → Can start once T013 complete
    ├─→ Phase 5 (US3: Customer Module) → Can start once T013 complete
    ├─→ Phase 6 (US4: Seller Module) → Can start once T013 complete
    └─→ Phase 7 (US5: Admin Module) → Can start once T013 complete
    ↓
Phase 8 (US6: Seller Analytics) → Depends on US4 completion
Phase 9 (US7: Admin Reports) → Depends on US5 completion
    ↓
Phase 10 (Polish) → Can occur concurrently with later user story implementation
```

### Parallel Execution Examples

**After Phase 1 Complete**:
- T007-T009 (layout components) can run in parallel
- T010-T012 (route definitions) can run in parallel

**After Phase 3 Complete**:
- Phase 4, 5, 6, 7 component creation can run in parallel (different files, different modules)
- Each phase's component tasks [P] marked can run in parallel within phase

**Within Phase 5-7**:
- All component creation tasks (T030-T051, T063-T068) are [P] and can run in parallel
- Service tasks depend on component structure but not on other services

### Non-Blocking Tasks
- All documentation tasks (Phase 10: T105-T109) can start after Phase 3
- Bundle size optimization (T102) can occur after Phase 7 major features complete

---

## Success Criteria & Checkpoints

✅ **Phase 1**: New directory structure created, no errors on `ng build`

✅ **Phase 2**: Foundation verified, existing services remain in place

✅ **Phase 3**: 
- Routes accessible: `:shopSlug`, `seller/:shopSlug`, `admin/`
- Lazy-loading confirmed in DevTools Network tab
- Layout components render correctly

✅ **Phase 4**:
- No duplicate component instances in bundles
- Shared components importable from other modules
- No circular dependencies detected

✅ **Phase 5**:
- Customer can browse products, add to cart, checkout
- Payment flow works end-to-end via Razorpay
- Multi-tenant isolation verified (cart isolated by shopId)

✅ **Phase 6**:
- Seller can login and access dashboard
- Product CRUD operations work
- Order status updates reflected in real-time

✅ **Phase 7**:
- Admin can login and see seller/shop lists
- Commission rate updates apply correctly
- Role-based access enforced (admin ≠ seller)

✅ **Phase 8**:
- Analytics page loads and displays metrics
- Charts render with correct data
- Export functionality works

✅ **Phase 9**:
- Platform reports accessible
- Fraud detection algorithms working
- Real-time updates flowing

✅ **Phase 10**:
- All unit tests passing
- Bundle size within targets
- Documentation complete
- Zero migration blockers identified

---

## Rollout Strategy

### MVP Release (Phases 1-7)
- Deploy modular structure with all three modules functioning
- Estimated effort: 40-50 hours sprinted over 2 weeks
- Risk: Medium (significant refactoring, but no business logic changes)
- Rollback: Keep `features/` directory until Phase 10 verification complete

### Phase 2 Enhancement (Phases 8-9)
- Add seller analytics and admin reporting after MVP stabilizes
- Estimated effort: 10-15 hours
- Risk: Low (additive features)

### Phase 3 Cleanup (Phase 10)
- Remove legacy `features/` directory, finalize documentation
- Estimated effort: 5 hours
- Risk: Low (cleanup only)

---

## Task Status Legend

| Status | Meaning |
|--------|---------|
| `- [ ]` | Not started |
| `- [x]` | Completed |
| `[P]` | Can run in parallel (different files) |
| `[US1-7]` | Belongs to User Story (US1 = Module Restructuring, US2 = Shared Components, US3 = Customer, US4 = Seller, US5 = Admin, US6 = Seller Analytics, US7 = Admin Reports) |

---

**Generated**: 2026-02-26  
**Based on**: plan.md, research.md, data-model.md, contracts/  
**Template**: `.specify/templates/tasks-template.md`
