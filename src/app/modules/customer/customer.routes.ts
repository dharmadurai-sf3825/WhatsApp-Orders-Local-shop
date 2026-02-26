import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: ':shopSlug',
    loadComponent: () => import('./components/customer-layout/customer-layout.component')
      .then(m => m.CustomerLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products.component')
          .then(m => m.ProductsComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./components/product-details/product-details.component')
          .then(m => m.ProductDetailsComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart/cart.component')
          .then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./components/checkout/checkout.component')
          .then(m => m.CheckoutComponent)
      }
    ]
  }
];
