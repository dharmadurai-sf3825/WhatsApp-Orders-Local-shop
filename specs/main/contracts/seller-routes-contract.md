# Seller Module Route Contract

**Module**: Seller Dashboard  
**Purpose**: Shop management & order fulfillment  
**Protection**: `sellerAuthGuard` (role === 'seller')

---

## Route Structure

```typescript
export const SELLER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/seller-login.component')
      .then(m => m.SellerLoginComponent)
  },
  {
    path: ':shopSlug',
    canActivate: [sellerAuthGuard],
    component: SellerLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
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
        path: 'products/:id/edit',
        loadComponent: () => import('./components/products-management/product-edit.component')
          .then(m => m.ProductEditComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/orders-management/orders-management.component')
          .then(m => m.OrdersManagementComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./components/orders-management/order-details.component')
          .then(m => m.OrderDetailsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./components/analytics/analytics.component')
          .then(m => m.AnalyticsComponent)
      }
    ]
  }
];
```

---

## Route Examples

| Path | Component | Protection | Purpose |
|------|-----------|-----------|---------|
| `/seller/login` | SellerLoginComponent | None | Firebase login |
| `/seller/my-shop` | SellerLayoutComponent | sellerAuthGuard | Dashboard wrapper |
| `/seller/my-shop/dashboard` | DashboardComponent | sellerAuthGuard | Overview & daily metrics |
| `/seller/my-shop/products` | ProductsManagementComponent | sellerAuthGuard | Inventory & CRUD |
| `/seller/my-shop/products/abc/edit` | ProductEditComponent | sellerAuthGuard | Edit product form |
| `/seller/my-shop/orders` | OrdersManagementComponent | sellerAuthGuard | Order list & status |
| `/seller/my-shop/orders/xyz` | OrderDetailsComponent | sellerAuthGuard | Fulfill order |
| `/seller/my-shop/analytics` | AnalyticsComponent | sellerAuthGuard | Sales reports |

---

## Service Contracts

### SellerProductService
```typescript
interface ISellerProductService {
  // Get seller's products
  getProducts(shopId: string): Observable<SellerProduct[]>;
  
  // Get product details
  getProductById(shopId: string, productId: string): Observable<SellerProduct>;
  
  // Create new product
  createProduct(shopId: string, product: SellerProduct): Observable<string>; // returns productId
  
  // Update product
  updateProduct(shopId: string, productId: string, updates: Partial<SellerProduct>): Observable<void>;
  
  // Delete product
  deleteProduct(shopId: string, productId: string): Observable<void>;
  
  // Get inventory status
  getInventory(shopId: string): Observable<InventoryStatus[]>;
  
  // Update inventory (stock adjust)
  updateStock(shopId: string, productId: string, quantity: number): Observable<void>;
}
```

### SellerOrderService
```typescript
interface ISellerOrderService {
  // Get orders for shop
  getOrders(shopId: string, filters?: OrderFilter): Observable<SellerOrder[]>;
  
  // Get order details
  getOrderDetails(shopId: string, orderId: string): Observable<SellerOrder>;
  
  // Update order status
  updateOrderStatus(shopId: string, orderId: string, status: OrderStatus): Observable<void>;
  
  // Mark order prepared
  markPrepared(shopId: string, orderId: string): Observable<void>;
  
  // Mark order picked up
  markPickedUp(shopId: string, orderId: string): Observable<void>;
  
  // Cancel order
  cancelOrder(shopId: string, orderId: string, reason: string): Observable<void>;
}
```

### SellerAnalyticsService (NEW)
```typescript
interface ISellerAnalyticsService {
  // Get sales metrics for date range
  getSalesMetrics(shopId: string, startDate: Date, endDate: Date): Observable<SalesMetrics>;
  
  // Get top selling products
  getTopProducts(shopId: string, limit: number = 10): Observable<ProductMetrics[]>;
  
  // Get revenue chart data
  getRevenueChart(shopId: string, period: 'daily' | 'weekly' | 'monthly'): Observable<ChartData>;
  
  // Get customer insights
  getCustomerInsights(shopId: string): Observable<CustomerStats>;
  
  // Get order fulfillment metrics
  getFulfillmentMetrics(shopId: string): Observable<FulfillmentStats>;
}
```

---

## Data Contracts (Forms)

### Product Edit Form
```typescript
interface ProductForm {
  name: string;
  description: string;
  price: number;
  costPrice: number; // seller-specific
  category: string;
  sku: string;       // seller-specific
  stock: number;
  images: File[];
  isActive: boolean;
}
```

### Order Status Update Form
```typescript
interface OrderStatusUpdate {
  status: OrderStatus;
  notes?: string;
  preparedAt?: Date;
  pickedUpAt?: Date;
  cancelReason?: string;
}
```

---

## Guard Contract

### sellerAuthGuard
```typescript
import { CanActivateFn } from '@angular/router';

export const sellerAuthGuard: CanActivateFn = (route, state) => {
  // Validates:
  // 1. User is authenticated (Firebase)
  // 2. User role === 'seller'
  // 3. User owns the shop in :shopSlug param
  
  // Returns: true (allowed) | false (redirects to login) | UrlTree (redirect)
};
```

---

## Error Handling

| Error | Status | Handler |
|-------|--------|---------|
| Not authenticated | 401 | Redirect to `/seller/login` |
| Not a seller account | 403 | Show "Access Denied" |
| Shop doesn't match user | 403 | Firestore rule blocks; redirect to shop list |
| Product not found | 404 | Redirect to products list |
| Network error | Network | Show offline state, queue updates |

---

## Performance Requirements

- **Dashboard load**: < 3s (real-time metrics from Firestore)
- **Products list**: Pagination (20 items/page)
- **Order fulfillment**: < 1s (mark prepared/picked up)
- **Analytics**: < 5s (date range aggregation)

---

**Contract Version**: 1.0 | **Last Updated**: 2026-02-26
