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
  template: `
    <div class="cart-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ language === 'ta' ? 'கூடை' : 'Shopping Cart' }}</h1>
      </div>

      <div *ngIf="cartItems.length === 0" class="empty-cart">
        <mat-icon>shopping_cart</mat-icon>
        <h2>{{ language === 'ta' ? 'கூடை காலியாக உள்ளது' : 'Your cart is empty' }}</h2>
        <button mat-raised-button color="primary" (click)="continueShopping()">
          {{ language === 'ta' ? 'ஷாப்பிங் தொடரவும்' : 'Continue Shopping' }}
        </button>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-content">
        <!-- Cart Items -->
        <mat-card class="items-card">
          <h2>{{ language === 'ta' ? 'பொருட்கள்' : 'Items' }} ({{ cartItems.length }})</h2>
          <mat-divider></mat-divider>
          
          <div class="cart-item" *ngFor="let item of cartItems; let i = index">
            <div class="item-image" 
                 [style.background-image]="item.imageUrl ? 'url(' + item.imageUrl + ')' : 'none'">
            </div>
            <div class="item-details">
              <h3>{{ language === 'ta' && item.nameTA ? item.nameTA : item.name }}</h3>
              <p class="unit-price">₹{{ item.price }} / {{ language === 'ta' && item.unitTA ? item.unitTA : item.unit }}</p>
              
              <div class="quantity-controls">
                <button mat-icon-button (click)="decrementQuantity(i)">
                  <mat-icon>remove</mat-icon>
                </button>
                <span>{{ item.quantity }}</span>
                <button mat-icon-button (click)="incrementQuantity(i)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>
            <div class="item-price">
              <p class="total-price">₹{{ item.totalPrice }}</p>
              <button mat-icon-button color="warn" (click)="removeItem(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <!-- Customer Details -->
        <mat-card class="details-card">
          <h2>{{ language === 'ta' ? 'உங்கள் விவரங்கள்' : 'Your Details' }}</h2>
          <mat-divider></mat-divider>
          
          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'பெயர்' : 'Name' }}</mat-label>
              <input matInput [(ngModel)]="customerInfo.name" required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number' }}</mat-label>
              <input matInput [(ngModel)]="customerInfo.phone" type="tel" required>
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'முகவரி' : 'Address' }}</mat-label>
              <textarea matInput [(ngModel)]="customerInfo.address" rows="3" required></textarea>
              <mat-icon matPrefix>location_on</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'அடையாளம் (விருப்பமானது)' : 'Landmark (Optional)' }}</mat-label>
              <input matInput [(ngModel)]="customerInfo.landmark">
              <mat-icon matPrefix>place</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'விருப்ப நேரம் (விருப்பமானது)' : 'Preferred Time (Optional)' }}</mat-label>
              <input matInput [(ngModel)]="customerInfo.preferredTime" placeholder="e.g., 5:00 PM">
              <mat-icon matPrefix>schedule</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ language === 'ta' ? 'குறிப்புகள் (விருப்பமானது)' : 'Notes (Optional)' }}</mat-label>
              <textarea matInput [(ngModel)]="customerInfo.notes" rows="2"></textarea>
              <mat-icon matPrefix>note</mat-icon>
            </mat-form-field>
          </div>
        </mat-card>

        <!-- Order Summary -->
        <mat-card class="summary-card">
          <h2>{{ language === 'ta' ? 'ஆர்டர் சுருக்கம்' : 'Order Summary' }}</h2>
          <mat-divider></mat-divider>
          
          <div class="summary-row">
            <span>{{ language === 'ta' ? 'பொருட்கள் எண்ணிக்கை' : 'Total Items' }}:</span>
            <span>{{ getTotalItems() }}</span>
          </div>
          <div class="summary-row">
            <span>{{ language === 'ta' ? 'துணை மொத்தம்' : 'Subtotal' }}:</span>
            <span>₹{{ getSubtotal() }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="summary-row total">
            <span>{{ language === 'ta' ? 'மொத்த தொகை' : 'Total Amount' }}:</span>
            <span>₹{{ getSubtotal() }}</span>
          </div>

          <button mat-raised-button 
                  class="whatsapp-order-btn whatsapp-btn"
                  [disabled]="!isFormValid()"
                  (click)="orderOnWhatsApp()">
            <mat-icon>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </mat-icon>
            {{ language === 'ta' ? 'வாட்ஸ்அப்பில் ஆர்டர் செய்யவும்' : 'Order on WhatsApp' }}
          </button>

          <p class="info-text">
            {{ language === 'ta' 
              ? 'உங்கள் ஆர்டரை உறுதிப்படுத்த வாட்ஸ்அப் சாட் திறக்கும்' 
              : 'WhatsApp chat will open to confirm your order' 
            }}
          </p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      max-width: 1000px;
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

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-cart mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-cart h2 {
      color: #999;
      margin-bottom: 30px;
    }

    .cart-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    mat-card {
      padding: 20px;
    }

    mat-card h2 {
      margin: 0 0 15px 0;
      color: var(--whatsapp-teal);
    }

    mat-divider {
      margin: 15px 0;
    }

    .cart-item {
      display: flex;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 80px;
      height: 80px;
      background-color: #f0f0f0;
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-image:not([style*="url"]):before {
      content: "📦";
      font-size: 32px;
    }

    .item-details {
      flex: 1;
    }

    .item-details h3 {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
      color: #333;
    }

    .unit-price {
      color: #666;
      font-size: 0.9rem;
      margin: 5px 0;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .quantity-controls span {
      font-weight: 600;
      min-width: 30px;
      text-align: center;
    }

    .item-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
    }

    .total-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--whatsapp-green);
      margin: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 15px;
    }

    .full-width {
      width: 100%;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 1rem;
    }

    .summary-row.total {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--whatsapp-green);
      padding: 15px 0 10px 0;
    }

    .whatsapp-order-btn {
      width: 100%;
      height: 56px;
      font-size: 1.1rem;
      margin-top: 20px;
    }

    .whatsapp-order-btn mat-icon {
      margin-right: 10px;
    }

    .info-text {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin: 15px 0 0 0;
    }

    @media (max-width: 768px) {
      .cart-container {
        padding: 10px;
      }

      .cart-item {
        flex-direction: column;
      }

      .item-price {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  `]
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

    this.firebaseService.getShopById('shop-1').subscribe(shop => {
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

    // Generate WhatsApp link
    const whatsappUrl = this.whatsappService.generateOrderLink(
      this.shop.phoneE164,
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
        this.router.navigate(['/home']);
      }
    }, 1000);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
