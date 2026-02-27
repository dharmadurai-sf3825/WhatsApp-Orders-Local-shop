# Phase 1: Data Model & Entity Design

**Date**: February 27, 2026  
**Status**: Complete - Cart component entities defined  
**Input**: Feature specification, research findings from Phase 0  
**Output**: Entity definitions, relationships, validation rules

---

## Overview

The cart redesign operates on the existing cart data model with minor enhancements to support product images, discount information, and inventory boundaries. No breaking changes to cart state management.

---

## Entity Definitions

### 1. CartItem (Enhanced)

**Location**: `src/core/models/product.model.ts`

**Current Interface**:
```typescript
export interface CartItem {
  id: string;
  name: string;
  nameTA: string;
  price: number;          // Unit price
  quantity: number;
  unit: string;
  unitTA: string;
  totalPrice: number;     // Calculated: price * quantity
  imageUrl?: string;      // Already supported (optional)
}
```

**Enhancement (from Phase 0 research)**:
```typescript
export interface CartItem {
  // Existing
  id: string;
  name: string;
  nameTA: string;
  price: number;          // Unit price in ₹
  quantity: number;       // Current quantity in cart
  unit: string;
  unitTA: string;
  totalPrice: number;     // Calculated: price * quantity (maintained by CartService)
  imageUrl?: string;      // Product image URL from Firebase Storage/CDN
  
  // New (from research)
  maxQuantity?: number;   // Inventory limit (optional, for boundary handling)
  originalPrice?: number; // Price before discount (optional, for discount display)
  discount?: number;      // Discount percentage or amount (optional)
  discountPercentage?: number;  // For display: "Save 10%"
}
```

**Validation Rules**:
- ✓ `id`: Must be non-empty string
- ✓ `name`, `nameTA`: Must be non-empty (at least 1 character)
- ✓ `price`: Must be > 0 (numeric)
- ✓ `quantity`: Must be ≥ 1 and ≤ `maxQuantity` (if specified)
- ✓ `unit`, `unitTA`: Must represent unit of measurement (e.g., "L", "kg", "piece")
- ✓ `totalPrice`: Auto-calculated by `CartService`, must equal `price * quantity`
- ✓ `imageUrl`: If provided, must be valid URL (handled by fallback placeholder)
- ✓ `maxQuantity`: If provided, must be ≥ 1
- ✓ `originalPrice`: If provided, must be ≥ `price` (discount logic validation)

**Example Data**:
```typescript
{
  id: "prod_001",
  name: "Milk (1L)",
  nameTA: "பால் (1 லி)",
  price: 30,
  quantity: 2,
  unit: "L",
  unitTA: "லி",
  totalPrice: 60,
  imageUrl: "https://storage.firebase.com/.../milk.jpg",
  maxQuantity: 10,
  originalPrice: 35,
  discountPercentage: 14
}
```

**State Transitions**:
- `CartItem` created when user clicks "Add to Cart" from products view
- `quantity` incremented/decremented via quantity controls in cart component
- `CartItem` removed from cart when user clicks delete button
- `totalPrice` recalculated by `CartService` on quantity change

---

### 2. Cart (State Container)

**Location**: `src/core/services/cart.service.ts`

**Current State**:
```typescript
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  
  getCartItems(): CartItem[] { ... }
  addItem(item: CartItem): void { ... }
  removeItem(id: string): void { ... }
  updateQuantity(id: string, quantity: number): void { ... }
  clearCart(): void { ... }
}
```

**Relationships**:
- `Cart` contains 0+ `CartItem` objects
- Each `CartItem` has a 1:1 relationship with a product in inventory (Shop.products[])
- `CartService` notifies subscribers on any cart change via RxJS Observable

**State Management Constraints** (from Constitution Principle V):
- Always validate quantity against `maxQuantity` before state update
- Maintain cart consistency: `totalPrice = SUM(item.totalPrice for all items)`
- Clear cart on logout (multi-tenant isolation - Principle III)
- Persist cart to browser localStorage for offline support (PWA - Principle II)

---

### 3. CustomerInfo (Order Metadata)

**Location**: `src/core/models/order.model.ts`

**Current Interface**:
```typescript
export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  landmark: string;        // Optional
  preferredTime: string;   // Optional
  notes: string;           // Optional
}
```

**Status**: No changes needed. Passes Constitution checks.

**Validation Rules**:
- ✓ `name`: Non-empty string, 3-100 characters
- ✓ `phone`: Valid phone format (stored for WhatsApp integration)
- ✓ `address`: Non-empty, 10-500 characters
- ✓ `landmark`: Optional, 0-100 characters
- ✓ `preferredTime`: Optional, time format or free text
- ✓ `notes`: Optional, 0-500 characters

---

### 4. Shop (Multi-Tenant Context)

**Location**: `src/core/models/shop.model.ts`

