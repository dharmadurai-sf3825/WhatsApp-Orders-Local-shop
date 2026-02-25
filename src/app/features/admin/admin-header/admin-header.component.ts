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
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
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
        // Redirect to admin login page (NOT landing page)
        this.router.navigate(['/admin/login']);
      } catch (error) {
        console.error('❌ Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  }
}
