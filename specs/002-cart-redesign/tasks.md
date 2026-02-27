# Tasks: Cart Component Layout Redesign

**Feature**: 002-cart-redesign  
**Input**: Design documents from `specs/002-cart-redesign/`  
**Status**: Ready for implementation  
**Last Updated**: February 27, 2026

---

## Format Reference

Each task follows: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Task can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story label (US1, US2, US3, US4) - only in story phases
- **File paths**: Exact locations for implementation

---

## Executive Summary

This task list implements a responsive, mobile-first card-based layout for the shopping cart component, replacing the current HTML table design. The redesign improves mobile usability (no horizontal scrolling), accessibility (WCAG 2.1 Level AA), visual hierarchy, and performance on 4G connections.

**Total Tasks**: 47  
**Setup Tasks**: 3  
**Foundational Tasks**: 7  
**User Story Tasks**: 33 (distributed across 4 stories)  
**Polish & QA Tasks**: 4

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and asset structure

- [x] T001 Create responsive breakpoint variables in src/app/shared/styles/_breakpoints.scss
- [x] T002 [P] Create placeholder product image asset at src/assets/placeholder-product.svg
- [x] T003 [P] Create SCSS utilities for card layout/spacing in src/app/shared/styles/_cards.scss

**Checkpoint**: ✅ SCSS infrastructure and assets ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model and service updates that all user stories depend on

**⚠️ CRITICAL**: All tasks must complete before User Story implementation begins

- [x] T004 [P] Enhance CartItem interface with optional fields (imageUrl, maxQuantity, originalPrice, discountPercentage) in src/core/models/product.model.ts
- [x] T005 [P] Update CartService to validate quantity boundaries against maxQuantity in src/core/services/cart.service.ts
- [x] T006 [P] Create LazyLoadDirective for IntersectionObserver-based image lazy-loading in src/app/shared/directives/lazy-load.directive.ts
- [x] T007 Update CartComponent TypeScript class structure and add necessary imports in src/app/features/customer/cart/cart.component.ts
- [x] T008 [P] Create utility function getImageUrl() with fallback logic in src/app/shared/utilities/image-utils.ts
- [x] T009 [P] Add image loading state handling to CartComponent (loadingImages: Set<string>) in src/app/features/customer/cart/cart.component.ts
- [x] T010 [P] Create SCSS structure for responsive card layout with breakpoints in src/app/features/customer/cart/cart.component.scss

**Checkpoint**: ✅ **FOUNDATIONAL INFRASTRUCTURE COMPLETE** - All user story work can begin in parallel

---

## Phase 3: User Story 1 - Mobile User Browses Cart Without Scrolling (Priority: P1) 🎯 MVP

**Goal**: Eliminate horizontal scrolling and ensure readable layout on mobile devices (320-480px) with accessible 48px+ touch targets

**Independent Test**: Open cart on mobile device (320-480px width) and verify:
- No horizontal scrolling required
- All text readable without truncation
- Quantity controls and delete buttons accessible with 48px+ touch targets
- Information hierarchy: product name > quantity > total price

### Implementation for User Story 1

- [x] T011 [P] [US1] Replace table layout with card-based structure in cart.component.html, removing `<table>`, `<tr>`, `<td>` elements
- [x] T012 [P] [US1] Implement mobile-first responsive layout using flexbox for 320px breakpoint in cart.component.scss
- [x] T013 [P] [US1] Implement responsive layout for 480px breakpoint (small mobile) in cart.component.scss
- [x] T014 [P] [US1] Add semantic HTML `<article>` tags for cart items (replaces table rows) in cart.component.html
- [x] T015 [US1] Add ARIA labels for cart item cards: `aria-label="Product: [name]"` in cart.component.html
- [x] T016 [P] [US1] Implement quantity controls with accessible button sizes (44px minimum) in cart.component.html
- [x] T017 [P] [US1] Add remove/delete button with accessible sizing and aria-label in cart.component.html
- [x] T018 [P] [US1] Implement long product name handling (wrapping with readable font-size) in cart.component.scss
- [x] T019 [P] [US1] Add touch-friendly spacing between interactive elements (minimum 8px gap) in cart.component.scss
- [x] T020 [US1] Verify no horizontal scrolling at 320px, 375px, 480px widths using browser DevTools

**Checkpoint**: User Story 1 complete and independently testable

---

## Phase 4: User Story 2 - Desktop User Sees Enhanced Visual Presentation (Priority: P1)

**Goal**: Display product images, create clear visual hierarchy, and add interactive feedback on desktop (768px+) devices

**Independent Test**: Open cart on desktop (1024px+ width) and verify:
- Product images display (or placeholders if unavailable)
- Clear visual distinction between items (shadows, spacing)
- Hover effects provide visual feedback
- All information visible without magnification

