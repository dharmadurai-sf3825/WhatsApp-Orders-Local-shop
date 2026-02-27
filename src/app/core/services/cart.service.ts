import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'shopping_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem(this.CART_KEY);
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cartSubject.next([]);
      }
    }
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(product: Product, quantity: number = 1, selectedOptions?: { [key: string]: string }): void {
    const cart = this.cartSubject.value;
    const existingItemIndex = cart.findIndex(item => 
      item.id === product.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].totalPrice = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity,
        selectedOptions,
        totalPrice: product.price * quantity
      };
      cart.push(cartItem);
    }

    this.saveCart(cart);
  }

  updateQuantity(itemIndex: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart[itemIndex];

    // Validate quantity against maxQuantity (if specified)
    if (item.maxQuantity && quantity > item.maxQuantity) {
      console.warn(
        `Quantity ${quantity} exceeds max available ${item.maxQuantity} for ${item.name}. Capping at max.`
      );
      quantity = item.maxQuantity;
    }

    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
      cart[itemIndex].totalPrice = cart[itemIndex].price * quantity;
    }
    this.saveCart(cart);
  }

  removeItem(itemIndex: number): void {
    const cart = this.cartSubject.value;
    cart.splice(itemIndex, 1);
    this.saveCart(cart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.totalPrice, 0);
  }
}
