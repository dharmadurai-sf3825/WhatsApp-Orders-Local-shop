import { Routes } from '@angular/router';
import { adminAuthGuard } from '../../core/guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    redirectTo: 'sellers',
    pathMatch: 'full'
  },
  {
    path: 'sellers',
    loadComponent: () => import('./sellers-management/sellers-management.component').then(m => m.SellersManagementComponent),
    canActivate: [adminAuthGuard]
  }
];
