import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth, signOut } from '@angular/fire/auth';
import { LanguageService } from '../../core/services/language.service';

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
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    
    this.route.queryParams.subscribe(params => {
      this.attemptedShop = params['shop'] || '';
    });
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
