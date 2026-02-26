import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Admin Login</h1>
        <form>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter admin email" class="form-control" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" class="form-control" />
          </div>
          <button type="button" class="btn-login">Login with Firebase</button>
        </form>
        <p class="login-footer">Admin credentials required</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a1a 0%, #434343 100%);
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 400px;
    }
    .login-box h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1a1a1a;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #1a1a1a;
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
      background-color: #1a1a1a;
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
      background-color: #333;
    }
    .login-footer {
      text-align: center;
      margin-top: 1rem;
      color: #95a5a6;
      font-size: 0.85rem;
    }
  `]
})
export class AdminLoginComponent {}
