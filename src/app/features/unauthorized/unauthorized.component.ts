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
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="error-icon">lock</mat-icon>
            <h1>{{ language === 'ta' ? 'அணுகல் மறுக்கப்பட்டது' : 'Access Denied' }}</h1>
          </div>
        </mat-card-header>

        <mat-card-content>
          <p class="message">
            <span *ngIf="language === 'ta'">
              நீங்கள் இந்த கடையை அணுக அங்கீகாரம் பெறவில்லை.
              <br><br>
              ஒவ்வொரு விற்பனையாளரும் தங்கள் கடையை மட்டுமே நிர்வகிக்க முடியும்.
            </span>
            <span *ngIf="language === 'en'">
              You are not authorized to access this shop.
              <br><br>
              Each seller can only manage their own shop.
            </span>
          </p>

          <div class="info-box" *ngIf="attemptedShop">
            <mat-icon>info</mat-icon>
            <div>
              <strong>{{ language === 'ta' ? 'முயற்சிக்கப்பட்ட கடை' : 'Attempted Shop' }}:</strong>
              <span class="shop-name">{{ attemptedShop }}</span>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="logout()">
            <mat-icon>logout</mat-icon>
            {{ language === 'ta' ? 'வெளியேறு' : 'Logout' }}
          </button>

          <button mat-button (click)="goHome()">
            <mat-icon>home</mat-icon>
            {{ language === 'ta' ? 'முகப்புக்கு செல்' : 'Go to Home' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .unauthorized-card {
      width: 100%;
      max-width: 500px;
    }

    .header-content {
      text-align: center;
      width: 100%;
      padding: 20px;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 10px;
    }

    .header-content h1 {
      color: #f44336;
      margin: 0;
    }

    .message {
      text-align: center;
      font-size: 1.1rem;
      line-height: 1.8;
      color: #666;
      margin: 20px 0;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 15px;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      margin: 20px 0;
    }

    .info-box mat-icon {
      color: #ff9800;
    }

    .shop-name {
      display: block;
      font-family: monospace;
      color: #333;
      margin-top: 5px;
    }

    mat-card-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
    }

    button {
      width: 100%;
    }

    button mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .unauthorized-card {
        max-width: 100%;
      }
    }
  `]
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
