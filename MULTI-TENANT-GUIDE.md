# Multi-Tenant Architecture Guide

## Overview

This WhatsApp ordering system uses a **single-repository, multi-tenant architecture** that allows one codebase to serve multiple shops. Each shop has its own:
- Unique slug (URL identifier)
- WhatsApp business number
- Razorpay payment key
- Branding (name, colors, logo)
- Product catalog
- Order history

## Architecture Pattern

### Single Database, Multiple Shops
- All shops share the same Firebase Firestore database
- Data is filtered by `shopId` or `slug` fields
- Each document (product, order, etc.) has a reference to its shop

### URL-Based Shop Identification
The system supports three URL patterns to identify which shop the user is accessing:

1. **Query Parameter** (Recommended for development)
   ```
   https://yourapp.web.app/?shop=ganesh-bakery
   https://yourapp.web.app/?shop=anbu-grocery
   ```

2. **Path-Based** (SEO-friendly)
   ```
   https://yourapp.web.app/ganesh-bakery
   https://yourapp.web.app/anbu-grocery
   ```

3. **Subdomain-Based** (Professional)
   ```
   https://ganesh-bakery.yourapp.com
   https://anbu-grocery.yourapp.com
   ```

## Data Model

### Shop Model
```typescript
export interface Shop {
  id: string;                  // Unique shop ID (e.g., "shop-1")
  slug: string;                // URL-friendly identifier (e.g., "ganesh-bakery")
  name: string;                // Display name
  description?: string;
  address: string;
  phoneE164: string;          // WhatsApp number in E.164 format
  razorpayKeyId?: string;     // Shop-specific payment key
  upiId?: string;
  isActive: boolean;
  ownerId?: string;           // Reference to owner account
  createdAt?: Date;
  updatedAt?: Date;
  
  // Branding
  logo?: string;
  theme?: {
    primaryColor: string;
    accentColor: string;
  };
}
```

### Product Model
```typescript
export interface Product {
  id?: string;
  shopId: string;             // Links product to shop
  name: string;
  nameTA?: string;            // Tamil translation
  description?: string;
  descriptionTA?: string;
  category: string;
  categoryTA?: string;
  price: number;
  unit: string;               // "kg", "piece", "dozen"
  unitTA?: string;
  imageUrl?: string;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Order Model
Orders also have a `shopId` field to track which shop they belong to.

## Implementation Details

### 1. ShopService
**Location**: `src/app/core/services/shop.service.ts`

**Responsibilities**:
- Detect shop identifier from URL
- Load shop data from Firebase
- Provide current shop context throughout the app
- Apply shop-specific themes

**Key Methods**:
```typescript
// Initialize shop from URL
initializeShop(shopSlug?: string): void

// Get current shop (Observable)
currentShop$: BehaviorSubject<Shop | null>

// URL pattern detection
getShopFromPath(): string | null
getShopFromSubdomain(): string | null

// Theme management
applyShopTheme(shop: Shop): void
```

**Usage in Components**:
```typescript
constructor(private shopService: ShopService) {}

ngOnInit() {
  this.shopService.currentShop$.subscribe(shop => {
    if (shop) {
      // Load shop-specific data
      this.loadProducts(shop.id);
    }
  });
}
```

### 2. FirebaseService Updates
**Location**: `src/app/core/services/firebase.service.ts`

**New Methods**:
```typescript
// Get shop by slug
getShopBySlug(slug: string): Observable<Shop | null>

