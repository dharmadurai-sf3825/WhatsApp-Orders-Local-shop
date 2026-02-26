import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing/Shop selection page (for non-logged-in users)
  {
    path: 'landing',
    loadComponent: () => import('./features/home/landing.component').then(m => m.LandingComponent)
  },

  // Error page
  {
    path: 'error',
    loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  
  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  
  // Admin module routes
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  
  // Seller module routes (independent, not under shop slug)
  {
    path: 'seller',
    loadChildren: () => import('./modules/seller/seller.routes').then(m => m.SELLER_ROUTES)
  },
  
  // Customer module routes with shop slug parameter
  {
    path: ':shopSlug',
    loadChildren: () => import('./modules/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },
  
  // Smart root: redirects based on user status
  // - Not logged in → landing page (shop selection)
  // - Logged in as seller → seller dashboard
  // - Logged in as admin → admin sellers management
  {
    path: '',
    loadComponent: () => import('./features/home/smart-root.component').then(m => m.SmartRootComponent),
    pathMatch: 'full'
  },
  
  // Catch-all - redirect to error page
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full'
  }
];
