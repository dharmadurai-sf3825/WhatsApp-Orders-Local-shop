import { Routes } from '@angular/router';
import { sellerAuthGuard } from '../../core/guards/seller-auth.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/seller-login.component').then(m => m.SellerLoginComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [sellerAuthGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./products-management/products-management.component').then(m => m.ProductsManagementComponent),
    canActivate: [sellerAuthGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders-management/orders-management.component').then(m => m.OrdersManagementComponent),
    canActivate: [sellerAuthGuard]
  }
];
