# Contract: Cart Item Interface

**Version**: 1.0  
**Scope**: `src/core/models/product.model.ts`  
**Stability**: Stable with backwards-compatible additions  
**Last Updated**: February 27, 2026

---

## Overview

The `CartItem` interface defines the contract for a product in the shopping cart. This contract is consumed by the `CartComponent`, `CartService`, and Product-related services.

---

## Interface Definition

```typescript
export interface CartItem {
  // Required fields (core functionality)
  id: string;                 // Unique product identifier
  name: string;               // Product name in English
  nameTA?: string;            // Product name in Tamil
  price: number;              // Unit price in Indian Rupees (₹)
  quantity: number;           // Current qty in cart (>= 1)
  unit: string;               // Unit of measurement (e.g., "L", "kg", "piece")
  unitTA?: string;            // Unit in Tamil
  totalPrice: number;         // Calculated: price × quantity
  
  // Optional fields (added for redesign)
  imageUrl?: string;          // URL to product image (Firebase Storage/CDN)
  maxQuantity?: number;       // Inventory limit (if available)
  originalPrice?: number;     // Price before discount (if discount applies)
  discountPercentage?: number; // Discount % or label: "14%", "Save 10%"
}
```

---

## Field Specifications

| Field | Type | Required | Validation | Purpose |
|-------|------|----------|------------|---------|
| `id` | string | ✓ Yes | Non-empty, unique per shop | Uniquely identify product in inventory |
| `name` | string | ✓ Yes | 1-200 characters | Display product name |
| `nameTA` | string | Optional | 1-200 characters | Tamil language support |
| `price` | number | ✓ Yes | > 0, precision 2 decimals | Unit price for calculation |
| `quantity` | number | ✓ Yes | 1 ≤ qty ≤ maxQuantity | Qty in cart (validated by CartService) |
| `unit` | string | ✓ Yes | Standard unit (L, kg, piece, g, ml) | Measurement display |
| `unitTA` | string | Optional | Localized unit text | Tamil unit label |
| `totalPrice` | number | ✓ Yes | Calculated by CartService | Total cost for this item |
| `imageUrl` | string | Optional | Valid URL, <500 chars | Product image display (mobile-friendly) |
| `maxQuantity` | number | Optional | >= 1 (if provided) | Inventory boundary (prevents over-ordering) |
| `originalPrice` | number | Optional | >= price (if discount) | Pre-discount price for comparison |
| `discountPercentage` | number | Optional | 1-100 (if discount) | Visual indicator of savings |

---

## Validation Rules

### Enforced by CartService
```typescript
// Before adding/updating item in cart:
function validateCartItem(item: CartItem): ValidationResult {
  if (!item.id || item.id.trim() === '') {
    return { valid: false, error: 'Product ID required' };
  }
  if (item.price <= 0) {
    return { valid: false, error: 'Price must be positive' };
  }
  if (item.quantity < 1) {
    return { valid: false, error: 'Quantity must be >= 1' };
  }
  if (item.maxQuantity && item.quantity > item.maxQuantity) {
    return { valid: false, error: 'Quantity exceeds max available' };
  }
  // Verify totalPrice calculation
  const calculated = item.price * item.quantity;
  if (Math.abs(item.totalPrice - calculated) > 0.01) {
    return { valid: false, error: 'totalPrice mismatch' };
  }
  return { valid: true };
}
```

### Enforced by CartComponent
```typescript
// Before rendering increment button:
canIncrementQuantity(item: CartItem): boolean {
  return !item.maxQuantity || item.quantity < item.maxQuantity;
}

// Before rendering product image:
getImageUrl(item: CartItem): string {
  return item.imageUrl && isValidUrl(item.imageUrl) 
    ? item.imageUrl 
    : '/assets/placeholder-product.svg';
}

// Before showing discount info:
showDiscount(item: CartItem): boolean {
  return !!item.originalPrice && !!item.discountPercentage;
}
```

---

## Usage Examples

### Scenario 1: Simple Product (No Discount)
```typescript
const milk: CartItem = {
  id: 'prod-milk-1l',
  name: 'Fresh Milk (1L)',
  nameTA: 'புதிய பால் (1 லி)',
  price: 30,
  quantity: 2,
  unit: 'L',
  unitTA: 'லி',
  totalPrice: 60,
  imageUrl: 'https://firestore-cdn/../milk.jpg'
};
```

### Scenario 2: Product with Inventory Limit
```typescript
const butter: CartItem = {
  id: 'prod-butter-200g',
  name: 'Butter (200g)',
  nameTA: 'வெண்ணெய் (200கி)',
  price: 50,
  quantity: 1,
  unit: 'piece',
  unitTA: 'கட்டை',
  totalPrice: 50,
  imageUrl: 'https://firestore-cdn/../butter.jpg',
  maxQuantity: 5  // Only 5 left in stock
};
```

### Scenario 3: Product with Discount
```typescript
const yogurt: CartItem = {
  id: 'prod-yogurt-500ml',
  name: 'Curd (500ml)',
  nameTA: 'தயிர் (500மி.லி)',
  price: 40,
  quantity: 1,
  unit: 'ml',
  unitTA: 'மி.லி',
  totalPrice: 40,
  imageUrl: 'https://firestore-cdn/../yogurt.jpg',
  originalPrice: 50,
  discountPercentage: 20  // "Save 20%" label
};
```

---

## Backwards Compatibility

**Status**: Backwards compatible ✓

- **Old Code**: Code expecting original fields (id, name, price, qty, unit, totalPrice, imageUrl) continues to work
- **New Fields**: All additive fields (`maxQuantity`, `originalPrice`, `discountPercentage`) are optional with sensible defaults
- **Migration**: No data migration required; fields auto-populate when available
- **Removing Fields**: Never remove any fields; always add new ones instead

---

## Related Contracts

- [CartComponent Contract](cart-component-contract.md) - How CartComponent uses CartItem
- [CartService Contract](cart-state-contract.md) - How CartService manages CartItem[]

---

## Change Log

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-27 | Initial definition with optional fields for image, inventory, discount |
