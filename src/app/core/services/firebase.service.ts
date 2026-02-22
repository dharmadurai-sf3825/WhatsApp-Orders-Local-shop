import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Shop } from '../models/shop.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

// Note: This is a placeholder service. Implement actual Firebase integration
// by installing @angular/fire and configuring Firestore

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // In-memory storage for development (temporary until Firestore is implemented)
  private inMemoryProducts: Product[] = [];
  private productIdCounter = 100;

  // Shop Methods
  getShopById(shopId: string): Observable<Shop | null> {
    // TODO: Implement Firestore query
    console.log('Firebase: Getting shop by ID', shopId);
    return of(this.getMockShop());
  }

  getShopBySlug(slug: string): Observable<Shop | null> {
    // TODO: Implement Firestore query where slug == slug
    console.log('Firebase: Getting shop by slug', slug);
    return of(this.getMockShopBySlug(slug));
  }

  updateShop(shopId: string, shop: Partial<Shop>): Observable<void> {
    // TODO: Implement Firestore update
    console.log('Firebase: Updating shop', shopId, shop);
    return of(undefined);
  }

  // Product Methods
  getProductsByShopId(shopId: string): Observable<Product[]> {
    // TODO: Implement Firestore query
    console.log('Firebase: Getting products for shop', shopId);
    
    // Combine mock products with in-memory products, filter by shopId
    const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
    const filtered = allProducts.filter(p => p.shopId === shopId);
    
    console.log('All products:', allProducts.length);
    console.log('Filtered for shop', shopId, ':', filtered.length);
    
    return of(filtered);
  }

  getProductById(productId: string): Observable<Product | null> {
    // TODO: Implement Firestore query
    console.log('Firebase: Getting product', productId);
    const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
    return of(allProducts.find(p => p.id === productId) || null);
  }

  addProduct(product: Product): Observable<Product> {
    // TODO: Implement Firestore add
    console.log('Firebase: Adding product', product);
    
    // Generate a unique ID
    const newId = `prod-${this.productIdCounter++}`;
    const newProduct = { ...product, id: newId };
    
    // Add to in-memory storage
    this.inMemoryProducts.push(newProduct);
    
    console.log('Product added to memory:', newProduct);
    console.log('Total in-memory products:', this.inMemoryProducts.length);
    
    return of(newProduct);
  }

  updateProduct(productId: string, product: Partial<Product>): Observable<void> {
    // TODO: Implement Firestore update
    console.log('Firebase: Updating product', productId, product);
    
    // Update in-memory product
    const index = this.inMemoryProducts.findIndex(p => p.id === productId);
    if (index >= 0) {
      this.inMemoryProducts[index] = { ...this.inMemoryProducts[index], ...product };
      console.log('Product updated in memory');
    }
    
    return of(undefined);
  }

  deleteProduct(productId: string): Observable<void> {
    // TODO: Implement Firestore delete
    console.log('Firebase: Deleting product', productId);
    
    // Remove from in-memory storage
    const index = this.inMemoryProducts.findIndex(p => p.id === productId);
    if (index >= 0) {
      this.inMemoryProducts.splice(index, 1);
      console.log('Product deleted from memory');
    }
    
    return of(undefined);
  }

  // Order Methods
  getOrdersByShopId(shopId: string): Observable<Order[]> {
    // TODO: Implement Firestore query
    console.log('Firebase: Getting orders for shop', shopId);
    return of([]);
  }

  getOrderById(orderId: string): Observable<Order | null> {
    // TODO: Implement Firestore query
    console.log('Firebase: Getting order', orderId);
    return of(null);
  }

  createOrder(order: Order): Observable<string> {
    // TODO: Implement Firestore add
    console.log('Firebase: Creating order', order);
    return of('new-order-id');
  }

  updateOrder(orderId: string, order: Partial<Order>): Observable<void> {
    // TODO: Implement Firestore update
    console.log('Firebase: Updating order', orderId, order);
    return of(undefined);
  }

  // Mock Data (for development/testing)
  private getMockShop(): Shop {
    return {
      id: 'shop-1',
      slug: 'demo-shop',
      name: 'Sri Ganesh Bakery',
      phoneE164: '918220762702',
      address: 'Main Street, Kurinjipadi, Tamil Nadu - 607302',
      gstNo: '33AAAAA0000A1Z5',
      upiId: 'sriganesh@paytm',
      razorpayKeyId: 'rzp_test_demo',
      theme: {
        primaryColor: '#FF6B6B',
        logoUrl: ''
      },
      isActive: true
    };
  }

  private getMockShopBySlug(slug: string): Shop | null {
    // Mock multiple shops for demonstration
    const shops: { [key: string]: Shop } = {
      'demo-shop': {
        id: 'shop-demo',
        slug: 'demo-shop',
        name: 'Demo Shop',
        phoneE164: '918220762702',
        address: 'Main Street, Kurinjipadi, Tamil Nadu - 607302',
        gstNo: '33AAAAA0000A1Z5',
        upiId: 'demo@paytm',
        razorpayKeyId: 'rzp_test_demo',
        theme: {
          primaryColor: '#FF6B6B',
          logoUrl: ''
        },
        isActive: true
      },
      'ganesh-bakery': {
        id: 'shop-ganesh',
        slug: 'ganesh-bakery',
        name: 'Sri Ganesh Bakery',
        phoneE164: '918220762702',
        address: 'Main Street, Kurinjipadi, Tamil Nadu - 607302',
        gstNo: '33AAAAA0000A1Z5',
        upiId: 'ganeshbakery@paytm',
        razorpayKeyId: 'rzp_test_ganesh',
        theme: {
          primaryColor: '#FF6B6B',
          secondaryColor: '#4ECDC4',
          logoUrl: ''
        },
        isActive: true
      },
      'anbu-grocery': {
        id: 'shop-anbu',
        slug: 'anbu-grocery',
        name: 'Anbu Grocery Store',
        phoneE164: '919876543210',
        address: 'Gandhi Road, Kurinjipadi, Tamil Nadu - 607302',
        gstNo: '33BBBBB1111B2Z6',
        upiId: 'anbugrocery@paytm',
        razorpayKeyId: 'rzp_test_anbu',
        theme: {
          primaryColor: '#4CAF50',
          secondaryColor: '#8BC34A',
          logoUrl: ''
        },
        isActive: true
      },
      'kumar-restaurant': {
        id: 'shop-kumar',
        slug: 'kumar-restaurant',
        name: 'Kumar Restaurant',
        phoneE164: '919887654321',
        address: 'Bazaar Street, Kurinjipadi, Tamil Nadu - 607302',
        gstNo: '33CCCCC2222C3Z7',
        upiId: 'kumarrestaurant@paytm',
        razorpayKeyId: 'rzp_test_kumar',
        theme: {
          primaryColor: '#FF9800',
          secondaryColor: '#FFC107',
          logoUrl: ''
        },
        isActive: true
      }
    };

    return shops[slug] || null;
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 'prod-1',
        shopId: 'shop-1',
        name: 'Veg Puff',
        nameTA: 'வெஜ் பஃப்',
        description: 'Crispy puff pastry with spicy vegetable filling',
        descriptionTA: 'காரமான காய்கறி நிரப்புதலுடன் கூடிய மொறுமொறுப்பான பஃப்',
        price: 15,
        unit: 'piece',
        unitTA: 'துண்டு',
        category: 'Snacks',
        categoryTA: 'சிற்றுண்டி',
        imageUrl: '',
        inStock: true
      },
      {
        id: 'prod-2',
        shopId: 'shop-1',
        name: 'Chicken Puff',
        nameTA: 'சிக்கன் பஃப்',
        description: 'Flaky puff pastry with chicken filling',
        descriptionTA: 'சிக்கன் நிரப்புதலுடன் கூடிய மொறுமொறுப்பான பஃப்',
        price: 25,
        unit: 'piece',
        unitTA: 'துண்டு',
        category: 'Snacks',
        categoryTA: 'சிற்றுண்டி',
        imageUrl: '',
        inStock: true
      },
      {
        id: 'prod-3',
        shopId: 'shop-1',
        name: 'Masala Tea',
        nameTA: 'மசாலா டீ',
        description: 'Hot masala chai',
        descriptionTA: 'சூடான மசாலா சாய்',
        price: 10,
        unit: 'cup',
        unitTA: 'கப்',
        category: 'Beverages',
        categoryTA: 'பானங்கள்',
        imageUrl: '',
        inStock: true
      },
      {
        id: 'prod-4',
        shopId: 'shop-1',
        name: 'Bread (White)',
        nameTA: 'ரொட்டி (வெள்ளை)',
        description: 'Fresh white bread loaf',
        descriptionTA: 'புதிய வெள்ளை ரொட்டி',
        price: 40,
        unit: 'loaf',
        unitTA: 'ரொட்டி',
        category: 'Bakery',
        categoryTA: 'பேக்கரி',
        imageUrl: '',
        inStock: true
      }
    ];
  }
}
