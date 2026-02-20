import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FirebaseService } from '../../../core/services/firebase.service';
import { LanguageService } from '../../../core/services/language.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTableModule
  ],
  template: `
    <div class="products-management-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ language === 'ta' ? 'பொருட்கள் நிர்வாகம்' : 'Products Management' }}</h1>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="showAddProduct()">
          <mat-icon>add</mat-icon>
          {{ language === 'ta' ? 'புதிய பொருள்' : 'Add Product' }}
        </button>
      </div>

      <!-- Add/Edit Product Form -->
      <mat-card *ngIf="showForm" class="form-card">
        <h2>{{ editingProduct ? (language === 'ta' ? 'பொருளை திருத்து' : 'Edit Product') : (language === 'ta' ? 'புதிய பொருளை சேர்' : 'Add New Product') }}</h2>
        
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'பெயர் (English)' : 'Name (English)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'பெயர் (தமிழ்)' : 'Name (Tamil)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.nameTA">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ language === 'ta' ? 'விளக்கம் (English)' : 'Description (English)' }}</mat-label>
            <textarea matInput [(ngModel)]="productForm.description" rows="2"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ language === 'ta' ? 'விளக்கம் (தமிழ்)' : 'Description (Tamil)' }}</mat-label>
            <textarea matInput [(ngModel)]="productForm.descriptionTA" rows="2"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'விலை (₹)' : 'Price (₹)' }}</mat-label>
            <input matInput type="number" [(ngModel)]="productForm.price" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'அலகு (English)' : 'Unit (English)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.unit" placeholder="piece, kg, liter" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'அலகு (தமிழ்)' : 'Unit (Tamil)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.unitTA" placeholder="துண்டு, கிலோ, லிட்டர்">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'வகை (English)' : 'Category (English)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.category">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'வகை (தமிழ்)' : 'Category (Tamil)' }}</mat-label>
            <input matInput [(ngModel)]="productForm.categoryTA">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ language === 'ta' ? 'படம் URL' : 'Image URL' }}</mat-label>
            <input matInput [(ngModel)]="productForm.imageUrl">
          </mat-form-field>

          <div class="toggle-field">
            <mat-slide-toggle [(ngModel)]="productForm.inStock">
              {{ language === 'ta' ? 'கையிருப்பில் உள்ளது' : 'In Stock' }}
            </mat-slide-toggle>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button (click)="cancelEdit()">
            {{ language === 'ta' ? 'ரத்து செய்' : 'Cancel' }}
          </button>
          <button mat-raised-button color="primary" (click)="saveProduct()">
            {{ language === 'ta' ? 'சேமி' : 'Save' }}
          </button>
        </div>
      </mat-card>

      <!-- Products List -->
      <mat-card class="list-card">
        <h2>{{ language === 'ta' ? 'அனைத்து பொருட்கள்' : 'All Products' }} ({{ products.length }})</h2>
        
        <div class="products-table">
          <div class="product-row header">
            <div class="col-image">{{ language === 'ta' ? 'படம்' : 'Image' }}</div>
            <div class="col-name">{{ language === 'ta' ? 'பெயர்' : 'Name' }}</div>
            <div class="col-price">{{ language === 'ta' ? 'விலை' : 'Price' }}</div>
            <div class="col-category">{{ language === 'ta' ? 'வகை' : 'Category' }}</div>
            <div class="col-stock">{{ language === 'ta' ? 'கையிருப்பு' : 'Stock' }}</div>
            <div class="col-actions">{{ language === 'ta' ? 'செயல்கள்' : 'Actions' }}</div>
          </div>

          <div class="product-row" *ngFor="let product of products">
            <div class="col-image">
              <div class="product-thumb" 
                   [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : 'none'">
              </div>
            </div>
            <div class="col-name">
              <strong>{{ language === 'ta' && product.nameTA ? product.nameTA : product.name }}</strong>
            </div>
            <div class="col-price">
              ₹{{ product.price }} / {{ language === 'ta' && product.unitTA ? product.unitTA : product.unit }}
            </div>
            <div class="col-category">
              {{ language === 'ta' && product.categoryTA ? product.categoryTA : product.category }}
            </div>
            <div class="col-stock">
              <span [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
                {{ product.inStock ? (language === 'ta' ? 'உள்ளது' : 'Yes') : (language === 'ta' ? 'இல்லை' : 'No') }}
              </span>
            </div>
            <div class="col-actions">
              <button mat-icon-button (click)="editProduct(product)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(product)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <p *ngIf="products.length === 0" class="no-products">
            {{ language === 'ta' ? 'பொருட்கள் இல்லை' : 'No products found' }}
          </p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .products-management-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: var(--whatsapp-teal);
    }

    .spacer {
      flex: 1;
    }

    mat-card {
      margin-bottom: 20px;
    }

    mat-card h2 {
      margin: 0 0 20px 0;
      color: var(--whatsapp-teal);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .toggle-field {
      display: flex;
      align-items: center;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .products-table {
      overflow-x: auto;
    }

    .product-row {
      display: grid;
      grid-template-columns: 80px 2fr 1fr 1fr 100px 120px;
      gap: 15px;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    .product-row.header {
      background: #f5f5f5;
      font-weight: 600;
      color: var(--whatsapp-teal);
    }

    .product-thumb {
      width: 60px;
      height: 60px;
      background-color: #f0f0f0;
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-thumb:not([style*="url"]):before {
      content: "📦";
      font-size: 24px;
    }

    .in-stock {
      color: var(--whatsapp-green);
      font-weight: 600;
    }

    .out-of-stock {
      color: #f44336;
      font-weight: 600;
    }

    .col-actions {
      display: flex;
      gap: 5px;
    }

    .no-products {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    @media (max-width: 768px) {
      .products-management-container {
        padding: 10px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .product-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .product-row.header {
        display: none;
      }

      .product-row > div:before {
        content: attr(class);
        font-weight: 600;
        display: block;
        margin-bottom: 5px;
      }
    }
  `]
})
export class ProductsManagementComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  editingProduct: Product | null = null;
  language = 'ta';

  productForm: Partial<Product> = {
    name: '',
    nameTA: '',
    description: '',
    descriptionTA: '',
    price: 0,
    unit: '',
    unitTA: '',
    category: '',
    categoryTA: '',
    imageUrl: '',
    inStock: true,
    shopId: 'shop-1'
  };

  constructor(
    private firebaseService: FirebaseService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.loadProducts();
  }

  loadProducts() {
    this.firebaseService.getProductsByShopId('shop-1').subscribe(products => {
      this.products = products;
    });
  }

  showAddProduct() {
    this.showForm = true;
    this.editingProduct = null;
    this.resetForm();
  }

  editProduct(product: Product) {
    this.showForm = true;
    this.editingProduct = product;
    this.productForm = { ...product };
  }

  cancelEdit() {
    this.showForm = false;
    this.editingProduct = null;
    this.resetForm();
  }

  saveProduct() {
    if (this.editingProduct) {
      // Update existing product
      this.firebaseService.updateProduct(this.editingProduct.id!, this.productForm)
        .subscribe(() => {
          alert(this.language === 'ta' ? 'பொருள் புதுப்பிக்கப்பட்டது' : 'Product updated successfully');
          this.loadProducts();
          this.cancelEdit();
        });
    } else {
      // Add new product
      this.firebaseService.addProduct(this.productForm as Product)
        .subscribe(() => {
          alert(this.language === 'ta' ? 'பொருள் சேர்க்கப்பட்டது' : 'Product added successfully');
          this.loadProducts();
          this.cancelEdit();
        });
    }
  }

  deleteProduct(product: Product) {
    const confirmed = confirm(
      this.language === 'ta' 
        ? 'இந்த பொருளை நிச்சயமாக நீக்க விரும்புகிறீர்களா?' 
        : 'Are you sure you want to delete this product?'
    );

    if (confirmed && product.id) {
      this.firebaseService.deleteProduct(product.id).subscribe(() => {
        alert(this.language === 'ta' ? 'பொருள் நீக்கப்பட்டது' : 'Product deleted successfully');
        this.loadProducts();
      });
    }
  }

  resetForm() {
    this.productForm = {
      name: '',
      nameTA: '',
      description: '',
      descriptionTA: '',
      price: 0,
      unit: '',
      unitTA: '',
      category: '',
      categoryTA: '',
      imageUrl: '',
      inStock: true,
      shopId: 'shop-1'
    };
  }

  goBack() {
    this.router.navigate(['/seller/dashboard']);
  }
}
