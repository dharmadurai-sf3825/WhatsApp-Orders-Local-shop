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
