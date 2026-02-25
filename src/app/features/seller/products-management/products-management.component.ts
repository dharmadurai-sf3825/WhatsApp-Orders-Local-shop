import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SellerHeaderComponent } from '../components/seller-header.component';
import { Product } from '../../../core/models/product.model';
import { Shop } from '../../../core/models/shop.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    MatTableModule,
    SellerHeaderComponent
  ],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.scss'
})
export class ProductsManagementComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  showForm = false;
  editingProduct: Product | null = null;
  language = 'ta';

  currentShop: Shop | null = null;

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
    shopId: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private firebaseService: FirebaseService,
    private languageService: LanguageService,
    private globalStateService: GlobalStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.language = lang;
      });

    // Get shop slug from route params and load from global state if needed
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(async params => {
        const shopSlug = params.get('shopSlug');
        console.log('📦 Products Management - Route shopSlug:', shopSlug);
        
        const currentGlobalShop = this.globalStateService.getCurrentShop();
        if (!currentGlobalShop || currentGlobalShop.slug !== shopSlug) {
          if (shopSlug) {
            try {
              await this.globalStateService.loadShop(shopSlug);
            } catch (error) {
              console.error('❌ Failed to load shop:', error);
            }
          }
        }
      });

    // Subscribe to global shop state
    this.globalStateService.currentShop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(shop => {
        console.log('📦 Products Management - Global shop updated:', shop?.name);
        this.currentShop = shop;
        if (shop) {
          this.productForm.shopId = shop.id;
          this.loadProducts();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    if (!this.currentShop) return;
    
    this.firebaseService.getProductsByShopId(this.currentShop.id).subscribe(products => {
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
    // Ensure shopId is set before saving
    if (!this.productForm.shopId && this.currentShop) {
      this.productForm.shopId = this.currentShop.id;
    }

    console.log('Saving product with shopId:', this.productForm.shopId);
    console.log('Current shop ID:', this.currentShop?.id);

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
        .subscribe((addedProduct) => {
          console.log('Product added:', addedProduct);
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
      shopId: this.currentShop?.id || 'shop-1'
    };
  }

  goBack() {
    const shopSlug = this.route.snapshot.paramMap.get('shopSlug');
    if (shopSlug) {
      this.router.navigate(['/seller', shopSlug, 'dashboard']);
    } else {
      this.router.navigate(['/seller/login']);
    }
  }
}

