export interface Order {
  id?: string;
  shopId: string;
  orderNumber?: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  deliveryCharge?: number;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  landmark?: string;
  preferredTime?: string;
  notes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  razorpayLinkId?: string;
  razorpayPaymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  confirmedAt?: Date;
  paidAt?: Date;
  dispatchedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  selectedOptions?: { [key: string]: string };
}

export enum OrderStatus {
  NEW = 'new',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DISPATCHED = 'dispatched',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  LINK_SENT = 'link_sent',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  preferredTime?: string;
  notes?: string;
}