### Implementation for User Story 2

- [x] T021 [P] [US2] Implement responsive layout for 768px breakpoint (tablet) in cart.component.scss
- [x] T022 [P] [US2] Implement responsive layout for 1024px breakpoint (desktop) in cart.component.scss
- [x] T023 [P] [US2] Implement responsive layout for 1440px+ breakpoint (large desktop) in cart.component.scss
- [x] T024 [P] [US2] Add product image container with aspect ratio constraints in cart.component.html
- [x] T025 [P] [US2] Integrate lazy-load directive for product images (apply to img element) in cart.component.html
- [x] T026 [P] [US2] Implement image fallback to placeholder on load error (onerror handler) in cart.component.html
- [x] T027 [P] [US2] Add hover effects (shadow, background) to cart-item-card on desktop in cart.component.scss
- [x] T028 [P] [US2] Implement visual hierarchy through typography hierarchy (h3 for name, p for unit/price) in cart.component.html
- [x] T029 [P] [US2] Add CSS for image aspect ratio (3:4 or 1:1) with background-size cover in cart.component.scss
- [x] T030 [P] [US2] Create card shadow and border styling for desktop presentation in cart.component.scss
- [x] T031 [US2] Verify product images display at 1024px, 1440px, 1920px widths and placeholder shows on missing image

**Checkpoint**: User Story 2 complete - visual presentation enhanced across all breakpoints

---

## Phase 5: User Story 3 - All Users Can Manage Cart Effectively (Priority: P2)

**Goal**: Ensure accessibility compliance (WCAG 2.1 Level AA) for all users including screen reader users and keyboard-only navigators

**Independent Test**: Using NVDA/JAWS screen reader and keyboard-only navigation:
- Screen reader announces product name, price, quantity, and actions
- Tab key navigates to all controls
- Enter/Space activates buttons
- Zoom to 200% maintains readability and operability

### Implementation for User Story 3

- [x] T032 [P] [US3] Add semantic HTML structure: `<article>`, `<section>`, proper heading hierarchy in cart.component.html
- [x] T033 [P] [US3] Add aria-label to quantity controls describing action (e.g., "Decrease quantity for Milk") in cart.component.html
- [x] T034 [P] [US3] Add aria-label to remove button: "Remove [product-name] from cart" in cart.component.html
- [x] T035 [P] [US3] Add role="group" to quantity controls section with aria-label in cart.component.html
- [x] T036 [P] [US3] Ensure all buttons have visible focus indicators (outline or border) in cart.component.scss
- [x] T037 [P] [US3] Add alt text to product images: "Product: [name]" in cart.component.html
- [ ] T038 [P] [US3] Test color contrast ratios (WCAG AA 4.5:1 for text) in cart.component.scss
- [ ] T039 [P] [US3] Verify keyboard navigation using Tab/Shift+Tab to all interactive elements
- [ ] T040 [P] [US3] Test at 200% zoom and verify no horizontal scrolling occurs
- [ ] T041 [US3] Run WCAG 2.1 Level AA audit using axe DevTools or similar accessibility checker
- [ ] T042 [US3] Run screen reader accessibility test (NVDA or JAWS) on cart items and controls

**Checkpoint**: User Story 3 complete - accessibility compliance verified

---

## Phase 6: User Story 4 - Shopping Experience Completes Below Performance Threshold (Priority: P3)

**Goal**: Optimize loading performance for 4G connections (1.6 Mbps) with initial render within 2 seconds

**Independent Test**: Using Chrome DevTools 4G throttle (1.6 Mbps):
- Initial cart information visible within 2 seconds
- Product images load progressively without layout shift (CLS < 0.1)
- Placeholder shows while images load

### Implementation for User Story 4

- [x] T043 [P] [US4] Implement LazyLoadDirective eager-load for first 3 cart items in cart.component.ts
- [x] T044 [P] [US4] Implement LazyLoadDirective lazy-load for remaining items using IntersectionObserver in lazy-load.directive.ts
- [x] T045 [P] [US4] Add placeholder/skeleton loader while images load (CSS or Angular template) in cart.component.html/scss
- [x] T046 [P] [US4] Set fixed dimensions for image containers to prevent CLS (e.g., width: 100px; height: 100px;) in cart.component.scss
- [ ] T047 [US4] Test performance using Lighthouse audit on 4G throttle (4x CPU slowdown) and verify metrics < 2s FCP and CLS < 0.1

**Checkpoint**: User Story 4 complete - performance optimized for 4G connections

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, testing, and deployment validation

