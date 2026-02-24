import { Component, OnInit } from '@angular/core';
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
import { ShopService } from '../../../core/services/shop.service';
import { SellerHeaderComponent } from '../components/seller-header.component';
import { Product } from '../../../core/models/product.model';
import { Shop } from '../../../core/models/shop.model';

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
export class ProductsManagementComponent implements OnInit {
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

  constructor(
    private firebaseService: FirebaseService,
    private languageService: LanguageService,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get shop slug from route params and initialize shop
    this.route.paramMap.subscribe(params => {
      const shopSlug = params.get('shopSlug');
      console.log('Products Management - Shop Slug from route:', shopSlug);
      
      if (shopSlug) {
        // Initialize shop with the slug from URL
        this.shopService.initializeShop(shopSlug);
      }
    });

    // Subscribe to shop changes
    this.shopService.currentShop$.subscribe(shop => {
      console.log('Products Management - Current shop updated:', shop);
      this.currentShop = shop;
      if (shop) {
        this.productForm.shopId = shop.id;
        this.loadProducts();
      }
    });
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

