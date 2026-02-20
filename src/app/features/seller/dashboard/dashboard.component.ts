import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ language === 'ta' ? 'விற்பனையாளர் கட்டுப்பாடு' : 'Seller Dashboard' }}</h1>
      </div>

      <div class="dashboard-grid">
        <!-- Products Management -->
        <mat-card class="dashboard-card" (click)="navigateTo('/seller/products')">
          <mat-icon class="card-icon">inventory_2</mat-icon>
          <h2>{{ language === 'ta' ? 'பொருட்கள் நிர்வாகம்' : 'Products Management' }}</h2>
          <p>{{ language === 'ta' ? 'பொருட்களை சேர், திருத்து மற்றும் நிர்வகி' : 'Add, edit and manage products' }}</p>
        </mat-card>

        <!-- Orders Management -->
        <mat-card class="dashboard-card" (click)="navigateTo('/seller/orders')">
          <mat-icon class="card-icon">shopping_bag</mat-icon>
          <h2>{{ language === 'ta' ? 'ஆர்டர்கள் நிர்வாகம்' : 'Orders Management' }}</h2>
          <p>{{ language === 'ta' ? 'ஆர்டர்களைப் பார்க்கவும் மற்றும் நிர்வகிக்கவும்' : 'View and manage orders' }}</p>
        </mat-card>

        <!-- Payment Links -->
        <mat-card class="dashboard-card">
          <mat-icon class="card-icon">payment</mat-icon>
          <h2>{{ language === 'ta' ? 'கட்டண இணைப்புகள்' : 'Payment Links' }}</h2>
          <p>{{ language === 'ta' ? 'Razorpay கட்டண இணைப்புகளை உருவாக்கவும்' : 'Create Razorpay payment links' }}</p>
        </mat-card>

        <!-- Shop Settings -->
        <mat-card class="dashboard-card">
          <mat-icon class="card-icon">store</mat-icon>
          <h2>{{ language === 'ta' ? 'கடை அமைப்புகள்' : 'Shop Settings' }}</h2>
          <p>{{ language === 'ta' ? 'உங்கள் கடை விவரங்களை நிர்வகிக்கவும்' : 'Manage your shop details' }}</p>
        </mat-card>

        <!-- Reports -->
        <mat-card class="dashboard-card">
          <mat-icon class="card-icon">analytics</mat-icon>
          <h2>{{ language === 'ta' ? 'அறிக்கைகள்' : 'Reports' }}</h2>
          <p>{{ language === 'ta' ? 'விற்பனை மற்றும் வருவாய் அறிக்கைகள்' : 'Sales and revenue reports' }}</p>
        </mat-card>

        <!-- Help -->
        <mat-card class="dashboard-card">
          <mat-icon class="card-icon">help</mat-icon>
          <h2>{{ language === 'ta' ? 'உதவி மற்றும் ஆதரவு' : 'Help & Support' }}</h2>
          <p>{{ language === 'ta' ? 'வழிகாட்டிகள் மற்றும் ஆதரவு' : 'Guides and support' }}</p>
        </mat-card>
      </div>

      <!-- Quick Stats -->
      <div class="stats-container">
        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>shopping_cart</mat-icon>
          </div>
          <div class="stat-info">
            <h3>{{ language === 'ta' ? 'இன்றைய ஆர்டர்கள்' : 'Today\'s Orders' }}</h3>
            <p class="stat-value">0</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>currency_rupee</mat-icon>
          </div>
          <div class="stat-info">
            <h3>{{ language === 'ta' ? 'இன்றைய வருவாய்' : 'Today\'s Revenue' }}</h3>
            <p class="stat-value">₹0</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>inventory</mat-icon>
          </div>
          <div class="stat-info">
            <h3>{{ language === 'ta' ? 'மொத்த பொருட்கள்' : 'Total Products' }}</h3>
            <p class="stat-value">0</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: var(--whatsapp-teal);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .dashboard-card {
      padding: 30px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      text-align: center;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .card-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--whatsapp-green);
      margin-bottom: 15px;
    }

    .dashboard-card h2 {
      margin: 10px 0;
      font-size: 1.2rem;
      color: #333;
    }

    .dashboard-card p {
      margin: 10px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .stat-card {
      padding: 20px;
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .stat-icon {
      background: var(--whatsapp-light-green);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--whatsapp-green);
    }

    .stat-info {
      flex: 1;
    }

    .stat-info h3 {
      margin: 0 0 5px 0;
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--whatsapp-green);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stats-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  language = 'ta';

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
