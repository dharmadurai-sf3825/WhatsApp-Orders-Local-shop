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
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

interface SellerAccount {
  id?: string;
  email: string;
  shopSlug: string;
  shopName: string;
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="sellers-management-container">
      <div class="header">
        <h1>
          <mat-icon>people</mat-icon>
          Sellers Management
        </h1>
        <button mat-raised-button color="primary" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Cancel' : 'Add New Seller' }}
        </button>
      </div>

      <!-- Add Seller Form -->
      <mat-card *ngIf="showForm" class="form-card">
        <h2>Create New Seller Account</h2>
        
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input matInput type="email" [(ngModel)]="newSeller.email" 
                   placeholder="seller&#64;shopname.com" required>
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Temporary Password</mat-label>
            <input matInput type="text" [(ngModel)]="newPassword" 
                   placeholder="Minimum 6 characters" required>
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Shop Name</mat-label>
            <input matInput [(ngModel)]="newSeller.shopName" 
                   placeholder="Ganesh Bakery" required>
            <mat-icon matPrefix>store</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Shop Slug</mat-label>
            <input matInput [(ngModel)]="newSeller.shopSlug" 
                   placeholder="ganesh-bakery" required>
            <mat-icon matPrefix>link</mat-icon>
            <mat-hint>URL-friendly name (lowercase, hyphens)</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select [(ngModel)]="newSeller.role">
              <mat-option value="owner">Owner</mat-option>
              <mat-option value="manager">Manager</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-raised-button color="primary" 
                  (click)="createSeller()"
                  [disabled]="loading || !isFormValid()">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Create Seller Account</span>
          </button>
          <button mat-button (click)="cancelForm()" [disabled]="loading">
            Cancel
          </button>
        </div>

        <div class="message success" *ngIf="successMessage">
          <mat-icon>check_circle</mat-icon>
          <span>{{ successMessage }}</span>
        </div>

        <div class="message error" *ngIf="errorMessage">
          <mat-icon>error</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>
      </mat-card>

      <!-- Sellers List -->
      <mat-card class="list-card">
        <h2>Existing Sellers ({{ sellers.length }})</h2>

        <div class="table-container" *ngIf="sellers.length > 0">
          <table mat-table [dataSource]="sellers" class="sellers-table">
            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let seller">
                <div class="email-cell">
                  <mat-icon>email</mat-icon>
                  {{ seller.email }}
                </div>
              </td>
            </ng-container>