- [ ] T048 [P] Update CartComponent unit tests for new card layout and methods in src/app/features/customer/cart/cart.component.spec.ts
- [ ] T049 [P] Add integration test with CartService and ShopService for multi-tenant cart data in src/app/features/customer/cart/cart.component.spec.ts
- [ ] T050 [P] Test WhatsApp order generation functionality (link building) across all device sizes
- [ ] T051 [P] Device testing: iOS Safari and Chrome, Android Chrome (verify no layout breaks, touch interactions work)
- [ ] T052 [P] Verify multi-language support (English/Tamil) in card layout (no text cutoff in Tamil)
- [ ] T053 Verify all existing cart functionality intact: add item, update quantity, remove item, generate WhatsApp link
- [ ] T054 Run full application build in production mode with no errors: `ng build --configuration production`
- [ ] T055 Document any breaking changes in CHANGELOG.md (should be none for backwards compatibility)
- [ ] T056 Final QA checklist: responsive testing (320-2560px), accessibility audit, performance test
- [ ] T057 [P] Lighthouse audit (Desktop & Mobile): Targets - Performance > 90, Accessibility > 90, Best Practices > 90

**Checkpoint**: All user stories integrated and ready for production deployment

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
    ├─→ Phase 3: User Story 1 (P1) ◄─── Can start here ──┐
    ├─→ Phase 4: User Story 2 (P1) ◄─── Can run parallel ├──→ Any order
    ├─→ Phase 5: User Story 3 (P2) ◄─── Independent ────┤
    └─→ Phase 6: User Story 4 (P3) ◄─── Independent ────┘
         ↓
    Phase 7: Polish & QA (depends on all story phases)
```

### User Story Independence

- **US1 (Mobile responsiveness)**: Independent - can be implemented first
- **US2 (Visual enhancement)**: Independent of US1 - only shares foundational CSS structure
- **US3 (Accessibility)**: Can be implemented alongside US1 & US2 - cross-cutting concern
- **US4 (Performance)**: Can be implemented alongside other stories - uses foundational LazyLoadDirective

### Parallel Opportunities

**Phase 1 Parallelization**:
- T001, T002, T003 can all run in parallel (different files)

**Phase 2 Parallelization**:
- T004, T005, T006, T008, T009, T010 can run in parallel (marked [P])
- T007 depends on T004 completion (CartComponent uses updated CartItem)

**Phase 3 Parallelization (US1)**:
- T011-T019 can run in parallel (marked [P])
- T020 must run after all others (verification task)

**Phase 4 Parallelization (US2)**:
- T021-T030 can run in parallel (marked [P])
- T031 must run after all others (verification task)

**Phase 5 Parallelization (US3)**:
- T032-T040 can run in parallel (marked [P])
- T041-T042 must run after implementation (accessibility audits)

**Phase 6 Parallelization (US4)**:
- T043-T046 can run in parallel (marked [P])
- T047 must run after implementation (performance testing)

**Phase 7 Parallelization**:
- T048-T052 can run in parallel (marked [P])
- T053-T057 must run sequentially or near end (integration and final QA)

### Recommended Sequential Execution (Single Developer)

1. **Phase 1** (5 minutes): Setup infrastructure
2. **Phase 2** (2-3 hours): Foundational work
3. **Phase 3** (3-4 hours): US1 Mobile responsiveness (MVP)
4. **Phase 4** (2-3 hours): US2 Visual enhancement
5. **Phase 5** (1-2 hours): US3 Accessibility
6. **Phase 6** (1-2 hours): US4 Performance
7. **Phase 7** (2-3 hours): Polish and final testing

**Total Estimated Time**: 12-17 hours

### Recommended Parallel Execution (2-3 Developers)

```
Developer 1:
- Phase 1: Setup (5 min)
- Phase 2: Partial (T004-T005, foundational models)
- Phase 3: US1 Mobile layout
- Phase 5: US3 Accessibility (parallel with US2)

Developer 2:
- Phase 2: Partial (T006-T010, CSS and directives)
- Phase 4: US2 Visual enhancement
- Phase 6: US4 Performance

Developer 3 (if available):
- Phase 2: Testing (T007 integration)
- Phase 5: Accessibility audit (T041-T042)
- Phase 7: QA and verification

All: Meet for Phase 7 integration (1-2 hours)
```

**Total Parallel Time**: 6-8 hours (with team coordination)

---

## Parallel Example: User Story 1 Breakdown

```bash
# Start Phase 1
npm run build  # Verify no errors

# Start Phase 2 - split among team
# Developer A: T004-T005 (Models, Services)
# Developer B: T006, T008-T010 (Directives, utilities, CSS)
wait for T007 to proceed with US tasks

# Start Phase 3 - All tasks can parallelize
# Developer A: T011-T014 (HTML markup and 320px layout)
# Developer B: T015-T019 (Accessibility, spacing)
# Developer C: T020 (Testing after above complete)

