import { Routes } from '@angular/router';

export const routes: Routes = [
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
  
  // Seller routes (must come before shop routes to avoid conflicts)
  {
    path: 'seller',
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.SELLER_ROUTES)
  },
  
  // Shop-based routes with slug parameter
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
      },
      // Seller routes within shop context
      {
        path: 'seller',
        loadChildren: () => import('./features/seller/seller.routes').then(m => m.SELLER_ROUTES)
      }
    ]
  },
  
  // Fallback routes (without shop slug) - support old query param style
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
  },
  
  // Default route - redirect to demo shop
  {
    path: '',
    redirectTo: 'demo-shop/home',
    pathMatch: 'full'
  },
  
  // Catch-all - redirect to demo shop
  {
    path: '**',
    redirectTo: 'demo-shop/home'
  }
];
