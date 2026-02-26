# Admin Module Route Contract

**Module**: Admin Panel  
**Purpose**: Platform administration, seller management, reporting  
**Protection**: `adminAuthGuard` (role === 'admin')

---

## Route Structure

```typescript
export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/admin-login.component')
      .then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'sellers',
        pathMatch: 'full'
      },
      {
        path: 'sellers',
        loadComponent: () => import('./components/sellers-management/sellers-management.component')
          .then(m => m.SellersManagementComponent)
      },
      {
        path: 'sellers/:id',
        loadComponent: () => import('./components/sellers-management/seller-details.component')
          .then(m => m.SellerDetailsComponent)
      },
      {
        path: 'shops',
        loadComponent: () => import('./components/shops-management/shops-management.component')
          .then(m => m.ShopsManagementComponent)
      },
      {
        path: 'shops/:id',
        loadComponent: () => import('./components/shops-management/shop-details.component')
          .then(m => m.ShopDetailsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component')
          .then(m => m.ReportsComponent)
      }
    ]
  }
];
```

---

## Route Examples

| Path | Component | Protection | Purpose |
|------|-----------|-----------|---------|
| `/admin/login` | AdminLoginComponent | None | Firebase login |
| `/admin` | AdminLayoutComponent | adminAuthGuard | Dashboard wrapper |
| `/admin/sellers` | SellersManagementComponent | adminAuthGuard | Seller list & management |
| `/admin/sellers/user123` | SellerDetailsComponent | adminAuthGuard | Seller account details |
| `/admin/shops` | ShopsManagementComponent | adminAuthGuard | Shop list & configuration |
| `/admin/shops/shop456` | ShopDetailsComponent | adminAuthGuard | Shop settings & metrics |
| `/admin/reports` | ReportsComponent | adminAuthGuard | Platform analytics |

---

## Service Contracts

### AdminSellerService
```typescript
interface IAdminSellerService {
  // Get all sellers
  getSellers(filters?: SellerFilter): Observable<SellerAccount[]>;
  
  // Get seller details
  getSellerDetails(userId: string): Observable<SellerProfile>;
  
  // Approve seller onboarding
  approveSeller(userId: string): Observable<void>;
  
  // Disable seller account
  disableSeller(userId: string, reason: string): Observable<void>;
  
  // Update seller permissions
  updatePermissions(userId: string, permissions: string[]): Observable<void>;
  
  // Reset seller password (send reset email)
  resetPassword(userId: string): Observable<void>;
  
  // Get seller financial summary
  getFinancialSummary(userId: string): Observable<FinancialSummary>;
  
  // Audit seller transactions
  getAuditLog(userId: string): Observable<AuditLog[]>;
}
```

### AdminShopService
```typescript
interface IAdminShopService {
  // Get all shops
  getShops(filters?: ShopFilter): Observable<AdminShop[]>;
  
  // Get shop details
  getShopDetails(shopId: string): Observable<AdminShop>;
  
  // Update commission rate
  updateCommissionRate(shopId: string, rate: number): Observable<void>;
  
  // Suspend shop
  suspendShop(shopId: string, reason: string): Observable<void>;
  
  // Restore suspended shop
  restoreShop(shopId: string): Observable<void>;
  
  // Get shop compliance score
  getComplianceScore(shopId: string): Observable<ComplianceScore>;
  
  // Get shop audit logs
  getAuditLogs(shopId: string): Observable<AuditLog[]>;
}
```

### AdminReportsService (NEW)
```typescript
interface IAdminReportsService {
  // Get platform-wide revenue metrics
  getRevenueMetrics(startDate: Date, endDate: Date): Observable<RevenueMetrics>;
  
  // Get seller rankings
  getSellerRankings(metric: 'revenue' | 'orders' | 'rating'): Observable<SellerRanking[]>;
  
  // Get fraud detection alerts
  detectFraudPatterns(): Observable<FraudAlert[]>;
  
  // Get support ticket dashboard
  getSupportTickets(status: 'open' | 'resolved'): Observable<SupportTicket[]>;
  
  // Get platform health metrics
  getHealthMetrics(): Observable<PlatformHealth>;
  
  // Export report as CSV
  exportReport(type: 'revenue' | 'sellers' | 'shops'): Observable<Blob>;
}
```

---

## Data Contracts (Forms)

### Seller Approval Form
```typescript
interface SellerApprovalRequest {
  userId: string;
  email: string;
  phone: string;
  shopName: string;
  category: string;
  documents: Document[]; // KYC verification
  commissionRate: number;
  notes?: string;
}
```

### Shop Suspension Form
```typescript
interface ShopSuspensionRequest {
  shopId: string;
  reason: 'policy_violation' | 'payment_failure' | 'fraud_alert' | 'other';
  description: string;
  suspensionDays?: number;
  notifyVia: 'email' | 'whatsapp' | 'both';
}
```

### Report Query Form
```typescript
interface ReportQuery {
  startDate: Date;
  endDate: Date;
  metric: 'revenue' | 'orders' | 'sellers' | 'shops';
  groupBy: 'daily' | 'weekly' | 'monthly';
  filters?: {
    category?: string;
    minRevenue?: number;
    sellerRating?: number;
  };
}
```

---

## Guard Contract

### adminAuthGuard
```typescript
import { CanActivateFn } from '@angular/router';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  // Validates:
  // 1. User is authenticated (Firebase)
  // 2. User role === 'admin'
  // 3. User account is active (not disabled)
  
  // Returns: true (allowed) | false (redirects to login) | UrlTree (redirect)
};
```

---

## Multi-Tenant Isolation Rules

- Admins can view ALL sellers and shops (no isolation)
- However, **Firestore rules still enforce ownership per seller/shop** within modules
- Admin routes cannot be accessed by sellers or customers
- All admin queries bypass shopId filtering (admin-only privilege)

---

## Error Handling

| Error | Status | Handler |
|-------|--------|---------|
| Not authenticated | 401 | Redirect to `/admin/login` |
| Not an admin account | 403 | Show "Access Denied" |
| Seller not found | 404 | Redirect to sellers list |
| Shop not found | 404 | Redirect to shops list |
| Permission denied (Firestore rule) | 403 | Show "Insufficient permissions" |
| Network error | Network | Show cached data or queue updates |

---

## Performance Requirements

- **Admin dashboard load**: < 2s (cached real-time metrics)
- **Seller list**: Pagination (50 items/page)
- **Reports generation**: < 5s (date range aggregation)
- **Bulk operations**: < 500ms per seller/shop

---

**Contract Version**: 1.0 | **Last Updated**: 2026-02-26
