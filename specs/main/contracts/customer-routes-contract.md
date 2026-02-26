# Customer Module Route Contract

**Module**: Customer Storefront  
**Purpose**: Public-facing shopping interface  
**Protection**: None (public routes)

---

## Route Structure

```typescript
export const CUSTOMER_ROUTES: Routes = [
  {
    path: ':shopSlug',
    component: CustomerLayoutComponent, // or loadComponent
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
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
      },
      {
        path: 'checkout',
        loadComponent: () => import('./components/checkout/checkout.component')
          .then(m => m.CheckoutComponent)
      }
    ]
  }
];
```

---

## Route Examples

| Path | Component | Purpose |
|------|-----------|---------|
| `/my-shop` | CustomerLayoutComponent | Shop wrapper |
| `/my-shop/home` | HomeComponent | Shop homepage & featured products |
| `/my-shop/products` | ProductsComponent | Product catalog with filters |
| `/my-shop/product/abc123` | ProductDetailsComponent | Individual product view |
| `/my-shop/cart` | CartComponent | Review shopping cart |
| `/my-shop/checkout` | CheckoutComponent | Confirm order & payment |

---

## Service Contracts

### ProductService
```typescript
interface IProductService {
  // Get all products for a shop
  getProducts(shopId: string): Observable<Product[]>;
  
  // Get product by ID
  getProductById(shopId: string, productId: string): Observable<Product>;
  
  // Filter by category
  getProductsByCategory(shopId: string, category: string): Observable<Product[]>;
  
  // Search products
  searchProducts(shopId: string, query: string): Observable<Product[]>;
  
  // Get featured products
  getFeaturedProducts(shopId: string): Observable<Product[]>;
}
```

### OrderCheckoutService
```typescript
interface IOrderCheckoutService {
  // Initiate checkout from cart
  prepareCheckout(shopId: string, items: CartItem[]): Observable<CheckoutPayload>;
  
  // Initiate Razorpay payment
  initiatePayment(orderId: string, amount: number): Observable<RazorpayOrder>;
  
  // Verify payment & create order
  verifyPayment(orderId: string, paymentId: string): Observable<Order>;
  
  // Get order status
  getOrderStatus(orderId: string): Observable<OrderStatus>;
}
```

---

## Input Contracts (Forms)

### Cart Component Input
```typescript
@Input() items: CartItem[]; // From GlobalStateService
@Input() totalPrice: number;
@Input() taxRate: number;
```

### Checkout Component Input
```typescript
@Input() order: Order;
@Input() customer: Customer;
@Output() paymentInitiated = new EventEmitter<PaymentRequest>();
```

---

## Data Flow

```
HomeComponent
    ↓
ProductsComponent (displays products via ProductService)
    ↓
ProductDetailsComponent (detail view, "Add to Cart" → CartService)
    ↓
CartComponent (review cart from GlobalStateService)
    ↓
CheckoutComponent (finalize order, call OrderCheckoutService)
    ↓
Razorpay Payment Modal (in browser)
    ↓
OrderCheckoutService.verifyPayment() → Create Order in Firestore
    ↓
Order Confirmation (WhatsApp/Email)
```

---

## Error Handling

| Error | Status | Handler |
|-------|--------|---------|
| Product not found | 404 | Redirect to products catalog |
| Cart empty | 400 | Show "Add products" message |
| Payment failed | 402 | Show retry button with error details |
| Network error | Network error | Show "Offline" cached state |

---

## Performance Requirements

- **Home load time**: < 2s (with lazy loading + Firestore caching)
- **Product list**: Pagination (20 items/page)
- **Checkout flow**: < 3 hops (cart → confirm → payment)

---

**Contract Version**: 1.0 | **Last Updated**: 2026-02-26
