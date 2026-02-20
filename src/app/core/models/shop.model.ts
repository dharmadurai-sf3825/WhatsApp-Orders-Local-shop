export interface Shop {
  id: string; // Unique shop identifier (slug): 'ganesh-bakery', 'anbu-grocery'
  name: string;
  slug: string; // URL-friendly identifier: 'ganesh-bakery'
  phoneE164: string; // E.164 format: 918220762702
  address: string;
  gstNo?: string;
  upiId?: string;
  razorpayKeyId?: string; // Shop-specific Razorpay key
  theme?: ShopTheme;
  ownerId?: string; // Shop owner user ID
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface ShopTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}
