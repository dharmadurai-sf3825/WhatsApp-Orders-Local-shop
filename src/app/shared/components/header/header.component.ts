import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1>WhatsApp Orders</h1>
        </div>
        <nav class="header-nav" *ngIf="showNav">
          <a routerLink="/landing">Home</a>
          <a *ngIf="!isLoggedIn" routerLink="/landing">Shop</a>
        </nav>
        <div class="header-actions">
          <button *ngIf="isLoggedIn" (click)="onLogout()">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: #27ae60;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .header-nav {
      display: flex;
      gap: 2rem;
    }
    .header-nav a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }
    .header-nav a:hover {
      opacity: 0.8;
    }
    .header-actions button {
      background-color: #c0392b;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .header-actions button:hover {
      background-color: #a93226;
    }
  `]
})
export class HeaderComponent {
  @Input() showNav = true;
  @Input() isLoggedIn = false;

  onLogout() {
    // Logout logic will be implemented
  }
}
