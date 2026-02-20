import { Routes } from '@angular/router';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products-management/products-management.component').then(m => m.ProductsManagementComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders-management/orders-management.component').then(m => m.OrdersManagementComponent)
  }
];
