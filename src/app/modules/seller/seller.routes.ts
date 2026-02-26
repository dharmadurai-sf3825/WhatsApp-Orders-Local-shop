import { Routes } from '@angular/router';
import { sellerAuthGuard } from '../../core/guards/seller-auth.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/seller-login.component')
      .then(m => m.SellerLoginComponent)
  },
  {
    path: ':shopSlug',
    canActivate: [sellerAuthGuard],
    loadComponent: () => import('./components/seller-layout/seller-layout.component')
      .then(m => m.SellerLayoutComponent),
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
