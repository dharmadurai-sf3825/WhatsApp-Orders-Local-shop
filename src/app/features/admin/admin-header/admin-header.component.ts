import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="admin-header">
      <div class="header-content">
        <div class="left-section">
          <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
          <span class="title">Admin Panel</span>
          <span class="divider">|</span>
          <span class="subtitle">Project Owner</span>
        </div>

        <div class="right-section">
          <!-- Desktop Navigation -->
          <div class="desktop-nav">
            <button mat-button (click)="goToSellers()" class="nav-button">
              <mat-icon>people</mat-icon>
              <span>Sellers</span>
            </button>

            <button mat-button (click)="goToHome()" class="nav-button">
              <mat-icon>home</mat-icon>
              <span>Home</span>
            </button>

            <button mat-raised-button color="warn" (click)="logout()" class="logout-button">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </div>

          <!-- Mobile Menu -->
          <div class="mobile-nav">
            <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-button">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="goToSellers()">
                <mat-icon>people</mat-icon>
                <span>Manage Sellers</span>
              </button>
              <button mat-menu-item (click)="goToHome()">
                <mat-icon>home</mat-icon>
                <span>Go to Home</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="logout-menu-item">
                <mat-icon color="warn">logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .admin-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .admin-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .divider {
      color: rgba(255, 255, 255, 0.5);
    }

    .subtitle {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .desktop-nav {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .mobile-nav {
      display: none;
    }

    .nav-button {
      color: white !important;
    }

    .nav-button mat-icon {
      margin-right: 5px;
    }

    .logout-button {
      background-color: #f44336 !important;
      color: white !important;
    }

    .logout-button mat-icon {
      margin-right: 5px;
    }

    .logout-menu-item {
      color: #f44336;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .header-content {
        padding: 0 10px;
      }

      .left-section {
        gap: 8px;
      }

      .admin-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .title {
        font-size: 1rem;
      }

      .divider,
      .subtitle {
        display: none;
      }

      .desktop-nav {
        display: none;
      }

      .mobile-nav {
        display: block;
      }

      .menu-button {
        color: white;
      }
    }

    @media (max-width: 480px) {
      .title {
        font-size: 0.9rem;
      }

      .admin-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
  `]
})
export class AdminHeaderComponent {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  goToSellers() {
    this.router.navigate(['/admin/sellers']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  async logout() {
    if (confirm('Are you sure you want to logout from Admin Panel?')) {
      try {
        console.log('🚪 Admin logging out...');
        await signOut(this.auth);
        console.log('✅ Admin logged out successfully');
        this.router.navigate(['/admin/login']);
      } catch (error) {
        console.error('❌ Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  }
}
