import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Firestore, collection, getDocs, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

interface SellerAccount {
  id?: string;
  email: string;
  shopSlug: string;
  shopName: string;
  sellerPhone?: string; // WhatsApp phone number in E.164 format
  role: 'owner' | 'manager';
  createdAt: Date;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-sellers-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AdminHeaderComponent
  ],
  templateUrl: './sellers-management.component.html',
  styleUrl: './sellers-management.component.scss'
})
export class SellersManagementComponent implements OnInit {
  showForm = false;
  loading = false;
  loadingSellers = false;
  successMessage = '';
  errorMessage = '';
  
  newSeller: SellerAccount = {
    email: '',
    shopSlug: '',
    shopName: '',
    sellerPhone: '',
    role: 'owner',
    createdAt: new Date(),
    status: 'active'
  };
  
  newPassword = '';
  sellers: SellerAccount[] = [];
  displayedColumns = ['email', 'phone', 'shop', 'role', 'status', 'created', 'actions'];

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.loadSellers();
  }

  async loadSellers() {
    this.loadingSellers = true;
    try {
      const sellersSnapshot = await getDocs(collection(this.firestore, 'shop_ownership'));
      this.sellers = sellersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerAccount[];
      
      console.log('✅ Loaded sellers:', this.sellers.length);
    } catch (error) {
      console.error('❌ Error loading sellers:', error);
    } finally {
      this.loadingSellers = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelForm();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.newSeller.email &&
      this.newPassword &&
      this.newPassword.length >= 6 &&
      this.newSeller.shopName &&
      this.newSeller.shopSlug &&
      this.newSeller.role &&
      this.newSeller.sellerPhone &&
      this.validatePhoneNumber(this.newSeller.sellerPhone)
    );
  }

  validatePhoneNumber(phone: string): boolean {
    // E.164 format: Country code + number (e.g., 918220762702)
    const e164Regex = /^\d{10,15}$/;
    return e164Regex.test(phone.replace(/[\s\-\+\(\)]/g, ''));
  }

  async createSeller() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      console.log('🔧 Step 1: Creating Firebase Auth user:', this.newSeller.email);

      // Step 1: Create Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.newSeller.email,
        this.newPassword
      );

      const userId = userCredential.user.uid;
      console.log('✅ Firebase Auth user created with UID:', userId);

      // Step 2: Create shop_ownership document with userId
      console.log('🔧 Step 2: Creating shop_ownership document...');
      
      const ownershipData = {
        userId: userId,                    // ⭐ CRITICAL: Include userId
        email: this.newSeller.email,
        shopSlug: this.newSeller.shopSlug,
        shopName: this.newSeller.shopName,
        sellerPhone: this.newSeller.sellerPhone,  // ⭐ WhatsApp phone for receiving orders
        role: this.newSeller.role,
        status: 'active',
        createdAt: new Date()
      };

      // Use userId_shopSlug as document ID for easy lookup
      const docId = `${userId}_${this.newSeller.shopSlug}`;
      // Create the document with deterministic ID so other code can read it by ID
      await setDoc(doc(this.firestore, 'shop_ownership', docId), ownershipData);

      console.log('✅ Shop ownership created successfully');

      // Step 3: Show success message
      this.successMessage = `✅ Seller account created successfully!

📧 Login Credentials:
   • Email: ${this.newSeller.email}
   • Password: ${this.newPassword}
   • Shop: ${this.newSeller.shopName}

🔗 Login URL:
   ${window.location.origin}/${this.newSeller.shopSlug}/seller/login

✅ Ready to use immediately!
   
📋 What was created:
   ✅ Firebase Authentication user (UID: ${userId.substring(0, 10)}...)
   ✅ Shop ownership record with userId
   ✅ All permissions configured

💡 Share the credentials above with the seller.`;
      
      console.log('✅ Seller created successfully');
      
      // Reload sellers list
      await this.loadSellers();
      
      // Reset form after delay
      setTimeout(() => {
        this.cancelForm();
      }, 8000);

    } catch (error: any) {
      console.error('❌ Error creating seller:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = '❌ Email already exists in Firebase Authentication. Use a different email or delete the existing user first.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = '❌ Invalid email address format.';
          break;
        case 'auth/weak-password':
          this.errorMessage = '❌ Password is too weak. Use at least 6 characters.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage = '❌ Email/password authentication is not enabled in Firebase Console.';
          break;
        default:
          this.errorMessage = `❌ Failed to create seller: ${error.message}`;
      }
    } finally {
      this.loading = false;
    }
  }

  async deleteSeller(seller: SellerAccount) {
    if (!confirm(`Are you sure you want to delete seller: ${seller.email}?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting seller:', seller.email);
      
      if (seller.id) {
        await deleteDoc(doc(this.firestore, 'shop_ownership', seller.id));
        console.log('✅ Seller deleted');
        
        // Reload list
        await this.loadSellers();
      }
    } catch (error) {
      console.error('❌ Error deleting seller:', error);
      alert('Failed to delete seller');
    }
  }

  cancelForm() {
    this.showForm = false;
    this.newSeller = {
      email: '',
      shopSlug: '',
      shopName: '',
      sellerPhone: '',
      role: 'owner',
      createdAt: new Date(),
      status: 'active'
    };
    this.newPassword = '';
    this.successMessage = '';
    this.errorMessage = '';
  }
}

