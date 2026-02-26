import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <header class="admin-header">
        <!-- Admin header content will go here -->
        <h1>Admin Panel</h1>
        <nav class="admin-nav">
          <a routerLink="sellers">Sellers</a>
          <a routerLink="shops">Shops</a>
          <a routerLink="reports">Reports</a>
        </nav>
      </header>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="admin-footer">
        <!-- Footer content will go here -->
        <p>&copy; 2024 WhatsApp Orders. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .admin-header {
      background-color: #1a1a1a;
      color: white;
      padding: 1rem;
      border-bottom: 1px solid #ddd;
    }
    .admin-nav {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .admin-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .admin-nav a:hover {
      background-color: #333;
    }
    .admin-content {
      flex: 1;
      padding: 2rem;
    }
    .admin-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      border-top: 1px solid #ddd;
      text-align: center;
    }
  `]
})
export class AdminLayoutComponent {}
