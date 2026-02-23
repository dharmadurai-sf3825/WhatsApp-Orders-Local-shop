import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { ShopService } from '../../../core/services/shop.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-seller-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="header-content">
            <h1>{{ language === 'ta' ? 'விற்பனையாளர் உள்நுழைவு' : 'Seller Login' }}</h1>
            <h2 *ngIf="currentShop">{{ currentShop.name }}</h2>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Login Form -->
          <div class="form-container">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'மின்னஞ்சல்' : 'Email' }}</mat-label>
              <input matInput type="email" [(ngModel)]="email" [disabled]="loading" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'கடவுச்சொல்' : 'Password' }}</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     [(ngModel)]="password" [disabled]="loading" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" 
                  (click)="login()" 
                  [disabled]="loading || !email || !password"
                  class="full-width">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">
              {{ language === 'ta' ? 'உள்நுழை' : 'Login' }}
            </span>
          </button>

          <div class="divider">
            <span>{{ language === 'ta' ? 'அல்லது' : 'OR' }}</span>
          </div>

          <button mat-button color="accent" 
                  (click)="goToCustomer()"
                  [disabled]="loading"
                  class="full-width">
            {{ language === 'ta' ? 'வாடிக்கையாளராக தொடரவும்' : 'Continue as Customer' }}
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Info Box -->
      <mat-card class="info-card">
        <h3>{{ language === 'ta' ? 'விற்பனையாளர் அணுகல்' : 'Seller Access' }}</h3>
        <p *ngIf="language === 'ta'">
          இந்த பகுதி கடை உரிமையாளர்களுக்கானது. உங்களிடம் விற்பனையாளர் கணக்கு இல்லை என்றால், 
          கடை உரிமையாளரை தொடர்பு கொள்ளவும்.
        </p>
        <p *ngIf="language === 'en'">
          This section is for shop owners only. If you don't have a seller account, 
          please contact the shop owner.
        </p>

        <div class="demo-credentials">
          <h4>{{ language === 'ta' ? 'டெமோ நற்சான்றிதழ்கள்' : 'Demo Credentials' }}</h4>
          <p><strong>Email:</strong> seller&#64;ganeshbakery.com</p>
          <p><strong>Password:</strong> demo123456</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      margin-bottom: 20px;
    }

    .header-content {
      text-align: center;
      width: 100%;
      padding: 20px 0;
    }

    .header-content h1 {
      color: var(--whatsapp-teal);
      margin: 0 0 10px 0;
    }

    .header-content h2 {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
      font-weight: 400;
    }

    .form-container {
      padding: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      margin-top: 10px;
    }

    mat-card-actions {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .divider {
      text-align: center;
      position: relative;
      margin: 10px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background: #ddd;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .divider span {
      background: white;
      padding: 0 10px;
      color: #999;
      font-size: 0.9rem;
    }

    .info-card {
      width: 100%;
      max-width: 400px;
      background: rgba(255, 255, 255, 0.95);
    }

    .info-card h3 {
      color: var(--whatsapp-teal);
      margin-top: 0;
    }

    .info-card p {
      color: #666;
      line-height: 1.6;
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }

    .demo-credentials h4 {
      color: var(--whatsapp-green);
      margin: 0 0 10px 0;
      font-size: 0.9rem;
    }

    .demo-credentials p {
      margin: 5px 0;
      font-family: monospace;
      font-size: 0.9rem;
    }

    mat-spinner {
      display: inline-block;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .login-container {
        padding: 10px;
      }

      .login-card,
      .info-card {
        max-width: 100%;
      }
    }
  `]
})
export class SellerLoginComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';
  language = 'en';
  currentShop: Shop | null = null;
  returnUrl = '';

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
    });

    // Get return URL from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '';
    });
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('🔐 Attempting login for:', this.email);
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.password
      );

      console.log('✅ Login successful:', userCredential.user.uid);

      // Initialize user data in Firestore
      await this.authService.initializeUserData(userCredential.user);

      // Verify user has access to this shop
      if (this.currentShop) {
        const hasAccess = await this.authService.canAccessShop(this.currentShop.slug);
        
        if (!hasAccess) {
          console.log('❌ User does not have access to this shop');
          this.errorMessage = this.language === 'ta'
            ? 'இந்த கடையை அணுக உங்களுக்கு அனுமதி இல்லை'
            : 'You do not have permission to access this shop';
          
          // Sign out the user
          await this.auth.signOut();
          this.loading = false;
          return;
        }
      }

      // Redirect to return URL or dashboard
      const redirectUrl = this.returnUrl || 
        (this.currentShop ? `/${this.currentShop.slug}/seller/dashboard` : '/seller/dashboard');
      
      console.log('↩️ Redirecting to:', redirectUrl);
      this.router.navigateByUrl(redirectUrl);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Handle specific error codes
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = this.language === 'ta' 
            ? 'தவறான மின்னஞ்சல் முகவரி' 
            : 'Invalid email address';
          break;
        case 'auth/user-not-found':
          this.errorMessage = this.language === 'ta' 
            ? 'பயனர் கணக்கு காணப்படவில்லை' 
            : 'User account not found';
          break;
        case 'auth/wrong-password':
          this.errorMessage = this.language === 'ta' 
            ? 'தவறான கடவுச்சொல்' 
            : 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = this.language === 'ta' 
            ? 'பல முயற்சிகள். சிறிது நேரம் காத்திருக்கவும்' 
            : 'Too many attempts. Please try again later';
          break;
        default:
          this.errorMessage = this.language === 'ta' 
            ? 'உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்' 
            : 'Login failed. Please try again';
      }
    } finally {
      this.loading = false;
    }
  }

  goToCustomer() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'home']);
    }
  }
}
