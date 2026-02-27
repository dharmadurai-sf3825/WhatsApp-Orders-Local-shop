# Contract: Cart Component Interface

**Version**: 1.0  
**Scope**: `src/app/features/customer/cart/cart.component.ts`  
**Stability**: Stable (public API for routing/embedding)  
**Last Updated**: February 27, 2026

---

## Overview

The `CartComponent` is a standalone Angular component that displays a shopping cart with responsive card-based layout, collects customer delivery information, and enables WhatsApp-based order placement. This contract defines the component's public API (inputs, outputs, methods) and behavioral guarantees.

---

## Component Declaration

```typescript
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  // ... implementation
}
```

---

## Public API

### Inputs
**None** - Component derives all data from services (CartService, ShopService, LanguageService)

### Outputs
**None** - Component communicates via WhatsAppService (order placement)

### Public Properties (Read-Only)

```typescript
// Display data
cartItems: CartItem[];              // Current cart items from CartService
language: 'en' | 'ta';              // Current language selection
shop: Shop | null;                  // Current shop context
sellerPhone: string | null;         // WhatsApp number for order

// Form data
customerInfo: CustomerInfo;         // Form input (name, phone, address, etc.)
```

### Public Methods

```typescript
/**
 * Increment quantity for item at given index
 * @param index Index in cartItems array
 * @throws Error if index out of bounds or quantity at max
 * @effects CartService.updateQuantity() called; UI re-renders
 */
incrementQuantity(index: number): void;

/**
 * Decrement quantity for item at given index
 * @param index Index in cartItems array
 * @throws Error if index out of bounds or quantity at minimum (1)
 * @effects CartService.updateQuantity() called; UI re-renders
 */
decrementQuantity(index: number): void;

/**
 * Remove item from cart
 * @param index Index in cartItems array
 * @effects CartService.removeItem() called; UI re-renders
 * @sideeffect Form state preserved (customer info not cleared)
 */
removeItem(index: number): void;

/**
 * Initiate WhatsApp order placement
 * @requires customerInfo.name, phone, address must be filled
 * @requires cartItems.length > 0
 * @effects Opens WhatsApp chat with order summary
 * @throws Error if form invalid (message shown to user)
 */
orderOnWhatsApp(): void;

/**
 * Calculate total number of items in cart
 * @returns Sum of all item quantities
 */
getTotalItems(): number;

/**
 * Calculate subtotal (sum of all item total prices)
 * @returns Subtotal amount in ₹
 */
getSubtotal(): number;

/**
 * Validate customer info form
 * @returns true if name, phone, address all filled; false otherwise
 */
isFormValid(): boolean;

/**
 * Navigate back to previous page (products list)
 * @effects Router.navigate() called
 */
goBack(): void;

/**
 * Navigate to products list (continue shopping)
 * @effects Router.navigate() called
 */
continueShopping(): void;
```

---

## Behavioral Guarantees

### Initialization (`ngOnInit`)
✓ Subscribe to `CartService.cart$` and display current items  
✓ Subscribe to `LanguageService.language$` to support language switching  
✓ Load `currentShop` from `ShopService` and fetch seller phone from Firestore  
✓ Load persisted customer info from browser localStorage (if available)

### Rendering
✓ Display empty state if `cartItems.length === 0`  
✓ Display cart items in card-based layout if items present  
✓ **Never** horizontally scroll on any viewport (320px to 2560px)  
✓ Show product images with fallback to placeholder if unavailable  
✓ Disable increment button if `item.quantity >= item.maxQuantity`  
✓ Disable "Order on WhatsApp" button if form invalid

### Quantity Controls
✓ Each quantity change immediately calls `CartService.updateQuantity()`  
✓ No optimistic updates; wait for service confirmation  
✓ Validation: quantity must remain between 1 and `maxQuantity`

### Form Handling
✓ Support bilingual input (English/Tamil labels)  
✓ Save customer info to localStorage on input (auto-persist)  
✓ Load saved customer info on init  
✓ Clear form only on successful order (or manual user action)