// Mock shops for development
getMockShopBySlug(slug: string): Observable<Shop | null>
```

**Existing Methods Updated**:
- `getProductsByShopId(shopId: string)` - Filter products by shop
- All data queries now include shop filtering

### 3. WhatsAppService Updates
**Location**: `src/app/core/services/whatsapp.service.ts`

**Changed Method Signatures**:
```typescript
// OLD: generateOrderLink(phoneNumber: string, ...)
// NEW: 
generateOrderLink(
  shop: Shop,                    // Full shop object
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  language?: 'en' | 'ta'
): string
```

**Benefits**:
- Includes shop name in WhatsApp message
- Uses shop-specific WhatsApp number
- More context for order processing

### 4. Component Updates

**AppComponent**:
- Initializes shop on app load
- Displays shop name in toolbar
- Subscribes to shop changes

**HomeComponent, ProductsComponent**:
- Get current shop from ShopService
- Filter products by shop ID
- Display shop-specific branding

**CartComponent**:
- Pass shop object to WhatsApp service
- Include shop name in order confirmation

## Configuration

### Mock Shops (Development)
**Location**: `src/app/core/services/firebase.service.ts` → `getMockShopBySlug()`

Currently configured shops:
1. **demo-shop** - Original demo shop
   - Phone: 918220762702
   - Theme: Red
   
2. **ganesh-bakery** - Bakery example
   - Phone: 918220762702
   - Theme: Red/Teal
   
3. **anbu-grocery** - Grocery store
   - Phone: 919876543210
   - Theme: Green
   
4. **kumar-restaurant** - Restaurant
   - Phone: 919887654321
   - Theme: Orange

### Production Firebase Setup
When moving to production Firestore:

1. **Create Shops Collection**:
   ```javascript
   // Firestore structure
   shops/
     ganesh-bakery/
       id: "shop-1"
       slug: "ganesh-bakery"
       name: "Ganesh Bakery"
       phoneE164: "918220762702"
       razorpayKeyId: "rzp_live_xxxxx"
       isActive: true
       theme: { primaryColor: "#d32f2f", accentColor: "#00897b" }
   ```

2. **Update Firestore Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Shop rules
       match /shops/{shopId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == resource.data.ownerId;
       }
       
       // Products rules
       match /products/{productId} {
         allow read: if request.auth != null;
         allow create, update: if request.auth != null && 
           request.auth.uid == get(/databases/$(database)/documents/shops/$(request.resource.data.shopId)).data.ownerId;
         allow delete: if request.auth != null && 
           request.auth.uid == get(/databases/$(database)/documents/shops/$(resource.data.shopId)).data.ownerId;
       }
       
       // Orders rules - similar pattern
       match /orders/{orderId} {
         allow create: if request.auth != null;
         allow read, update: if request.auth != null && 
           (request.auth.uid == resource.data.customerId || 
            request.auth.uid == get(/databases/$(database)/documents/shops/$(resource.data.shopId)).data.ownerId);
       }
     }
   }
   ```

## Routing Configuration

### Option 1: Query Parameter (Current - No changes needed)
Users access: `https://yourapp.web.app/?shop=ganesh-bakery`

### Option 2: Path-Based Routing (Recommended)
Update `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  // Shop-based routes
  {
    path: ':shopSlug',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
    ]
  },
  
  // Default route
  { path: '', component: ShopSelectionComponent },
  { path: '**', redirectTo: '' }
];
```

Update `ShopService.initializeShop()` to extract slug from route params:
```typescript
constructor(private router: Router, private route: ActivatedRoute) {
  this.route.params.subscribe(params => {
    const shopSlug = params['shopSlug'];
    if (shopSlug) {
      this.loadShop(shopSlug);
    }
  });
}
```

### Option 3: Subdomain-Based (Advanced)
Requires custom domain and DNS configuration:

1. **Add custom domain to Firebase Hosting**:
   ```bash
   firebase hosting:sites:create ganesh-bakery
   firebase target:apply hosting ganesh-bakery ganesh-bakery
   ```

2. **Update `firebase.json`**:
   ```json
   {
     "hosting": [
       {
         "target": "main",
         "public": "dist/whatsapp-orders/browser",
         "rewrites": [...]
       },
       {
         "target": "ganesh-bakery",
         "site": "ganesh-bakery",
         "public": "dist/whatsapp-orders/browser",
         "rewrites": [...]
       }
     ]
   }
   ```

3. **Configure DNS**:
   - Add CNAME record: `ganesh-bakery.yourapp.com` → Firebase hosting
   - Repeat for each shop subdomain

## Testing

### Local Development
```bash
# Test different shops
http://localhost:4200/?shop=demo-shop
http://localhost:4200/?shop=ganesh-bakery
http://localhost:4200/?shop=anbu-grocery
http://localhost:4200/?shop=kumar-restaurant
```

