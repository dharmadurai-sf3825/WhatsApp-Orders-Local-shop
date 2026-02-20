export interface Shop {
  id?: string;
  name: string;
  phoneE164: string; // E.164 format: 918220762702
  address: string;
  gstNo?: string;
  upiId?: string;
  theme?: ShopTheme;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface ShopTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}
