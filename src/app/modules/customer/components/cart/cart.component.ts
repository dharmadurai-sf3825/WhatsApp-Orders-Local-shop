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
import { CartService } from '../../../../core/services/cart.service';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';
import { LanguageService } from '../../../../core/services/language.service';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { ShopService } from '../../../../core/services/shop.service';
import { CartItem } from '../../../../core/models/product.model';
import { CustomerInfo } from '../../../../core/models/order.model';
import { Shop } from '../../../../core/models/shop.model';
import { LazyLoadDirective } from '../../../../shared/directives/lazy-load.directive';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

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
    MatDividerModule,
    LazyLoadDirective
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  language = 'ta';
  shop: Shop | null = null;
  sellerPhone: string | null = null;  // WhatsApp phone from seller
  
  // Redesign enhancements
  loadingImages: Set<string> = new Set(); // Track which images are loading
  
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
    private firestore: Firestore,
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

    // Get current shop from ShopService and fetch seller phone
    this.shopService.currentShop$.subscribe(shop => {
      this.shop = shop;
      if (shop) {
        this.fetchSellerPhone(shop.slug);
      }
    });

    // Load saved customer info
    this.loadSavedCustomerInfo();
  }

  async fetchSellerPhone(shopSlug: string) {
    try {
      console.log('📱 Fetching seller phone for shop:', shopSlug);
      
      // Query shop_ownership collection to get seller phone
      const ownershipRef = collection(this.firestore, 'shop_ownership');
      const q = query(ownershipRef, where('shopSlug', '==', shopSlug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const ownershipData = querySnapshot.docs[0].data();
        this.sellerPhone = ownershipData['sellerPhone'] || null;
        
        if (this.sellerPhone) {
          console.log('✅ Seller phone found:', this.sellerPhone);
        } else {
          console.warn('⚠️ Seller phone not set for shop:', shopSlug);
        }
      } else {
        console.warn('⚠️ No shop ownership record found for:', shopSlug);
      }
    } catch (error) {
      console.error('❌ Error fetching seller phone:', error);
    }
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
    const item = this.cartItems[index];
    // Check if quantity is at max limit
    if (item.maxQuantity && item.quantity >= item.maxQuantity) {
      console.warn(
        `Cannot increment quantity for ${item.name}: already at max (${item.maxQuantity})`
      );
      return;
    }
    this.cartService.updateQuantity(index, item.quantity + 1);
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

  canIncrementQuantity(item: CartItem): boolean {
    return !item.maxQuantity || item.quantity < item.maxQuantity;
  }

  getImageUrl(item: CartItem): string {
    return item.imageUrl && this.isValidUrl(item.imageUrl) 
      ? item.imageUrl 
      : '/assets/placeholder-product.svg';
  }

  private isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
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

    try {
      // Generate WhatsApp link with seller phone if available, otherwise shop phone
      const whatsappUrl = this.whatsappService.generateOrderLink(
        this.shop,
        this.cartItems,
        this.customerInfo,
        this.language as 'en' | 'ta',
        this.sellerPhone || undefined  // Pass seller phone if available
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
    } catch (error) {
      console.error('❌ Error generating WhatsApp order link:', error);
      alert(this.language === 'ta'
        ? 'வாட்ஸ்அப் ஆர்டரை உருவாக்க முடியவில்லை'
        : 'Failed to create WhatsApp order link'
      );
    }
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
