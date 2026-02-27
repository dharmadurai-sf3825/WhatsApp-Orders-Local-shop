# Phase 0: Research & Findings

**Date**: February 27, 2026  
**Status**: Complete - All clarifications resolved  
**Output of**: Implementation Plan section "Phase 0: Research & Open Questions Resolution"

---

## Open Question Resolution

### 1. Image Loading Strategy

**Decision**: Implement lazy-loading with intersection observer + eager load for above-fold items (first 3 items)

**Rationale**:
- **Performance**: Lazy-loading reduces initial bundle size; only loads images as user scrolls
- **Mobile optimization**: Critical for 4G throttle target (2s initial render); aligns with Web Vitals best practices
- **Reduces CLS**: Placeholder dimensions prevent layout shift when images load
- **Firebase Storage**: Images already hosted on CDN; fetch only when needed

**Alternatives Considered**:
- ❌ Eager load all images: Would violate 2s performance target on slow 4G (typical 50-100KB per image)
- ❌ No images (MVP): Violates success criterion SC-003 requiring product images in card design
- ✅ **Lazy-load with eager-load threshold**: Best balance - initial visible items load quickly, rest on-demand

**Implementation Details**:
- Use Angular `@Component` with `OnInit` to observe first 3 items eagerly
- Implement `LazyLoadDirective` using `IntersectionObserver` API for remaining items
- Placeholder: Use product color or SVG skeleton loader (prevents CLS)
- Fallback: If image fails, display gray placeholder with product icon

**Acceptance Criteria**:
- First 3 items' images load within 2s on 4G
- Remaining items load only when scrolled into view (verified via DevTools Network tab)
- Lighthouse CLS score < 0.1

---

### 2. Inventory Boundary Handling

**Decision**: Disable increment button when at max available quantity; validate in CartService

**Rationale**:
- **Component simplicity**: Prevents invalid state (component shouldn't accept invalid quantity)
- **Data consistency**: CartService maintains single source of truth for inventory
- **UX clarity**: Disabled button with tooltip communicates why increment unavailable
- **Matches e-commerce patterns**: Standard behavior in modern carts (Amazon, Flipkart)

**Alternatives Considered**:
- ❌ No validation (accept any quantity): Risk over-promising inventory to customer
- ❌ Show warning dialog on overflow: Adds friction; confuses user on simple action
- ✅ **Disable button + CartService validation**: Intuitive; clear visual feedback

**Implementation Details**:
- Extend `CartItem` interface to include `maxQuantity?: number` field
- Modify `incrementQuantity(index)` to check `item.quantity < item.maxQuantity` before enabling button
- Add `[disabled]="item.quantity >= item.maxQuantity"` to increment button
- CartService continues to validate on add/update server-side (security)

**Acceptance Criteria**:
- Increment button disabled when `quantity >= maxQuantity`
- Tooltip shown on disabled state: "Quantity limit reached"
- Unit test confirms `incrementQuantity()` respects max

---

### 3. Discount/Promotion Display

**Decision**: Show discount badge + original price strikethrough if discount available (non-MVP, implement if ProductModel supports)

**Rationale**:
- **Visual appeal**: Discount badges increase perceived value and urgency
- **Product data readiness**: Check if `ProductModel` already contains `discount` or `originalPrice` field
- **Incremental scope**: Add if data available; skip if not (keeps MVP focused)
- **Matches specification**: Spec mentions "visual hierarchy" - discount highlighting supports this

**Alternatives Considered**:
- ❌ MVP without discounts: Simpler, but misses visual hierarchy opportunity mentioned in spec
- ❌ Hard-code discount logic in component: Violates separation of concerns
- ✅ **Conditional render if ProductModel supports**: Scalable, non-blocking for MVP

**Implementation Details**:
- Inspect `ProductModel` in `src/core/models/product.model.ts` - check for `discount`, `originalPrice`, `discountPercentage` fields
- If fields exist: Add to `CartItem` interface
- Render conditional block in template:
  ```html
  <div class="price-container">
    <span *ngIf="item.originalPrice" class="original-price">₹{{ item.originalPrice }}</span>
    <span class="sale-price">₹{{ item.price }}</span>
    <span *ngIf="item.discount" class="discount-badge">-{{ item.discount }}%</span>
  </div>
  ```
- Style: Original price with strikethrough; green badge for discount

**Acceptance Criteria**:
- If `ProductModel.discount` exists: Must render badge and original price
- If not: Card layout works without discount section (no errors)
- CSS includes strikethrough styling for original price

---

### 4. Technology Stack Verification

**Context**: Cart component runs in Angular 17+ with Material Design

**Research Finding - Framework Dependencies**:

| Dependency | Current Version | Status | Notes |
|-----------|---|---|---|
| Angular | 17+ | ✓ In use | Supports standalone components, typed forms |
| Angular Material | 17+ | ✓ In use | mat-card, mat-icon, mat-button available |
| TypeScript | 5.2+ | ✓ Required | Strict mode enforced in tsconfig.json |
| RxJS | Latest | ✓ In use | CartService uses Observable streams |
| Firebase SDK | Latest | ✓ In use | Firestore for shop/product data |
| SCSS | With Angular | ✓ In use | Global styles in styles.scss |

**Research Finding - Testing Framework**:

| Tool | Status | Usage |
|---|---|---|
| Karma + Jasmine | ✓ Configured | Unit tests for component methods |
| cypress (if present) | ? Check | E2E tests for accessibility/responsive |
| WAVE/axe-core | ✓ Ready | Accessibility testing library |

**Research Finding - Lint Configuration**:

| Check | Status |
|---|---|
| TypeScript strict mode | ✓ Enabled (`"strict": true` in tsconfig.json) |
| Template type safety | ✓ Enabled (`"strictTemplates": true` in angular options) |

**Decision**: No new dependencies needed. Use existing Angular + Material + RxJS + Firebase stack.

---

### 5. Accessibility Requirements Clarification

**Specification Requirement**: WCAG 2.1 Level AA compliance

**Research Finding - Required Techniques**:

| WCAG Criterion | Requirement | Implementation |
|---|---|---|
| **1.4.3 Contrast (AA)** | Text/button contrast ≥ 4.5:1 | Verify with color samples in theme |
| **2.5.5 Target Size (AAA)** | Touch targets ≥ 48×48px | Quantity buttons, delete button must be 48px |
| **3.2.1 On Focus** | No unexpected behavior on focus | Tab navigation must work; don't auto-submit |
| **1.3.1 Info & Relationships** | Semantic HTML | Use `<article>` for items; `<button>` for actions |
| **1.1.1 Non-text Content** | Alt text for images | Use `alt="Product: [name]"` for images |
| **2.1.1 Keyboard** | All functions keyboard accessible | Tab order, Enter/Space activation |

**Decision**: Use angular a11y best practices; run axe-core tests in CI/CD

---

## Summary: All Open Questions Resolved

| Question | Decision | Risk Level | Implementation Impact |
|----------|----------|------------|----------------------|
| Image loading | Lazy-load + eager for first 3 items | Low | Requires lazy directive, minimal component changes |
| Inventory handling | Disable increment when max reached | Low | Extends CartItem interface, 3 lines of code |
| Discount display | Show if ProductModel supports, skip if not | Low | Conditional render block, non-blocking |
| Framework choice | Use existing Angular 17+ stack | None | No new dependencies |
| A11y compliance | Implement WCAG 2.1 Level AA | Medium | Requires testing + iterative fixes |

**Recommendation**: All clarifications enable Phase 1 design to proceed without blockers. No technical risks identified.
