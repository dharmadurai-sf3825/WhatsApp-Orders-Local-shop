export interface SellerUser {
  uid: string;
  email: string;
  displayName?: string;
  shopIds: string[]; // Array of shop IDs this user owns/manages
  createdAt: Date;
  lastLogin?: Date;
}

export interface ShopOwnership {
  shopId: string;
  shopSlug: string;
  userId: string;
  role: 'owner' | 'manager' | 'staff';
  createdAt: Date;
}
