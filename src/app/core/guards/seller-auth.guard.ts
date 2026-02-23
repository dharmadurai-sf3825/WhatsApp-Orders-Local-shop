import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

export const sellerAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Seller Auth Guard: Checking access...');

  // Get current shop from route
  const shopSlug = route.parent?.paramMap.get('shopSlug') || '';
  
  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      console.log('👤 User:', user?.email || 'Not signed in');
      console.log('🏪 Shop:', shopSlug);

      if (!user) {
        // Not signed in - redirect to login
        console.log('❌ Access denied: Not authenticated');
        console.log('💡 Redirecting to login page...');
        
        // Store the intended URL to redirect back after login
        const returnUrl = state.url;
        router.navigate([shopSlug, 'seller', 'login'], { 
          queryParams: { returnUrl } 
        });
        return of(false);
      }

      // Verify user has access to this specific shop
      return from(authService.canAccessShop(shopSlug)).pipe(
        map(hasAccess => {
          if (hasAccess) {
            console.log(`✅ Access granted: User ${user.email} owns shop ${shopSlug}`);
            return true;
          } else {
            console.log(`❌ Access denied: User ${user.email} does NOT own shop ${shopSlug}`);
            
            // Redirect to unauthorized page
            router.navigate(['/unauthorized'], {
              queryParams: { 
                shop: shopSlug,
                message: 'You do not have permission to access this shop'
              }
            });
            
            return false;
          }
        })
      );
    })
  );
};
