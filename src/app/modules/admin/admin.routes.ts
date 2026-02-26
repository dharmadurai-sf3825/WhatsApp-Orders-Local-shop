import { Routes } from '@angular/router';
import { adminAuthGuard } from '../../core/guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/admin-login.component')
      .then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./components/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
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
