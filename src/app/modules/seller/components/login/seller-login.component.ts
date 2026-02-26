import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Seller Login</h1>
        <form>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" class="form-control" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" class="form-control" />
          </div>
          <button type="button" class="btn-login">Login with Firebase</button>
        </form>
        <p class="login-footer">Powered by Firebase Authentication</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }
    .login-box h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #2c3e50;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #2c3e50;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .btn-login {
      width: 100%;
      background-color: #2c3e50;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    .btn-login:hover {
      background-color: #34495e;
    }
    .login-footer {
      text-align: center;
      margin-top: 1rem;
      color: #95a5a6;
      font-size: 0.85rem;
    }
  `]
})
export class SellerLoginComponent {}
