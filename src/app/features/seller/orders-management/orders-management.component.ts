import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  template: `
    <app-seller-header></app-seller-header>
    
    <div class="orders-management-container">
      <div class="header">
        <h1>{{ language === 'ta' ? 'ஆர்டர்கள் நிர்வாகம்' : 'Orders Management' }}</h1>
      </div>

      <!-- Orders Tabs -->
      <mat-tab-group mat-stretch-tabs="false" (selectedTabChange)="onTabChange($event)">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>new_releases</mat-icon>
            {{ language === 'ta' ? 'புதிய' : 'New' }} ({{ getOrdersByStatus('new').length }})
          </ng-template>
          <div class="tab-content">
            <ng-container *ngTemplateOutlet="ordersList; context: { orders: getOrdersByStatus('new') }"></ng-container>
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>check_circle</mat-icon>
            {{ language === 'ta' ? 'உறுதிப்படுத்தப்பட்டது' : 'Confirmed' }} ({{ getOrdersByStatus('confirmed').length }})
          </ng-template>
          <div class="tab-content">
            <ng-container *ngTemplateOutlet="ordersList; context: { orders: getOrdersByStatus('confirmed') }"></ng-container>
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>local_shipping</mat-icon>
            {{ language === 'ta' ? 'அனுப்பப்பட்டது' : 'Dispatched' }} ({{ getOrdersByStatus('dispatched').length }})
          </ng-template>
          <div class="tab-content">
            <ng-container *ngTemplateOutlet="ordersList; context: { orders: getOrdersByStatus('dispatched') }"></ng-container>
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>done_all</mat-icon>
            {{ language === 'ta' ? 'முடிந்தது' : 'Completed' }} ({{ getOrdersByStatus('delivered').length }})
          </ng-template>
          <div class="tab-content">
            <ng-container *ngTemplateOutlet="ordersList; context: { orders: getOrdersByStatus('delivered') }"></ng-container>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Orders List Template -->
      <ng-template #ordersList let-orders="orders">
        <div class="orders-list">
          <mat-card *ngFor="let order of orders" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3>#{{ order.orderNumber || order.id?.substring(0, 8) }}</h3>
                <p class="order-time">
                  {{ order.createdAt | date: 'short' }}
                </p>
              </div>
              <div class="order-badges">
                <mat-chip [class]="'status-' + order.status">
                  {{ getStatusLabel(order.status) }}
                </mat-chip>
                <mat-chip [class]="'payment-' + order.paymentStatus">
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </mat-chip>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="order-body">
              <!-- Customer Details -->
              <div class="customer-section">
                <h4>
                  <mat-icon>person</mat-icon>
                  {{ language === 'ta' ? 'வாடிக்கையாளர் விவரங்கள்' : 'Customer Details' }}
                </h4>
                <p><strong>{{ language === 'ta' ? 'பெயர்' : 'Name' }}:</strong> {{ order.customerName }}</p>
                <p><strong>{{ language === 'ta' ? 'தொலைபேசி' : 'Phone' }}:</strong> {{ order.phone }}</p>
                <p><strong>{{ language === 'ta' ? 'முகவரி' : 'Address' }}:</strong> {{ order.address }}</p>
                <p *ngIf="order.landmark"><strong>{{ language === 'ta' ? 'அடையாளம்' : 'Landmark' }}:</strong> {{ order.landmark }}</p>
                <p *ngIf="order.preferredTime"><strong>{{ language === 'ta' ? 'விருப்ப நேரம்' : 'Preferred Time' }}:</strong> {{ order.preferredTime }}</p>
                <p *ngIf="order.notes"><strong>{{ language === 'ta' ? 'குறிப்புகள்' : 'Notes' }}:</strong> {{ order.notes }}</p>
              </div>

              <!-- Order Items -->
              <div class="items-section">
                <h4>
                  <mat-icon>shopping_bag</mat-icon>
                  {{ language === 'ta' ? 'பொருட்கள்' : 'Items' }} ({{ order.items.length }})
                </h4>
                <div class="order-item" *ngFor="let item of order.items">
                  <div class="item-details">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-quantity">{{ item.quantity }} {{ item.unit }}</span>
                  </div>
                  <span class="item-price">₹{{ item.totalPrice }}</span>
                </div>
              </div>

              <!-- Order Total -->
              <div class="total-section">
                <div class="total-row">
                  <span>{{ language === 'ta' ? 'துணை மொத்தம்' : 'Subtotal' }}:</span>
                  <span>₹{{ order.subtotal }}</span>
                </div>
                <div class="total-row" *ngIf="order.deliveryCharge">
                  <span>{{ language === 'ta' ? 'டெலிவரி கட்டணம்' : 'Delivery' }}:</span>
                  <span>₹{{ order.deliveryCharge }}</span>
                </div>
                <div class="total-row final">
                  <span>{{ language === 'ta' ? 'மொத்தம்' : 'Total' }}:</span>
                  <span>₹{{ order.total }}</span>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Order Actions -->
            <div class="order-actions">
              <!-- New Orders -->
              <ng-container *ngIf="order.status === 'new'">
                <button mat-raised-button color="primary" (click)="confirmOrder(order)">
                  <mat-icon>check</mat-icon>
                  {{ language === 'ta' ? 'ஆர்டரை உறுதிப்படுத்து' : 'Confirm Order' }}
                </button>
                <button mat-stroked-button color="warn" (click)="cancelOrder(order)">
                  <mat-icon>close</mat-icon>
                  {{ language === 'ta' ? 'ரத்து செய்' : 'Cancel' }}
                </button>
              </ng-container>

              <!-- Confirmed Orders -->
              <ng-container *ngIf="order.status === 'confirmed'">
                <button mat-raised-button 
                        class="whatsapp-btn" 
                        *ngIf="order.paymentStatus === 'pending'"
                        (click)="sendPaymentLink(order)">
                  <mat-icon>payment</mat-icon>
                  {{ language === 'ta' ? 'கட்டண இணைப்பு அனுப்பு' : 'Send Payment Link' }}
                </button>
                <button mat-raised-button 
                        color="primary"
                        (click)="markAsDispatched(order)">
                  <mat-icon>local_shipping</mat-icon>
                  {{ language === 'ta' ? 'அனுப்பப்பட்டது என குறி' : 'Mark Dispatched' }}
                </button>
              </ng-container>

              <!-- Dispatched Orders -->
              <ng-container *ngIf="order.status === 'dispatched'">
                <button mat-raised-button color="primary" (click)="markAsDelivered(order)">
                  <mat-icon>done</mat-icon>
                  {{ language === 'ta' ? 'முடிந்தது என குறி' : 'Mark Delivered' }}
                </button>
              </ng-container>

              <!-- All Orders -->
              <button mat-button (click)="viewOrderDetails(order)">
                <mat-icon>visibility</mat-icon>
                {{ language === 'ta' ? 'விவரங்கள்' : 'Details' }}
              </button>
            </div>
          </mat-card>

          <p *ngIf="orders.length === 0" class="no-orders">
            {{ language === 'ta' ? 'ஆர்டர்கள் இல்லை' : 'No orders found' }}
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-management-container {
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

    .tab-content {
      padding: 20px 0;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .order-card {
      padding: 0;
      overflow: hidden;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #f5f5f5;
    }

    .order-info h3 {
      margin: 0 0 5px 0;
      color: var(--whatsapp-teal);
      font-size: 1.3rem;
    }

    .order-time {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .order-badges {
      display: flex;
      gap: 10px;
    }

    mat-chip {
      font-weight: 500;
    }

    .status-new { background: #2196F3; color: white; }
    .status-confirmed { background: #4CAF50; color: white; }
    .status-preparing { background: #FF9800; color: white; }
    .status-dispatched { background: #9C27B0; color: white; }
    .status-delivered { background: #00BCD4; color: white; }
    .status-cancelled { background: #F44336; color: white; }

    .payment-pending { background: #FFC107; color: black; }
    .payment-link_sent { background: #03A9F4; color: white; }
    .payment-paid { background: var(--whatsapp-green); color: white; }
    .payment-failed { background: #F44336; color: white; }

    .order-body {
      padding: 20px;
    }

    .customer-section,
    .items-section {
      margin-bottom: 20px;
    }

    .customer-section h4,
    .items-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 15px 0;
      color: var(--whatsapp-teal);
      font-size: 1.1rem;
    }

    .customer-section p {
      margin: 8px 0;
      color: #333;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
    }

    .item-quantity {
      font-size: 0.9rem;
      color: #666;
    }

    .item-price {
      font-weight: 600;
      color: var(--whatsapp-green);
    }

    .total-section {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #eee;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 1rem;
    }

    .total-row.final {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--whatsapp-green);
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .order-actions {
      display: flex;
      gap: 10px;
      padding: 20px;
      background: #f9f9f9;
      flex-wrap: wrap;
    }

    .no-orders {
      text-align: center;
      padding: 60px 20px;
      color: #999;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .orders-management-container {
        padding: 10px;
      }

      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .order-badges {
        width: 100%;
        flex-direction: column;
      }

      .order-actions {
        flex-direction: column;
      }

      .order-actions button {
        width: 100%;
      }
    }
  `]
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
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.languageService.language$.subscribe(lang => {
      this.language = lang;
    });

    // Get current shop
    this.shopService.currentShop$.subscribe(shop => {
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
