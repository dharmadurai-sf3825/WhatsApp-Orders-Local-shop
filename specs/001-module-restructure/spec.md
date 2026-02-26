# Feature Specification: Module-Based Architecture Restructure

**Feature Branch**: `001-module-restructure`  
**Created**: 2026-02-26  
**Status**: Draft  
**Input**: Restructure project to support module-based organization with Customer, Seller, and Admin modules with clear separation of concerns, lazy loading, and build-time module resolution

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Implement Module-Based Directory Structure (Priority: P1)

As an architect/developer, I need to reorganize the project from a flat feature structure into a hierarchical module-based structure so that team members can work on separate modules independently and the codebase remains scalable and maintainable.

**Why this priority**: This is the foundation for all other improvements. Without the new structure, lazy loading, code splitting, and team scalability cannot be achieved. This enables parallel development.

**Independent Test**: Verify that the new module structure exists in `src/app/modules/{customer,seller,admin}/` with all expected subdirectories, and that the application still builds and runs with no errors after a full migration.

**Acceptance Scenarios**:

1. **Given** the source code exists in the old flat feature structure, **When** the migration is completed, **Then** all components are relocated to `modules/{customer|seller|admin}/components/`, all module-specific services are in `modules/{customer|seller|admin}/services/`, and route files exist at `modules/{customer|seller|admin}/{module}.routes.ts`

2. **Given** the new module structure is in place, **When** the application builds, **Then** no import errors occur and the application starts without console errors

3. **Given** components are in their new locations, **When** they are imported in route files, **Then** all TypeScript paths resolve correctly and compilation succeeds

---

### User Story 2 - Implement Lazy-Loaded Module Routes (Priority: P1)

As a developer, I need module routes to be lazy-loaded so that only required module bundles are downloaded when users navigate to them, improving initial load time and overall performance.

**Why this priority**: Lazy loading is critical for PWA performance. Without this, all module code is bundled together, defeating the purpose of modularization. This directly impacts user experience on slow connections.

**Independent Test**: Build the application for production and verify that separate JavaScript chunks exist in the dist folder for each module (customer, seller, admin), and that each chunk is only loaded when its route is activated.

**Acceptance Scenarios**:

1. **Given** a user visits the application, **When** the page loads, **Then** only the main chunk and core services are loaded; module chunks are not downloaded

2. **Given** a user navigates to the seller routes, **When** they activate `/seller` path, **Then** the seller module chunk is fetched and loaded on-demand

3. **Given** a user navigates to the admin routes, **When** they activate `/admin` path, **Then** the admin module chunk is fetched and loaded on-demand

4. **Given** module chunks are lazy-loaded, **When** Chrome DevTools Network tab is inspected, **Then** module-specific JavaScript files appear only after navigation to those routes

---

### User Story 3 - Create Shared Components Module (Priority: P2)

As a developer, I need reusable components (header, footer, loader, error dialog) in a dedicated shared module so that components used across multiple modules are maintained in a single location and DRY principle is followed.

**Why this priority**: This reduces code duplication and maintenance overhead. While not blocking module functionality, it improves overall code quality and team productivity.

**Independent Test**: Verify that shared components (loader, error-dialog, header, footer) are defined once in `src/app/shared/components/` and can be imported by all three feature modules.

**Acceptance Scenarios**:

1. **Given** a shared component exists (e.g., LoaderComponent), **When** it is imported in multiple modules, **Then** all modules use the same component instance without duplication

2. **Given** the LoaderComponent is used in customer, seller, and admin modules, **When** it is instantiated, **Then** it displays identically across all modules

3. **Given** shared pipes (TruncatePipe, SafeHtmlPipe) are defined in `shared/pipes/`, **When** they are imported in component templates, **Then** they function correctly without module-level redeclaration

---

### User Story 4 - Create Module-Specific Services (Priority: P2)

As a developer, I need module-specific services (ProductService for customer, SellerProductService for seller, AdminSellerService for admin) so that business logic remains encapsulated within modules and dependencies are clear.

**Why this priority**: Service organization improves code clarity and testability. This supports the constitution's principle of clear data flow separation between core and module-specific functionality.

**Independent Test**: Verify that ProductService exists in `modules/customer/services/`, SellerProductService in `modules/seller/services/`, and AdminSellerService in `modules/admin/services/`, and that each service is imported only by its respective module.

**Acceptance Scenarios**:

1. **Given** a module-specific service is defined in its module directory, **When** it is instantiated in that module, **Then** it is scoped to that module and not globally available

2. **Given** ProductService and SellerProductService both manage products, **When** they are instantiated in their respective modules, **Then** they maintain separate state and do not interfere with each other

3. **Given** global services (AuthService, FirebaseService) exist in core, **When** they are imported in modules, **Then** they are shared and maintain global state correctly

