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
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { ShopService } from '../../../core/services/shop.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-seller-login',
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
  templateUrl: './seller-login.component.html',
  styleUrl: './seller-login.component.scss'
})
export class SellerLoginComponent implements OnInit {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';
  language = 'en';
  currentShop: Shop | null = null;
  returnUrl = '';

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.shopService.currentShop$.subscribe(shop => {
      this.currentShop = shop;
    });

    // Get return URL from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '';
    });
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('🔐 Attempting login for:', this.email);
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.password
      );

      console.log('✅ Login successful:', userCredential.user.uid);

      // Get user's shops from shop_ownership
      const userShops = await this.authService.getUserShops();
      
      if (userShops.length === 0) {
        console.log('❌ User has no shops assigned');
        this.errorMessage = this.language === 'ta'
          ? 'உங்களுக்கு எந்த கடையும் ஒதுக்கப்படவில்லை'
          : 'You have no shops assigned';
        
        // Sign out the user
        await this.auth.signOut();
        this.loading = false;
        return;
      }

      // Use first shop (for multi-shop support in future, show shop selector)
      const shopSlug = userShops[0];
      console.log(`✅ User has access to shop: ${shopSlug}`);

      // Redirect to seller dashboard with shop slug
      const redirectUrl = this.returnUrl || `/seller/${shopSlug}/dashboard`;
      
      console.log('↩️ Redirecting to:', redirectUrl);
      this.router.navigateByUrl(redirectUrl);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Handle specific error codes
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage = this.language === 'ta' 
            ? 'தவறான மின்னஞ்சல் முகவரி' 
            : 'Invalid email address';
          break;
        case 'auth/user-not-found':
          this.errorMessage = this.language === 'ta' 
            ? 'பயனர் கணக்கு காணப்படவில்லை' 
            : 'User account not found';
          break;
        case 'auth/wrong-password':
          this.errorMessage = this.language === 'ta' 
            ? 'தவறான கடவுச்சொல்' 
            : 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = this.language === 'ta' 
            ? 'பல முயற்சிகள். சிறிது நேரம் காத்திருக்கவும்' 
            : 'Too many attempts. Please try again later';
          break;
        default:
          this.errorMessage = this.language === 'ta' 
            ? 'உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்' 
            : 'Login failed. Please try again';
      }
    } finally {
      this.loading = false;
    }
  }

  goToCustomer() {
    if (this.currentShop) {
      this.router.navigate([this.currentShop.slug, 'home']);
    }
  }
}

