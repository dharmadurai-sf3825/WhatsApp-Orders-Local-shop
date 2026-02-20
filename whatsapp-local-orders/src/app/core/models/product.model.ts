export interface Product {
  id?: string;
  shopId: string;
  name: string;
  nameTA?: string; // Tamil name
  description?: string;
  descriptionTA?: string; // Tamil description
  price: number;
  unit: string; // 'piece', 'kg', 'liter', 'packet', etc.
  unitTA?: string; // Tamil unit
  imageUrl?: string;
  category?: string;
  categoryTA?: string;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  options?: ProductOption[]; // Size, add-ons, etc.
}

export interface ProductOption {
  name: string;
  nameTA?: string;
  values: string[];
  valuesTA?: string[];
  required?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: { [key: string]: string };
  totalPrice: number;
}