# Verify
npm run build
npm run test -- --include='**/cart.component.spec.ts'
ng serve  # Manual testing on mobile
```

---

## User Story Isolation & Testing

### User Story 1 is Independently Testable
- **No dependencies on US2, US3, US4**
- Verify: Mobile user can browse cart, adjust quantities, delete items without horizontal scrolling
- Tests: `npm run test -- --include '**/cart*.spec.ts'`
- Manual: `ng serve --open` → Resize to 320px → Verify layout

### User Story 2 is Independently Testable
- **No dependencies on US1, US3, US4** (reuses foundational CSS structure)
- Verify: Desktop user sees images, visual hierarchy, hover effects
- Tests: `npm run test -- --include '**/cart*.spec.ts'`
- Manual: `ng serve --open` at 1024px → Verify images and hover

### User Story 3 is Independently Testable
- **No dependencies on US1, US2, US4** (cross-cutting accessibility)
- Verify: Screen reader reads all product info, keyboard navigation works
- Tests: Accessibility audit tools (axe, WAVE)
- Manual: Keyboard Tab/Shift+Tab through all controls, NVDA/JAWS test

### User Story 4 is Independently Testable
- **No dependencies on US1, US2, US3** (performance optimization)
- Verify: Lighthouse metrics meet targets on 4G throttle
- Tests: Chrome DevTools Network > 4G (1.6 Mbps, 4x CPU slowdown)
- Manual: `lighthouse https://localhost:4200/cart --throttle-method=simulate --request-wait-time=100`

---

## Success Criteria Mapping

Each task maps to one or more success criteria from spec.md:

| Success Criterion | Tasks | Verification |
|---|---|---|
| **SC-001**: No horizontal scrolling (320-2560px) | T011-T023, T040 | Manual testing at each breakpoint |
| **SC-002**: All functionality intact | T053, T020, T031 | Integration tests, manual testing |
| **SC-003**: 2s render on 4G | T043-T047 | Lighthouse audit at 4G throttle |
| **SC-004**: CLS < 0.1 | T045-T047 | Lighthouse / Web Vitals metrics |
| **SC-005**: 48px touch targets | T016, T017 | Accessibility inspector |
| **SC-006**: WCAG 2.1 AA compliance | T041-T042 | axe DevTools, screen reader testing |
| **SC-007**: Responsive at 5 breakpoints | T012-T023 | Browser DevTools responsive mode |
| **SC-008**: Readable at 200% zoom | T040 | Manual zoom testing |
| **SC-009**: Clear empty cart state | Already exists | Verify preserved in new layout |

---

## Implementation Tips

### For T011-T023 (Layout Tasks)
Use CSS Grid or Flexbox for responsive behavior:
```scss
.cart-item-card {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 70px 1fr;
    grid-template-rows: auto auto;
  }
}
```

### For T024-T026 (Image Tasks)
```html
<img [src]="item.imageUrl || '/assets/placeholder-product.svg'"
     alt="Product: {{ item.name }}"
     appLazyLoad
     width="100"
     height="100">
```

### For T032-T040 (Accessibility Tasks)
```html
<article role="region" aria-label="Product: {{ item.name }}">
  <button (click)="decrementQuantity(i)"
          [attr.aria-label]="'Decrease quantity for ' + item.name"
          [disabled]="item.quantity <= 1">
    <mat-icon>remove</mat-icon>
  </button>
</article>
```

### For T043-T047 (Performance Tasks)
```typescript
// In LazyLoadDirective
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load image for this item
      observer.unobserve(entry.target);
    }
  });
});
```

---

## Files Modified/Created Summary

### Modified Files
- `src/core/models/product.model.ts` (T004)
- `src/core/services/cart.service.ts` (T005)
- `src/app/features/customer/cart/cart.component.ts` (T007, T009)
- `src/app/features/customer/cart/cart.component.html` (T011-T026)
- `src/app/features/customer/cart/cart.component.scss` (T001, T003, T010, T012-T023, T028-T031, T036, T038)
- `src/app/features/customer/cart/cart.component.spec.ts` (T048-T049)

### New Files Created
- `src/app/shared/styles/_breakpoints.scss` (T001)
- `src/assets/placeholder-product.svg` (T002)
- `src/app/shared/styles/_cards.scss` (T003)
- `src/app/shared/directives/lazy-load.directive.ts` (T006)
- `src/app/shared/utilities/image-utils.ts` (T008)
- `CHANGELOG.md` (T055) - if not exists

---

## Milestone Checklist

- [ ] **Milestone 1 - Foundation Complete**: All Phase 2 tasks done (T004-T010)
- [ ] **Milestone 2 - Mobile MVP Ready**: Phase 3 (US1) complete - users can browse cart mobile-friendly
- [ ] **Milestone 3 - Feature Complete**: Phase 4-6 complete - all user stories implemented
- [ ] **Milestone 4 - QA Passed**: Phase 7 complete - ready for production deployment