---

### User Story 5 - Update Main App Routes with Module Loading (Priority: P1)

As a developer, I need the main `app.routes.ts` to orchestrate module loading via `loadChildren` so that the app correctly delegates routing to each module.

**Why this priority**: Without proper route configuration, modules cannot be lazy-loaded and the application cannot function correctly. This is essential for the entire modular architecture.

**Independent Test**: Verify that `app.routes.ts` contains lazy-load routes using `loadChildren`, that navigation to each module activates the correct route guards, and that guards prevent unauthorized access.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/:shopSlug`, **When** the route activates, **Then** customer module routes are loaded and displayed

2. **Given** a seller attempts to access `/seller/dashboard`, **When** the sellerAuthGuard evaluates, **Then** access is granted if the user is authenticated as a seller

3. **Given** a non-admin user attempts to access `/admin`, **When** the adminAuthGuard evaluates, **Then** access is denied and user is redirected to unauthorized page

4. **Given** a user navigates between modules, **When** the route changes, **Then** only the new module's code is loaded; previous module's state is retained in memory if revisited

---

### User Story 6 - Verify Build Output and Bundle Optimization (Priority: P2)

As a platform manager, I need to verify that the modular build produces optimized chunks and that bundle size meets PWA requirements so that the application remains fast across all user devices.

**Why this priority**: This validates that the modularization actually delivers performance improvements. It's a quality gate before considering the restructure complete.

**Independent Test**: Run production build and verify that total initial bundle (main.js) is under 250KB gzipped, that lazy-loaded module chunks are generated separately, and that bundle analysis shows expected code splitting.

**Acceptance Scenarios**:

1. **Given** the application is built for production, **When** `npm run build:prod` completes, **Then** `dist/whatsapp-ordering-pwa/browser/` contains separate JavaScript chunks for each module

2. **Given** bundle analysis is run, **When** main.js is analyzed, **Then** lazy-loaded module code is not included in main.js

3. **Given** the total bundle size is measured, **When** gzipped size is calculated, **Then** initial load bundle is under 250KB

4. **Given** a user's network is throttled (slow 3G), **When** the application loads, **Then** core functionality is interactive within 3 seconds; modules load on-demand within 1 second of navigation

---

### Edge Cases

- What happens when a user navigates between modules rapidly (e.g., clicking multiple tabs in quick succession)? System should queue module loading and not break.
- How does the system handle failed module chunk downloads (network interruption during lazy load)? Application should display user-friendly error and allow retry.
- What happens if a module route guard validates user permissions and they change during that session? User should be redirected on next navigation if permissions are revoked.
- How does the system preserve cart state (from GlobalStateService) when switching between customer and other modules? Cart state should persist in memory across module boundaries.
- What happens if old import paths (from flat feature structure) remain in codebase after migration? Build should fail with clear import errors to catch all migration issues.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST organize source code into three independent feature modules: Customer (`modules/customer/`), Seller (`modules/seller/`), and Admin (`modules/admin/`) with clear separation of components, services, and routes
- **FR-002**: System MUST use `loadChildren` in main `app.routes.ts` to lazy-load each module's routes, ensuring module code is not included in the initial bundle
- **FR-003**: System MUST support module-specific route definitions (e.g., `customer.routes.ts`, `seller.routes.ts`, `admin.routes.ts`) that define customer, seller, and admin-specific paths independently
- **FR-004**: System MUST move core services (AuthService, FirebaseService, GlobalStateService, etc.) to `core/services/` and make them globally available to all modules through Angular's dependency injection
- **FR-005**: System MUST create module-specific services for each module (ProductService for customer, SellerProductService for seller, AdminSellerService for admin) scoped to their respective modules
- **FR-006**: System MUST enforce route guards (sellerAuthGuard, adminAuthGuard) that verify user role and shop ownership before allowing access to seller and admin routes
- **FR-007**: System MUST consolidate reusable components (header, footer, loader, error-dialog) in `shared/components/` and make them importable by all modules
- **FR-008**: System MUST support shared pipes (TruncatePipe, SafeHtmlPipe, CurrencyFormatPipe) in `shared/pipes/` for use across all modules
- **FR-009**: System MUST maintain all data models in `core/models/` (Order, Product, Shop, User, Payment models) as shared entities
- **FR-010**: System MUST compile module routes with standalone components (no NgModule declarations required) leveraging Angular's standalone API
- **FR-011**: System MUST produce separate JavaScript chunks during build for each module (main.js, customer-routes.js, seller-routes.js, admin-routes.js) enabling code splitting and lazy loading
- **FR-012**: System MUST ensure that core services maintain global state correctly (AuthService authentication state, GlobalStateService app-wide state) regardless of which module is active
- **FR-013**: System MUST allow migration to occur in phases without breaking existing functionality (Phase 1-6: structure creation, route updates, service migration, testing, cleanup)
- **FR-014**: System MUST support optional path aliases (`@app/*`, `@core/*`, `@modules/*`, `@shared/*`) in `tsconfig.json` for cleaner import statements

### Key Entities

- **Module**: A self-contained feature area (Customer, Seller, Admin) with its own components, services, and routes. Modules are lazy-loaded and independent.
- **Core Services**: Shared services (AuthService, FirebaseService, GlobalStateService, LanguageService, CartService, RazorpayService, WhatsAppService, ShopService) available globally to all modules.
- **Route Guard**: Security mechanism (sellerAuthGuard, adminAuthGuard) that verifies user credentials and role before allowing route activation.
- **Route Definition**: Configuration object that maps URL paths to components or lazy-loaded modules.
- **Lazy-Loaded Chunk**: Separate JavaScript file generated during build that contains code for a specific module, downloaded only when that module is accessed.
- **Standalone Component**: Angular component declared with `standalone: true` that does not require NgModule wrapper.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Project builds successfully with `npm run build:prod` and generates separate lazy-loaded chunks for customer, seller, and admin modules visible in `dist/` folder
- **SC-002**: Initial application bundle (main.js, critical CSS) is under 250KB gzipped, meeting PWA performance standards
- **SC-003**: Customer module chunk loads in under 1 second on 3G network (slow connection) after user navigates to customer routes
- **SC-004**: Seller module is accessible only to authenticated seller users; non-sellers receive 403 Unauthorized when attempting direct navigation
- **SC-005**: Admin routes are protected by adminAuthGuard and only accessible to authenticated admin users; non-admins are redirected to unauthorized page
- **SC-006**: Core services (AuthService, GlobalStateService) maintain consistent state across all three modules; swapping between modules preserves authentication and cart state
- **SC-007**: Lighthouse PWA audit score is at least 85 post-restructure, with performance score ≥90 for Core Web Vitals
- **SC-008**: Zero import errors during migration from flat feature structure to module-based structure; all TypeScript compilation succeeds
- **SC-009**: 100% of shared components and pipes are used consistently across modules (no duplication of component definitions)
- **SC-010**: All 14 implementation checklist items are completed and verified (directory structure, routes, services, guards, testing, cleanup)
- **SC-011**: Module-specific services are scoped correctly and do not leak into other modules; dependency injection creates isolated instances per module
- **SC-012**: Application functionality remains identical before and after restructure; all user workflows (customer shopping, seller dashboard, admin management) work without regression
- **SC-013**: Development build with `npm start` runs without errors and hot-reload functions correctly for both core and module-specific files
- **SC-014**: Route navigation latency (time to display next route) does not exceed 500ms for locally-cached modules or 1500ms for initially-loading modules

---

## Assumptions

1. **Standalone Components**: The project uses Angular's standalone component API (no NgModule declarations). This simplifies module organization and is already in use per the workspace structure.
2. **Lazy Loading Strategy**: `loadChildren` is the primary lazy-loading mechanism. Component-level lazy loading (`loadComponent`) on individual routes is handled within module routes, not at the app level.
3. **Core Services Availability**: Core services are provided at the application root level via Angular's dependency injection and are accessible to all modules automatically.
4. **Route Guards Timing**: Route guards (sellerAuthGuard, adminAuthGuard) execute when routes are accessed; redirects happen synchronously before component is loaded.
5. **Build Optimization**: Angular CLI's production build automatically applies tree-shaking, minification, and code splitting without additional configuration.
6. **Firestore Security**: Firestore security rules already enforce multi-tenant data isolation. No additional security model changes are needed; routes and guards enforce user-level access only.
7. **Migration Window**: The restructure is done in phases with the old `features/` structure coexisting briefly, minimizing risk. Final cleanup only occurs after Phase 6 verification.
8. **Git-Based Rollback**: If issues occur, changes are easily rolled back via git revert since all work is committed incrementally.

---

## Notes & Clarifications

This specification is based on the detailed technical architecture provided in the folder restructure documentation. The feature aligns with the WhatsApp Orders PWA Constitution, specifically:

- **Principle I (Module-First Architecture)**: This feature directly implements the principle of self-contained modules with lazy loading
- **Principle II (PWA-First)**: Lazy loading and code splitting reduce bundle size, supporting offline-resilient PWA goals
- **Principle III (Multi-Tenant Isolation)**: Route guards and auth checks enforce data isolation per shop
- **Principle IV (Standalone Components)**: Only standalone components are used; no NgModule refactoring needed
- **Principle V (Test Coverage)**: Module structure supports unit testing at module boundaries

---

**Status**: Ready for Clarification & Planning  
**Last Updated**: 2026-02-26
