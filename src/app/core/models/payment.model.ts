export interface Payment {
  id?: string;
  orderId: string;
  linkId: string; // Razorpay Payment Link ID
  amount: number;
  currency: string;
  status: string;
  shortUrl?: string;
  createdAt?: Date;
  paidAt?: Date;
  webhookPayload?: any;
}

export interface RazorpayPaymentLink {
  id: string;
  amount: number;
  currency: string;
  accept_partial: boolean;
  first_min_partial_amount?: number;
  description: string;
  customer: {
    name: string;
    email?: string;
    contact: string;
  };
  notify: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  reminder_enable: boolean;
  notes?: { [key: string]: string };
  callback_url?: string;
  callback_method?: string;
  cancelled_at?: number;
  created_at: number;
  expire_by?: number;
  expired_at?: number;
  first_paid_at?: number;
  paid_at?: number;
  payments?: any[];
  reference_id?: string;
  short_url: string;
  status: string;
  updated_at?: number;
  upi_link?: boolean;
  user_id: string;
}
