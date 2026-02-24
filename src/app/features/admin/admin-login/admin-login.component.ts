import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/admin/sellers';
    });
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('🔐 Admin login attempt:', this.email);
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.password
      );

      console.log('✅ Authentication successful');
      console.log('🔍 Checking admin role for UID:', userCredential.user.uid);

      // Check if user is admin
      const adminDoc = await getDoc(doc(this.firestore, 'admin', userCredential.user.uid));
      
      if (!adminDoc.exists()) {
        console.log('❌ User is not an admin');
        this.errorMessage = 'Access denied. Admin privileges required.';
        await this.auth.signOut();
        this.loading = false;
        return;
      }

      const adminData = adminDoc.data();
      if (adminData['role'] !== 'admin' && adminData['role'] !== 'owner') {
        console.log('❌ Insufficient admin privileges');
        this.errorMessage = 'Insufficient privileges. Owner access required.';
        await this.auth.signOut();
        this.loading = false;
        return;
      }

      console.log('✅ Admin access granted');
      console.log('↩️ Redirecting to:', this.returnUrl);
      
      this.router.navigateByUrl(this.returnUrl);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'Admin account not found';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          this.errorMessage = 'Login failed. Please try again';
      }
    } finally {
      this.loading = false;
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}

