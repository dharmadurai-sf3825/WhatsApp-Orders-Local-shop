import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth, signOut } from '@angular/fire/auth';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent implements OnInit {
  language = 'en';
  attemptedShop = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    
    this.route.queryParams.subscribe(params => {
      this.attemptedShop = params['shop'] || '';
    });
  }

  async logout() {
    try {
      console.log('🔓 Logging out from unauthorized page...');
      
      // Check if user is admin
      const isAdmin = await this.authService.isAdmin();
      
      await signOut(this.auth);
      console.log('✅ Logout successful');
      
      // Redirect to appropriate login page based on role
      if (isAdmin) {
        console.log('👨‍💼 Redirecting to admin login...');
        this.router.navigate(['/admin/login']);
      } else {
        console.log('🏪 Redirecting to seller login...');
        this.router.navigate(['/seller/login']);
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback: redirect to landing page on error
      this.router.navigate(['/landing']);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}

