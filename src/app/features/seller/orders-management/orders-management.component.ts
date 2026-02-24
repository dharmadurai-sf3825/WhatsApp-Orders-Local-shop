import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { FirebaseService } from '../../../core/services/firebase.service';
import { RazorpayService } from '../../../core/services/razorpay.service';
import { LanguageService } from '../../../core/services/language.service';
import { ShopService } from '../../../core/services/shop.service';
import { SellerHeaderComponent } from '../components/seller-header.component';
import { Order, OrderStatus, PaymentStatus } from '../../../core/models/order.model';
import { Shop } from '../../../core/models/shop.model';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    SellerHeaderComponent
  ],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.scss'
})
export class OrdersManagementComponent implements OnInit {
  orders: Order[] = [];
  language = 'ta';
  currentShop: Shop | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private razorpayService: RazorpayService,
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
      console.log('Orders Management - Shop Slug from route:', shopSlug);
      
      if (shopSlug) {
        // Initialize shop with the slug from URL
        this.shopService.initializeShop(shopSlug);
      }
    });

    // Subscribe to shop changes
    this.shopService.currentShop$.subscribe(shop => {
      console.log('Orders Management - Current shop updated:', shop);
      this.currentShop = shop;
      if (shop) {
        this.loadOrders();
      }
    });
  }

  loadOrders() {
    if (!this.currentShop) return;
    
    this.firebaseService.getOrdersByShopId(this.currentShop.id).subscribe(orders => {
      this.orders = orders;
    });
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  onTabChange(event: any) {
    // Handle tab change if needed
  }

  confirmOrder(order: Order) {
    const confirmed = confirm(
      this.language === 'ta'
        ? 'இந்த ஆர்டரை உறுதிப்படுத்த விரும்புகிறீர்களா?'
        : 'Confirm this order?'
    );

    if (confirmed && order.id) {
      this.firebaseService.updateOrder(order.id, {
        status: OrderStatus.CONFIRMED,
        confirmedAt: new Date()
      }).subscribe(() => {
        alert(this.language === 'ta' ? 'ஆர்டர் உறுதிப்படுத்தப்பட்டது' : 'Order confirmed');
        this.loadOrders();
      });
    }
  }

  sendPaymentLink(order: Order) {
    this.razorpayService.createPaymentLink(order).subscribe(paymentLink => {
      if (order.id) {
        this.firebaseService.updateOrder(order.id, {
          razorpayLinkId: paymentLink.id,
          paymentStatus: PaymentStatus.LINK_SENT
        }).subscribe(() => {
          alert(
            this.language === 'ta'
              ? `கட்டண இணைப்பு உருவாக்கப்பட்டது: ${paymentLink.short_url}`
              : `Payment link created: ${paymentLink.short_url}`
          );
          // Copy to clipboard
          navigator.clipboard.writeText(paymentLink.short_url);
          this.loadOrders();
        });
      }
    });
  }

  markAsDispatched(order: Order) {
    if (order.id) {
      this.firebaseService.updateOrder(order.id, {
        status: OrderStatus.DISPATCHED,
        dispatchedAt: new Date()
      }).subscribe(() => {
        alert(this.language === 'ta' ? 'அனுப்பப்பட்டது என குறிக்கப்பட்டது' : 'Marked as dispatched');
        this.loadOrders();
      });
    }
  }

  markAsDelivered(order: Order) {
    if (order.id) {
      this.firebaseService.updateOrder(order.id, {
        status: OrderStatus.DELIVERED,
        deliveredAt: new Date()
      }).subscribe(() => {
        alert(this.language === 'ta' ? 'முடிந்தது என குறிக்கப்பட்டது' : 'Marked as delivered');
        this.loadOrders();
      });
    }
  }

  cancelOrder(order: Order) {
    const confirmed = confirm(
      this.language === 'ta'
        ? 'இந்த ஆர்டரை ரத்து செய்ய விரும்புகிறீர்களா?'
        : 'Cancel this order?'
    );

    if (confirmed && order.id) {
      this.firebaseService.updateOrder(order.id, {
        status: OrderStatus.CANCELLED
      }).subscribe(() => {
        alert(this.language === 'ta' ? 'ஆர்டர் ரத்து செய்யப்பட்டது' : 'Order cancelled');
        this.loadOrders();
      });
    }
  }

  viewOrderDetails(order: Order) {
    // Navigate to order details or show dialog
    console.log('View order details:', order);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: { en: string; ta: string } } = {
      'new': { en: 'New', ta: 'புதிய' },
      'confirmed': { en: 'Confirmed', ta: 'உறுதி' },
      'preparing': { en: 'Preparing', ta: 'தயாரிக்கிறது' },
      'ready': { en: 'Ready', ta: 'தயார்' },
      'dispatched': { en: 'Dispatched', ta: 'அனுப்பப்பட்டது' },
      'delivered': { en: 'Delivered', ta: 'முடிந்தது' },
      'cancelled': { en: 'Cancelled', ta: 'ரத்து' }
    };
    return this.language === 'ta' ? labels[status]?.ta : labels[status]?.en;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: { [key: string]: { en: string; ta: string } } = {
      'pending': { en: 'Pending', ta: 'நிலுவையில்' },
      'link_sent': { en: 'Link Sent', ta: 'இணைப்பு அனுப்பப்பட்டது' },
      'paid': { en: 'Paid', ta: 'செலுத்தப்பட்டது' },
      'failed': { en: 'Failed', ta: 'தோல்வி' },
      'refunded': { en: 'Refunded', ta: 'திரும்பப் பெறப்பட்டது' }
    };
    return this.language === 'ta' ? labels[status]?.ta : labels[status]?.en;
  }

  goBack() {
    if (this.currentShop) {
      // Navigate within shop context
      this.router.navigate([this.currentShop.slug, 'seller', 'dashboard']);
    } else {
      // Fallback to global seller route
      this.router.navigate(['/seller/dashboard']);
    }
  }
}