### Production URLs
```bash
# Query param
https://whatsapp-local-order.web.app/?shop=ganesh-bakery

# Path-based (after routing update)
https://whatsapp-local-order.web.app/ganesh-bakery

# Subdomain (after DNS setup)
https://ganesh-bakery.whatsapp-local-order.web.app
```

## Adding New Shops

### Development (Mock Data)
1. Edit `src/app/core/services/firebase.service.ts`
2. Add new shop to `getMockShopBySlug()` switch statement:
   ```typescript
   case 'new-shop-slug':
     return of({
       id: 'shop-5',
       slug: 'new-shop-slug',
       name: 'New Shop Name',
       phoneE164: '919876543210',
       address: 'Shop address',
       razorpayKeyId: 'rzp_test_xxxxx',
       isActive: true,
       theme: {
         primaryColor: '#1976d2',
         accentColor: '#ff9800'
       }
     });
   ```

### Production (Firebase)
1. Create shop document in Firestore:
   ```javascript
   db.collection('shops').add({
     slug: 'new-shop-slug',
     name: 'New Shop Name',
     phoneE164: '919876543210',
     address: 'Shop address',
     razorpayKeyId: 'rzp_live_xxxxx',
     ownerId: 'user-auth-id',
     isActive: true,
     theme: {
       primaryColor: '#1976d2',
       accentColor: '#ff9800'
     },
     createdAt: new Date()
   });
   ```

2. Share URL with shop owner:
   ```
   https://yourapp.web.app/?shop=new-shop-slug
   ```

## Seller Dashboard (Multi-Tenant)

The seller dashboard also needs shop context. Update seller routes:

```typescript
// src/app/features/seller/seller.routes.ts
export const SELLER_ROUTES: Routes = [
  {
    path: 'seller',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsManagementComponent },
      { path: 'orders', component: OrdersManagementComponent },
    ],
    canActivate: [AuthGuard] // Add authentication
  }
];
```

Seller components should:
1. Check user authentication
2. Get shops owned by the user
3. Allow switching between shops
4. Filter data by selected shop

## Benefits of This Architecture

✅ **Single Codebase**: One repository, one deployment for all shops
✅ **Easy Updates**: Bug fixes and features deploy to all shops instantly
✅ **Cost Effective**: Single Firebase project, shared resources
✅ **Scalable**: Add hundreds of shops without code changes
✅ **Isolated Data**: Each shop sees only their own products/orders
✅ **Custom Branding**: Each shop has unique colors, logo, WhatsApp number
✅ **Simple Onboarding**: Just create a shop document in Firestore

## Security Considerations

1. **Shop Isolation**: Always filter queries by shopId
2. **Owner Validation**: Use Firestore rules to verify shop ownership
3. **API Keys**: Store Razorpay keys per shop, not globally
4. **Authentication**: Sellers must authenticate to access dashboard
5. **Data Privacy**: Customers can't see other shop's data

## Migration from Separate Projects

If you previously created separate Firebase projects per shop:

1. Export data from each project
2. Add `shopId` field to all documents
3. Import into single project with unique shop IDs
4. Update environment config to single Firebase project
5. Deploy new multi-tenant code

## Troubleshooting

### Shop not loading
- Check browser console for errors
- Verify shop slug in URL matches Firestore document
- Check `ShopService.currentShop$` value

### Products not showing
- Verify products have correct `shopId` field
- Check Firebase service `getProductsByShopId()` method
- Inspect network tab for Firestore queries

### WhatsApp link incorrect
- Verify shop has `phoneE164` field
- Check WhatsAppService receives full shop object
- Test with different phone numbers

### Theme not applying
- Check shop has `theme` object with colors
- Verify `applyShopTheme()` is called
- Inspect CSS variables in browser

## Next Steps

1. ✅ Core multi-tenant architecture implemented
2. ⏳ Test all URL patterns with mock shops
3. ⏳ Add shop selection/error page
4. ⏳ Implement path-based routing
5. ⏳ Add seller authentication
6. ⏳ Create shop management admin panel
7. ⏳ Migrate mock data to Firestore
8. ⏳ Setup custom domain and subdomains
9. ⏳ Deploy and test production

## Support

For questions or issues with multi-tenant implementation:
1. Check this guide first
2. Review code comments in ShopService
3. Test with mock data before Firebase
4. Verify Firestore rules for shop isolation
