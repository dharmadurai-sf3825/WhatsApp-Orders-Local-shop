# Phase 1: Data Model & Entity Dictionary

**Status**: COMPLETE | **Date**: 2026-02-26

---

## Module Entities Overview

The module structure organizes features around three primary user roles. Each module has its own components and services, but **shares the same core models** from `core/models/`.

---

## Customer Module Entities

### Primary Entities
- **Product**: Represents items available for sale in a shop
  - Fields: `id`, `shopId`, `name`, `description`, `price`, `category`, `images[]`, `stock`, `rating`, `reviews[]`
  - Source: `/core/models/product.model.ts` (shared)

- **Order**: Customer's purchase record
  - Fields: `id`, `shopId`, `customerId`, `items[]`, `totalAmount`, `status`, `paymentStatus`, `createdAt`, `deliveryAddress`, `notes`
  - Source: `/core/models/order.model.ts` (shared)

- **Cart**: Session-specific shopping cart (temporary)
  - Fields: `items[]` (ProductId + quantity), `totalPrice`, `lastUpdated`
  - Source: Managed by `GlobalStateService` in core

- **Shop**: Shop metadata
  - Fields: `id`, `slug`, `name`, `categories[]`, `location`, `phone`, `whatsappNumber`, `description`
  - Source: `/core/models/shop.model.ts` (shared)

### Customer-Specific Services

| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `ProductService` | Fetch & filter products by shop & category | `getProducts()`, `getProductById()`, `filterByCategory()` |
| `OrderCheckoutService` | Convert cart to order, process payment | `createOrder()`, `initiatePayment()`, `reconcilePayment()` |

### Customer Components & Routes

```
modules/customer/
├── customer.routes.ts
│   ├── home/{home.component.ts, home.component.html}
│   ├── products/{products.component.ts}
│   ├── product-details/{product-details.component.ts}
│   ├── cart/{cart.component.ts}
│   └── checkout/{checkout.component.ts}
├── services/
│   ├── product.service.ts
│   └── order-checkout.service.ts
└── pipes/
    └── price-format.pipe.ts
```

---

## Seller Module Entities

### Primary Entities
- **SellerProfile**: Individual seller account metadata
  - Fields: `userId`, `shopId`, `email`, `phone`, `name`, `role` (always 'seller'), `createdAt`, `permissions[]`
  - Source: Subset of `/core/models/user.model.ts` (shared auth info)

- **SellerProduct**: Product with seller-specific metadata (inventory, SKU, cost)
  - Fields: Extends `Product` with `costPrice`, `sku`, `vendorRef`, `inventoryCount`, `reorderLevel`
  - Source: Custom to seller module

- **SellerOrder**: Order from seller's perspective (fulfillment tracking)
  - Fields: Extends `Order` with `fulfillmentStatus`, `preparedBy`, `readyAt`, `pickedUpAt`, `cancelReason`
  - Source: Custom to seller module

- **Shop**: Same as Customer module (shared)
  - Source: `/core/models/shop.model.ts` (shared)

### Seller-Specific Services

| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `SellerProductService` | CRUD operations for seller's products | `createProduct()`, `updateProduct()`, `deleteProduct()`, `getInventory()` |
| `SellerOrderService` | Track & fulfill orders | `getOrders()`, `updateOrderStatus()`, `getOrderDetails()` |
| `SellerAnalyticsService` | Sales metrics & reporting (NEW) | `getSalesMetrics()`, `getTopProducts()`, `getRevenueChart()` |

### Seller Components & Routes

```
modules/seller/
├── seller.routes.ts
│   ├── login/{login.component.ts}
│   ├── seller-header/{seller-header.component.ts}
│   ├── dashboard/{dashboard.component.ts}
│   ├── products-management/{products-management.component.ts}
│   ├── orders-management/{orders-management.component.ts}
│   └── analytics/{analytics.component.ts}
├── services/
│   ├── seller-product.service.ts
│   ├── seller-order.service.ts
│   └── seller-analytics.service.ts
└── pipes/
    └── status-badge.pipe.ts
```

---

## Admin Module Entities

### Primary Entities
- **AdminProfile**: Admin account metadata
  - Fields: `userId`, `email`, `role` (always 'admin'), `permissions[]` (e.g., 'manage_sellers', 'view_reports'), `createdAt`
  - Source: Subset of `/core/models/user.model.ts` (shared auth)

- **SellerAccount**: Admin's view of seller accounts
  - Fields: `id`, `email`, `phone`, `shopId`, `shopName`, `status` (active/disabled), `commissionRate`, `createdAt`, `lastLogin`, `totalOrders`
  - Source: Custom to admin module

- **Shop**: Shop configuration from admin perspective
  - Fields: Extends shop model with `commissionRate`, `isActive`, `suspendedReason`, `totalRevenue`, `riskScore`
  - Source: `/core/models/shop.model.ts` (shared, extended with admin fields)

- **AdminReport**: Platform-wide metrics (NEW)
  - Fields: `date`, `totalOrders`, `totalRevenue`, `activeShops`, `newSellers`, `paymentMetrics`, `supportTickets`
  - Source: Custom to admin module

### Admin-Specific Services

| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `AdminSellerService` | Manage seller accounts & permissions | `getSellers()`, `approveSeller()`, `disableSeller()`, `resetPassword()` |
| `AdminShopService` | Shop configuration & monitoring | `getShops()`, `updateCommissionRate()`, `suspendShop()`, `auditLogs()` |
| `AdminReportsService` | Platform analytics (NEW) | `getRevenueMetrics()`, `getSellerRankings()`, `detectFraudPatterns()` |

### Admin Components & Routes

```
modules/admin/
├── admin.routes.ts
│   ├── login/{login.component.ts}
│   ├── admin-header/{admin-header.component.ts}
│   ├── sellers-management/{sellers-management.component.ts}
│   ├── shops-management/{shops-management.component.ts}
│   └── reports/{reports.component.ts}
├── services/
│   ├── admin-seller.service.ts
│   ├── admin-shop.service.ts
│   └── admin-reports.service.ts
└── pipes/
    └── permission-badge.pipe.ts
```

---

## Shared Components & Utilities

```
modules/shared/
├── components/
│   ├── header/{header.component.ts}              # Universal header component
│   ├── footer/{footer.component.ts}              # Footer (if used)
│   ├── loader/{loader.component.ts}              # Spinner/Loading indicator
│   ├── error-dialog/{error-dialog.component.ts}  # Error notification
│   └── confirm-dialog/{confirm-dialog.component.ts}
├── pipes/
│   ├── price-format.pipe.ts                      # Format currency
│   ├── status-badge.pipe.ts                      # Order/product status display
│   ├── permission-badge.pipe.ts                  # Admin permission display
│   ├── truncate.pipe.ts                          # Text truncation utility
│   └── safe-html.pipe.ts                         # Angular bypassSecurityTrustHtml wrapper
├── directives/
│   ├── debounce.directive.ts                     # Debounce input/scroll events
│   └── click-outside.directive.ts                # Close modals on outside click
└── utilities/
    ├── validators.ts                             # Custom Form validators
    └── helpers.ts                                # Utility functions
```

---

## Core Module (Unchanged - for reference)

```
core/
├── models/
│   ├── order.model.ts      # Order, OrderItem, OrderStatus
│   ├── product.model.ts    # Product, Category
│   ├── shop.model.ts       # Shop, Location
│   ├── user.model.ts       # User, UserRole, Permissions
│   └── payment.model.ts    # Payment, PaymentStatus, Transaction
├── guards/
│   ├── seller-auth.guard.ts    # Protects seller routes (role==='seller')
│   └── admin-auth.guard.ts     # Protects admin routes (role==='admin')
├── services/
│   ├── auth.service.ts         # Firebase Auth + role management
│   ├── firebase.service.ts     # Firestore CRUD + multi-tenant queries
│   ├── global-state.service.ts # App-wide state (currentShop, currentUser, cart)
│   ├── language.service.ts     # i18n support
│   ├── cart.service.ts         # Cart state management
│   ├── razorpay.service.ts     # Payment processing
│   └── whatsapp.service.ts     # WhatsApp integration
└── interceptors/
    └── [auto-attached to HttpClient]
```

---

## Module Import Rules (Enforcement)

### Allowed
✅ Module can import from `core/` (models, services, guards)  
✅ Module can import from `shared/` (components, pipes, directives)  
✅ Module can import from sibling modules (e.g., seller → customer is **not allowed**)  
✅ Core can import from `core/` only  
✅ Shared can import from `core/` only

### Not Allowed
❌ Module importing from another module (create shared component instead)  
❌ Core importing from modules or shared  
❌ Circular dependencies (A ← B ← A)

---

## Database Schema (Firestore Collections - No Changes)

Collections remain unchanged from current implementation:
- `users/{userId}` - User profiles with role
- `shops/{shopId}` - Shop metadata
- `products/{shopId}/products/{productId}` - Products per shop
- `orders/{shopId}/orders/{orderId}` - Orders per shop
- `payments/{paymentId}` - Payment records

**Multi-Tenant Isolation**: Every query includes `where('shopId', '==', currentShopId)` to enforce boundaries.

---

## State Management Flow

```
GlobalStateService (core)
├── currentShop: BehaviorSubject<Shop>
├── currentUser: BehaviorSubject<User>
├── cart: BehaviorSubject<CartItem[]>
└── userRole: BehaviorSubject<'customer' | 'seller' | 'admin'>

Module-Specific State (in module services)
├── Customer: ProductService (product filters, pagination)
├── Seller: SellerProductService (inventory state), SellerAnalyticsService (metrics)
└── Admin: AdminReportsService (report filters, time ranges)
```

---

## Entity Validation Rules

| Entity | Rule | Enforcement |
|--------|------|-------------|
| Order | `totalAmount > 0` | Form validator + Firestore rule |
| Product | `shopId` must match authenticated shop | Firestore security rule (read/write) |
| Payment | `orderId` must exist in same shop | Firestore rule + backend reconciliation |
| User | Role is immutable after creation | Firestore rule (deny update) |

---

## Conclusion

All entities are properly scoped to their modules. Core models are shared across all modules; module-specific extensions (e.g., `SellerProduct`) are defined in their respective modules. Import rules enforce module boundaries and prevent circular dependencies.

**Status**: Ready for Phase 1 contract definition.
