import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>WhatsApp Orders - Making local shopping easy and accessible.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Sellers</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p>Email: support@whatsapporders.com</p>
          <p>Phone: +91 XXXXXXXXXX</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 WhatsApp Orders. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #2c3e50;
      color: white;
      padding: 2rem 1rem;
      margin-top: 3rem;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-section h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    .footer-section a {
      color: #ecf0f1;
      text-decoration: none;
    }
    .footer-section a:hover {
      text-decoration: underline;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-section ul li {
      margin-bottom: 0.5rem;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid #34495e;
    }
    .footer-bottom p {
      margin: 0;
      color: #95a5a6;
    }
  `]
})
export class FooterComponent {}