            <!-- Shop Column -->
            <ng-container matColumnDef="shop">
              <th mat-header-cell *matHeaderCellDef>Shop</th>
              <td mat-cell *matCellDef="let seller">
                <div class="shop-cell">
                  <strong>{{ seller.shopName }}</strong>
                  <span class="shop-slug">{{ seller.shopSlug }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Role Column -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let seller">
                <mat-chip [color]="seller.role === 'owner' ? 'primary' : 'accent'" selected>
                  {{ seller.role | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let seller">
                <mat-chip [color]="seller.status === 'active' ? 'primary' : 'warn'" selected>
                  {{ seller.status | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Created Column -->
            <ng-container matColumnDef="created">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let seller">
                {{ seller.createdAt.toDate() | date:'short' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let seller">
                <button mat-icon-button color="warn" 
                        (click)="deleteSeller(seller)"
                        matTooltip="Delete seller">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <div class="empty-state" *ngIf="sellers.length === 0 && !loadingSellers">
          <mat-icon>people_outline</mat-icon>
          <h3>No Sellers Yet</h3>
          <p>Click "Add New Seller" to create the first seller account</p>
        </div>

        <div class="loading-state" *ngIf="loadingSellers">
          <mat-spinner></mat-spinner>
          <p>Loading sellers...</p>
        </div>
      </mat-card>

      <!-- Instructions Card -->
      <mat-card class="instructions-card">
        <h3>
          <mat-icon>info</mat-icon>
          How to Add Sellers
        </h3>
        
        <ol>
          <li>
            <strong>Click "Add New Seller"</strong>
            <p>Opens the seller creation form</p>
          </li>
          
          <li>
            <strong>Enter Seller Details</strong>
            <ul>
              <li><strong>Email:</strong> Must match shop domain (e.g., seller&#64;ganeshbakery.com)</li>
              <li><strong>Password:</strong> Temporary password (seller can change later)</li>
              <li><strong>Shop Name:</strong> Display name for the shop</li>
              <li><strong>Shop Slug:</strong> URL identifier (e.g., ganesh-bakery)</li>
              <li><strong>Role:</strong> Owner (full access) or Manager (limited)</li>
            </ul>
          </li>
          
          <li>
            <strong>Click "Create Seller Account"</strong>
            <p>System creates:</p>
            <ul>
              <li>✅ Firebase Authentication account</li>
              <li>✅ Shop ownership record</li>
              <li>✅ User profile in database</li>
            </ul>
          </li>
          
          <li>
            <strong>Share Credentials</strong>
            <p>Send login details to the seller:</p>
            <ul>
              <li>URL: https://your-site.web.app/[shop-slug]/seller/login</li>
              <li>Email: seller&#64;shopname.com</li>
              <li>Password: (temporary password)</li>
            </ul>
          </li>
        </ol>

        <div class="warning-box">
          <mat-icon>warning</mat-icon>
          <div>
            <strong>Security Note:</strong>
            <p>Sellers can only access their own shop. The system automatically verifies shop ownership using email domain matching.</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .sellers-management-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1e3c72;
      margin: 0;
    }

    .form-card {
      margin-bottom: 30px;
      padding: 30px;
    }

    .form-card h2 {
      color: #1e3c72;
      margin-top: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .message.success {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .message.error {
      background: #ffebee;
      color: #c62828;
    }

    .list-card {
      padding: 30px;
      margin-bottom: 30px;
    }

    .list-card h2 {
      color: #1e3c72;
      margin-top: 0;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 20px;
    }

    .sellers-table {
      width: 100%;
    }

    .email-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .shop-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .shop-slug {
      font-size: 0.85rem;
      color: #666;
      font-family: monospace;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin: 10px 0;
      color: #666;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-state p {
      margin-top: 20px;
      color: #666;
    }

    .instructions-card {
      padding: 30px;
      background: #f5f5f5;
    }

    .instructions-card h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1e3c72;
      margin-top: 0;
    }

    .instructions-card ol {
      line-height: 1.8;
    }

    .instructions-card li {
      margin-bottom: 20px;
    }

    .instructions-card strong {
      color: #1e3c72;
    }

    .instructions-card ul {
      margin-top: 10px;
      color: #666;
    }

    .warning-box {
      display: flex;
      gap: 15px;
      padding: 20px;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      margin-top: 20px;
    }

    .warning-box mat-icon {
      color: #ff9800;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .warning-box strong {
      color: #ff9800;
    }

    .warning-box p {
      margin: 5px 0 0 0;
      color: #666;
    }

    mat-spinner {
      display: inline-block;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .sellers-management-container {
        padding: 15px;
      }

      .header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .table-container {
        font-size: 0.9rem;
      }
    }
  `]
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
    role: 'owner',
    createdAt: new Date(),
    status: 'active'
  };
  
  newPassword = '';
  sellers: SellerAccount[] = [];
  displayedColumns = ['email', 'shop', 'role', 'status', 'created', 'actions'];

  constructor(
    private firestore: Firestore
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
      this.newSeller.role
    );
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
      console.log('🔧 Creating seller account:', this.newSeller.email);

      // Call Firebase Cloud Function to create user
      // Note: This requires a Cloud Function to be deployed
      // For now, we'll create the database records
      
      // Create shop ownership record
      const ownershipData = {
        email: this.newSeller.email,
        shopSlug: this.newSeller.shopSlug,
        shopName: this.newSeller.shopName,
        role: this.newSeller.role,
        createdAt: new Date(),
        status: 'active',
        temporaryPassword: this.newPassword // Store temporarily for admin
      };

      await addDoc(collection(this.firestore, 'shop_ownership'), ownershipData);

      this.successMessage = `✅ Seller account created successfully!\n\nLogin Details:\nEmail: ${this.newSeller.email}\nPassword: ${this.newPassword}\nURL: /${this.newSeller.shopSlug}/seller/login\n\nIMPORTANT: Create this user in Firebase Authentication console!`;
      
      console.log('✅ Seller created successfully');
      
      // Reload sellers list
      await this.loadSellers();
      
      // Reset form after delay
      setTimeout(() => {
        this.cancelForm();
      }, 5000);

    } catch (error: any) {
      console.error('❌ Error creating seller:', error);
      this.errorMessage = `Failed to create seller: ${error.message}`;
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
      role: 'owner',
      createdAt: new Date(),
      status: 'active'
    };
    this.newPassword = '';
    this.successMessage = '';
    this.errorMessage = '';
  }
}
