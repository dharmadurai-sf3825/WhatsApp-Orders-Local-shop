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
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-login',
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
    <div class="admin-login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
            <h1>Admin Login</h1>
            <p>Project Owner Access</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="form-container">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Admin Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" [disabled]="loading" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
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
            <span *ngIf="!loading">Login as Admin</span>
          </button>

          <button mat-button (click)="goToHome()" [disabled]="loading" class="full-width">
            Back to Home
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="info-card">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h3>Restricted Access</h3>
        <p>This area is only for project owners and administrators.</p>
        <p>Unauthorized access attempts are logged.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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

    .admin-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #1e3c72;
      margin-bottom: 10px;
    }

    .header-content h1 {
      color: #1e3c72;
      margin: 10px 0 5px 0;
    }

    .header-content p {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
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

    .info-card {
      width: 100%;
      max-width: 400px;
      background: rgba(255, 255, 255, 0.95);
      text-align: center;
    }

    .warning-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ff9800;
      margin-bottom: 10px;
    }

    .info-card h3 {
      color: #ff9800;
      margin: 10px 0;
    }

    .info-card p {
      color: #666;
      margin: 5px 0;
      font-size: 0.9rem;
    }

    mat-spinner {
      display: inline-block;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .admin-login-container {
        padding: 10px;
      }

      .login-card, .info-card {
        max-width: 100%;
      }
    }
  `]
})
export class AdminLoginComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/admin/sellers';
    });
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('🔐 Admin login attempt:', this.email);
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.password
      );

      console.log('✅ Authentication successful');
      console.log('🔍 Checking admin role for UID:', userCredential.user.uid);

      // Check if user is admin
      const adminDoc = await getDoc(doc(this.firestore, 'admin', userCredential.user.uid));
      
      if (!adminDoc.exists()) {
        console.log('❌ User is not an admin');
        this.errorMessage = 'Access denied. Admin privileges required.';
        await this.auth.signOut();
        this.loading = false;
        return;
      }

      const adminData = adminDoc.data();
      if (adminData['role'] !== 'admin' && adminData['role'] !== 'owner') {
        console.log('❌ Insufficient admin privileges');
        this.errorMessage = 'Insufficient privileges. Owner access required.';
        await this.auth.signOut();
        this.loading = false;
        return;
      }

      console.log('✅ Admin access granted');
      console.log('↩️ Redirecting to:', this.returnUrl);
      
      this.router.navigateByUrl(this.returnUrl);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'Admin account not found';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          this.errorMessage = 'Login failed. Please try again';
      }
    } finally {
      this.loading = false;
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
