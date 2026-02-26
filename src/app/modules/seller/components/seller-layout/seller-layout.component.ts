import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="seller-layout">
      <header class="seller-header">
        <!-- Seller header content will go here -->
        <h1>Seller Dashboard</h1>
        <nav class="seller-nav">
          <a routerLink="dashboard">Dashboard</a>
          <a routerLink="products">Products</a>
          <a routerLink="orders">Orders</a>
          <a routerLink="analytics">Analytics</a>
        </nav>
      </header>
      <main class="seller-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="seller-footer">
        <!-- Footer content will go here -->
        <p>&copy; 2024 WhatsApp Orders. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .seller-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .seller-header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      border-bottom: 1px solid #ddd;
    }
    .seller-nav {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .seller-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .seller-nav a:hover {
      background-color: #34495e;
    }
    .seller-content {
      flex: 1;
      padding: 2rem;
    }
    .seller-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      border-top: 1px solid #ddd;
      text-align: center;
    }
  `]
})
export class SellerLayoutComponent {}
