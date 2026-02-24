import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { WhatsAppService } from '../../../core/services/whatsapp.service';
import { LanguageService } from '../../../core/services/language.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { ShopService } from '../../../core/services/shop.service';
import { CartItem } from '../../../core/models/product.model';
import { CustomerInfo } from '../../../core/models/order.model';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  language = 'ta';
  shop: Shop | null = null;
  
  customerInfo: CustomerInfo = {
    name: '',
    phone: '',
    address: '',
    landmark: '',
    preferredTime: '',
    notes: ''
  };

  constructor(
    private cartService: CartService,
    private whatsappService: WhatsAppService,
    private languageService: LanguageService,
    private firebaseService: FirebaseService,
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
    });

    // Get current shop from ShopService
    this.shopService.currentShop$.subscribe(shop => {
      this.shop = shop;
    });

    // Load saved customer info
    this.loadSavedCustomerInfo();
  }

  loadSavedCustomerInfo() {
    const saved = localStorage.getItem('customer_info');
    if (saved) {
      try {
        this.customerInfo = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading customer info:', error);
      }
    }
  }

  saveCustomerInfo() {
    localStorage.setItem('customer_info', JSON.stringify(this.customerInfo));
  }

  incrementQuantity(index: number) {
    this.cartService.updateQuantity(index, this.cartItems[index].quantity + 1);
  }

  decrementQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartService.updateQuantity(index, this.cartItems[index].quantity - 1);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  isFormValid(): boolean {
    return !!(
      this.customerInfo.name.trim() &&
      this.customerInfo.phone.trim() &&
      this.customerInfo.address.trim()
    );
  }

  orderOnWhatsApp() {
    if (!this.isFormValid() || !this.shop) {
      return;
    }

    // Save customer info for next time
    this.saveCustomerInfo();

    // Generate WhatsApp link with shop object
    const whatsappUrl = this.whatsappService.generateOrderLink(
      this.shop,
      this.cartItems,
      this.customerInfo,
      this.language as 'en' | 'ta'
    );

    // Open WhatsApp
    this.whatsappService.openWhatsAppChat(whatsappUrl);

    // Clear cart after order
    setTimeout(() => {
      if (confirm(this.language === 'ta' 
        ? 'ஆர்டர் அனுப்பப்பட்டது! கூடையை காலி செய்யவா?' 
        : 'Order sent! Clear cart?'
      )) {
        this.cartService.clearCart();
        if (this.shop) {
          this.router.navigate([this.shop.slug, 'home']);
        }
      }
    }, 1000);
  }

  continueShopping() {
    if (this.shop) {
      this.router.navigate([this.shop.slug, 'home']);
    }
  }

  goBack() {
    if (this.shop) {
      this.router.navigate([this.shop.slug, 'products']);
    }
  }
}