### WhatsApp Integration
✓ Collect cart summary + customer info  
✓ Format message with product list, total, delivery details  
✓ Call `WhatsAppService.generateOrderLink()` to create WhatsApp link  
✓ Open link in new window/tab (don't leave current page)

### Accessibility
✓ All interactive elements (buttons, inputs) keyboard-navigable via Tab  
✓ Activate buttons with Enter/Space keys  
✓ Semantic HTML: `<article>` for items, `<button>` for actions  
✓ ARIA labels on all buttons and quantity controls  
✓ `alt` text on product images  
✓ Form labels associated with inputs via `<label>` elements

### Responsiveness
✓ Layout adapts to 5 breakpoints: 320px, 480px, 768px, 1024px, 1440px  
✓ Touch targets minimum 48px on mobile (buttons, quantity controls)  
✓ Images lazy-load on scroll (first 3 eager-loaded)  
✓ No layout shift (CLS < 0.1) when images load

---

## Dependencies

### Injected Services

```typescript
constructor(
  private cartService: CartService,           // Manage cart state
  private whatsappService: WhatsAppService,   // Generate order link
  private languageService: LanguageService,   // Multi-language support
  private firebaseService: FirebaseService,   // Firestore queries
  private shopService: ShopService,           // Multi-tenant context
  private firestore: Firestore,               // Direct Firestore access (shop_ownership query)
  private router: Router                      // Navigate back/forward
) { }
```

### External Data Sources

- **CartService.cart$**: Observable stream of current cart items
- **ShopService.currentShop$**: Observable stream of active shop context
- **LanguageService.language$**: Observable stream of language selection
- **Firestore.shop_ownership**: Collection query for seller phone number
- **Firebase Storage**: Product images (via imageUrl field)

---

## Error Cases & Handling

| Error | Cause | Handling |
|-------|-------|----------|
| No seller phone found | Shop not configured in Firestore | Warn in console; WhatsApp button shown but disabled/grayed out |
| Invalid customer form | Name, phone, address empty | "Order on WhatsApp" button disabled with visual indicator |
| Cart empty | User removes all items | Display empty state with "Continue Shopping" button |
| Image load failed | imageUrl broken or CDN down | Show placeholder product image; no error thrown |
| Firestore query fails | Network error | Log error; show fallback shop name; don't block cart view |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial render | < 100ms | Time from component init to DOM render |
| Quantity update | < 50ms | Time to call CartService and re-render |
| Image lazy-load | < 2s first 3 images on 4G | Measured via DevTools Network throttle |
| Lighthouse CLS | < 0.1 | Layout shift metric (images loading) |
| Accessibility score | 95+ | Lighthouse audit |

---

## Testing Requirements

### Unit Tests
- ✓ `incrementQuantity()` respects maxQuantity boundary
- ✓ `decrementQuantity()` doesn't go below 1
- ✓ `getTotalItems()` returns correct sum
- ✓ `getSubtotal()` calculates correctly
- ✓ `isFormValid()` checks required fields
- ✓ `orderOnWhatsApp()` throws error if form invalid
- ✓ Language switching updates displayed text

### Integration Tests
- ✓ CartService updates reflected in UI
- ✓ Customer info localStorage persist/load
- ✓ Seller phone fetched correctly from Firestore
- ✓ WhatsApp link generation with cart data

### E2E / Manual Testing
- ✓ No horizontal scroll on 320px, 480px, 768px, 1024px widths
- ✓ Tap targets 48px on mobile
- ✓ Touch-friendly quantity controls
- ✓ Images load without CLS
- ✓ Tab navigation works (keyboard only)
- ✓ Screen reader announces items and controls
- ✓ 4G throttle: 2s load time

---

## Backwards Compatibility

**Status**: Breaking change from table layout (visual only, no API change)

- **Component selector** unchanged: `<app-cart>`
- **Input/output bindings**: None (no change)
- **Service contracts**: CartService API unchanged
- **Data model**: CartItem enhanced with optional fields (backwards compatible)

**Migration**: No code changes required for parent components. CSS changes are internal to cart.component.scss.

---

## Related Contracts

- [CartItem Interface Contract](cart-item-contract.md) - Data structure
- [CartService State Contract](cart-state-contract.md) - Service dependencies

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-27 | Redesigned layout, added image/lazy-load/accessibility guarantees |
