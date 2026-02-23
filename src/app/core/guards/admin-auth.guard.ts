import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  console.log('🔐 Admin Auth Guard: Checking admin access...');

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        console.log('❌ Not authenticated, redirecting to admin login');
        router.navigate(['/admin/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      }

      console.log('✅ User authenticated:', user.email);

      // Check if user is admin in Firestore
      return from(checkAdminRole(firestore, user.uid)).pipe(
        map(isAdmin => {
          if (isAdmin) {
            console.log('✅ User is admin');
            return true;
          } else {
            console.log('❌ User is NOT admin');
            router.navigate(['/unauthorized'], {
              queryParams: { 
                message: 'Admin access required'
              }
            });
            return false;
          }
        })
      );
    })
  );
};

async function checkAdminRole(firestore: Firestore, uid: string): Promise<boolean> {
  try {
    console.log('🔍 Checking admin document for UID:', uid);
    const adminDoc = await getDoc(doc(firestore, 'admin', uid));
    
    console.log('📄 Admin document exists:', adminDoc.exists());
    
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      return data['role'] === 'admin' || data['role'] === 'owner';
    }
    
    // Fallback: Check if email is admin email
    // For development, you can add your email here
    // In production, only use Firestore
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}
