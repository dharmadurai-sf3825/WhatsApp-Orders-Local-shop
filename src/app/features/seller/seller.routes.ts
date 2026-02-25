import { Routes } from '@angular/router';
import { sellerAuthGuard } from '../../core/guards/seller-auth.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/seller-login.component').then(m => m.SellerLoginComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // Redirect incomplete seller URLs to dashboard
  {
    path: ':shopSlug',
    redirectTo: ':shopSlug/dashboard',
    pathMatch: 'full'
  },
  // Shop-specific seller routes with :shopSlug parameter
  {
    path: ':shopSlug/dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [sellerAuthGuard]
  },
  {
    path: ':shopSlug/products',
    loadComponent: () => import('./products-management/products-management.component').then(m => m.ProductsManagementComponent),
    canActivate: [sellerAuthGuard]
  },
  {
    path: ':shopSlug/orders',
    loadComponent: () => import('./orders-management/orders-management.component').then(m => m.OrdersManagementComponent),
    canActivate: [sellerAuthGuard]
  }
];
