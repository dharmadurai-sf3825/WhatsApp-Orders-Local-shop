import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-smart-root',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p>{{ loadingMessage }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      gap: 20px;
    }

    p {
      font-size: 16px;
      margin: 0;
    }
  `]
})
export class SmartRootComponent implements OnInit {
  loadingMessage = 'Loading...';

  constructor(
    private router: Router,
    private auth: Auth,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    console.log('🔄 Smart Root Component: Checking user status...');

    // Check if user is authenticated
    authState(this.auth)
      .pipe(take(1))
      .subscribe(async (user) => {
        if (!user) {
          console.log('👤 No user logged in → Show landing page');
          this.loadingMessage = 'Showing shop selection...';
          this.router.navigate(['/landing']);
          return;
        }

        console.log('✅ User logged in:', user.email);

        // Check if admin
        const isAdmin = await this.authService.isAdmin();
        if (isAdmin) {
          console.log('👨‍💼 User is admin → Redirect to /admin/sellers');
          this.loadingMessage = 'Redirecting to admin dashboard...';
          this.router.navigate(['/admin/sellers']);
          return;
        }

        console.log('👨‍💼 User is seller → Redirect to seller dashboard');

        // Get first shop slug and redirect
        const shopSlug = await this.authService.getFirstUserShop();
        if (shopSlug) {
          console.log('🏪 Redirecting to seller dashboard:', shopSlug);
          this.loadingMessage = 'Redirecting to seller dashboard...';
          this.router.navigate([`/seller/${shopSlug}/dashboard`]);
        } else {
          console.log('⚠️ No shop found for user');
          this.loadingMessage = 'No shop assigned. Redirecting...';
          this.router.navigate(['/landing']);
        }
      });
  }
}
