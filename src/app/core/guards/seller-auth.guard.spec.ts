import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { sellerAuthGuard } from './seller-auth.guard';
import { AuthService } from '../services/auth.service';
import { GlobalStateService } from '../services/global-state.service';

/**
 * Seller Auth Guard Tests - Principle III: Multi-Tenant Data Isolation
 * Verifies route protection and shop ownership validation
 */
describe('SellerAuthGuard - Route Protection (Principle III)', () => {
  let guard: any;
  let authService: jasmine.SpyObj<AuthService>;
  let globalStateService: jasmine.SpyObj<GlobalStateService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getCurrentUser'])
        },
        {
          provide: GlobalStateService,
          useValue: jasmine.createSpyObj('GlobalStateService', ['getCurrentShop', 'loadShop'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    globalStateService = TestBed.inject(GlobalStateService) as jasmine.SpyObj<GlobalStateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    guard = sellerAuthGuard;
  });

  describe('Authentication Check', () => {
    it('should deny access to unauthenticated users', (done) => {
      authService.isAuthenticated.and.returnValue(false);

      guard(null, null).then((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/seller/login']);
        done();
      });
    });

    it('should allow access to authenticated sellers', (done) => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ uid: 'seller-123', role: 'seller' });

      guard(null, null).then((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  describe('Shop Ownership Verification', () => {
    it('should verify user owns the shop before granting access', (done) => {
      authService.isAuthenticated.and.returnValue(true);
      globalStateService.getCurrentShop.and.returnValue({ id: 'shop-1', sellerId: 'seller-123' });

      guard(null, null).then((result: boolean) => {
        expect(globalStateService.getCurrentShop).toHaveBeenCalled();
        expect(result).toBeTrue();
        done();
      });
    });

    it('should deny access if seller does not own the shop', (done) => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ uid: 'seller-456', role: 'seller' });
      globalStateService.getCurrentShop.and.returnValue({ id: 'shop-1', sellerId: 'seller-123' });

      guard(null, null).then((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
        done();
      });
    });
  });

  describe('Multi-Tenant Boundaries (Principle III)', () => {
    it('should prevent seller from accessing another seller shop URL', (done) => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ uid: 'seller-1', role: 'seller' });
      // ActivatedRouteSnapshot with shopSlug of seller-2
      const route: any = {
        params: { shopSlug: 'shop-of-seller-2' }
      };

      guard(route, null).then((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
        done();
      });
    });
  });
});
