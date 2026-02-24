import { Routes } from '@angular/router';

export const routes: Routes = [
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
  
  // Admin routes
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  
  // Seller routes (independent, not under shop slug)
  {
    path: 'seller',
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.SELLER_ROUTES)
  },
  
  // Shop-based routes with slug parameter (customer-facing only)
  {
    path: ':shopSlug',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/customer/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/customer/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/customer/product-details/product-details.component').then(m => m.ProductDetailsComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/customer/cart/cart.component').then(m => m.CartComponent)
      }
    ]
  },
  
  // Default route - redirect to seller login
  {
    path: '',
    redirectTo: '/seller/login',
    pathMatch: 'full'
  },
  
  // Catch-all - redirect to error page
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full'
  }
];