**Relevant Fields for Cart Component**:
```typescript
export interface Shop {
  id: string;
  slug: string;
  name: string;
  nameTA: string;
  // ... other fields
  products: Product[];     // Shop's product catalog
}
```

**Relationship**: Cart component always operates within context of `ShopService.currentShop$` - ensures multi-tenant isolation (Principle III).

---

## Responsive Breakpoints & Card Layout Model

### Desktop View Model (> 1024px)
```
┌─────────────────────────────────────────────────┐
│ Cart Header (h1, item count)                    │
├─────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐ │
│ │ [IMG] Name, Unit Price | Qty | Total | Del│ │ (Card)
│ └────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────┐ │
│ │ [IMG] Name, Unit Price | Qty | Total | Del│ │ (Card)
│ └────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Customer Details (form section)                 │
├─────────────────────────────────────────────────┤
│ Order Summary (Total)                          │
│ [Order on WhatsApp Button]                     │
└─────────────────────────────────────────────────┘
```

**Layout Properties**:
- Cards in single vertical column (full width)
- Card `display: flex` for horizontal item layout
- Image: 100×100px, border-radius 8px
- Details: flex-grow 1, center vertically
- Controls (Qty, Price, Delete): flex-direction row, align right
- Hover effect: box-shadow 0 2px 8px rgba(0,0,0,0.08)

### Mobile View Model (< 480px)
```
┌─────────────────────┐
│ [Back] Cart (N)     │
├─────────────────────┤
│  ┌───────────────┐  │
│  │ [IMG]         │  │
│  │ Name, Unit    │  │
│  │ ₹Total        │  │
│  │ Qty: [−][N][+]│  │
│  │      [×Delete]│  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ...           │  │
│  └───────────────┘  │
├─────────────────────┤
│ Customer form (full)│
├─────────────────────┤
│ Total: ₹XXX         │
│ [Order on WhatsApp] │
└─────────────────────┘
```

**Layout Properties**:
- Cards stack vertically, full width with padding
- Image: 70×70px
- Details: vertical stack below image
- Controls: wrapped, centered under details
- Quantity controls: larger targets (48px minimum)
- Delete button: right-aligned

---

## Entity Relationships Diagram

```
Shop (multi-tenant context)
├── slug = "my-dairy-shop"
│
├── products[]
│   └── Product (id, name, price, imageUrl, maxQuantity)
│
└── CartService
    └── cart$: Observable<CartItem[]>
        ├── CartItem[] (0 or more)
        │   ├── id (reference to Product.id)
        │   ├── quantity (1 to maxQuantity)
        │   ├── totalPrice (calculated)
        │   └── imageUrl (from Product)
        │
        └── CustomerInfo (collected before order)
            ├── name, phone, address
            └── landmark, preferredTime, notes (optional)
```

---

## Accessibility Data Model

### Semantic HTML Structure
```html
<section class="cart-container" role="main">
  <header class="cart-header">
    <h1 id="cart-title">Shopping Cart</h1>
  </header>
  
  <article class="cart-item-card" role="listitem" aria-label="Product: Milk">
    <img src="..." alt="Product: Milk (1L)" class="item-image" />
    <div class="item-details">
      <h3>Milk (1L)</h3>
      <p>₹30 per L</p>
    </div>
    <div class="item-controls" role="group" aria-label="Quantity controls">
      <button aria-label="Decrease quantity">−</button>
      <span aria-live="polite">Qty: 2</span>
      <button aria-label="Increase quantity">+</button>
    </div>
    <button aria-label="Remove Milk from cart">Delete</button>
  </article>
</section>
```

### ARIA Labels
- `aria-label` on buttons: "Decrease quantity for Milk", "Remove Milk"
- `aria-live="polite"` on quantity display: announces changes
- `role="group"` on quantity controls: logical grouping for screen readers
- `role="listitem"` on cart items: conveys list structure
- `alt` text on images: "Product: [name]"

---

## Summary: Data Model & Layout Integration

| Component | Current State | Changes Required | Risk |
|-----------|---------------|------------------|------|
| CartItem interface | Satisfactory | Add optional: maxQuantity, originalPrice, discount% | Low |
| CartService | Satisfactory | Add quantity validation against maxQuantity | Low |
| CustomerInfo interface | Satisfactory | None | None |
| Shop context | Satisfactory | None | None |
| Responsive layout | Restructured via CSS | New SCSS with flexbox + breakpoints | Low |
| Accessibility | Needs enhancement | Add semantic HTML + ARIA labels | Medium |

**Implementation Priority**:
1. ✅ Add CartItem fields (non-breaking, additive)
2. ✅ Update SCSS for responsive card layout
3. ✅ Add semantic HTML + ARIA labels
4. ✅ Implement lazy-load directive for images
5. ✅ Enhanced testing (accessibility + responsive)
