import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Shop } from '../models/shop.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

import { environment } from '../../../environments/environment';

// Firestore (AngularFire / modular)
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

// Note: This is a placeholder service. Implement actual Firebase integration
// by installing @angular/fire and configuring Firestore

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // In-memory storage + localStorage for persistence across page refreshes
  private inMemoryProducts: Product[] = [];
  private productIdCounter = 100;
  private readonly STORAGE_KEY = 'whatsapp_products';

  // Use Firestore when environment has real Firebase config
  private useFirestore = !!(
    environment.firebase &&
    environment.firebase.projectId &&
    !environment.firebase.projectId.startsWith('YOUR_') &&
    environment.firebase.apiKey &&
    !environment.firebase.apiKey.startsWith('YOUR_')
  );

  constructor(private firestore?: Firestore) {
    // Load products from localStorage on initialization
    this.loadFromLocalStorage();
    
    // Log detailed initialization info
    console.log('🔥 Firebase Service Initializing...');
    console.log('Environment check:', {
      hasFirebaseConfig: !!environment.firebase,
      projectId: environment.firebase?.projectId,
      apiKey: environment.firebase?.apiKey ? 'Present' : 'Missing',
      useFirestore: this.useFirestore,
      firestoreInjected: !!this.firestore,
      localStorageProducts: this.inMemoryProducts.length
    });
    
    if (this.useFirestore && this.firestore) {
      console.log('✅ Firebase: Firestore ENABLED - Using cloud storage + localStorage backup');
      console.log('📝 Products will be saved to Firestore database');
      console.log('💡 If you see permission errors, products saved to localStorage');
    } else {
      console.log('✅ Firebase: Using localStorage persistence');
      console.log('💾 Products will SURVIVE page refresh!');
      console.log(`📦 Loaded ${this.inMemoryProducts.length} products from localStorage`);
    }
  }
  
  // Load products from localStorage
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.inMemoryProducts = JSON.parse(stored);
        console.log(`💾 Loaded ${this.inMemoryProducts.length} products from localStorage`);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      this.inMemoryProducts = [];
    }
  }
  
  // Save products to localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inMemoryProducts));
      console.log(`💾 Saved ${this.inMemoryProducts.length} products to localStorage`);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // Shop Methods
  getShopById(shopId: string): Observable<Shop | null> {
    console.log('Firebase: Getting shop by ID', shopId);
    if (!this.useFirestore || !this.firestore) {
      console.warn('Firestore not configured - getShopById returning null');
      return of(null);
    }

    try {
      const d = doc(this.firestore, 'shops', shopId);
      return from(getDoc(d)).pipe(
        map(snap => {
          if (!snap.exists()) return null;
          return { id: snap.id, ...(snap.data() as any) } as Shop;
        }),
        catchError(err => {
          console.error('❌ FIRESTORE getShopById error:', err);
          return of(null);
        })
      );
    } catch (err) {
      console.error('❌ getShopById unexpected error:', err);
      return of(null);
    }
  }

  getShopBySlug(slug: string): Observable<Shop | null> {
    const trimmedSlug = slug.trim().toLowerCase();
    console.log('🔍 Firebase: Getting shop by slug:', { 
      originalSlug: slug, 
      trimmedSlug: trimmedSlug,
      firestoreEnabled: this.useFirestore && !!this.firestore 
    });

    if (!this.useFirestore || !this.firestore) {
      console.warn('⚠️ Firestore not configured - falling back to mock data');
      const mockShop = this.getMockShopBySlug(trimmedSlug);
      return of(mockShop);
    }

    try {
      const col = collection(this.firestore, 'shop_ownership');
      const q = query(col, where('shopSlug', '==', trimmedSlug));
      
      console.log('📋 Query Details:', { 
        collection: 'shop_ownership', 
        field: 'shopSlug', 
        operator: '==', 
        value: trimmedSlug 
      });

      return from(getDocs(q)).pipe(
        map(snapshot => {
          const docList = snapshot.docs.map(d => ({ 
            id: d.id, 
            shopSlug: (d.data() as any)['shopSlug'],
            shopName: (d.data() as any)['shopName'] 
          }));

          console.log('📊 Query Results:', { 
            isEmpty: snapshot.empty, 
            documentCount: snapshot.docs.length,
            foundDocs: docList
          });

          if (snapshot.empty) {
            console.warn(`⚠️ No shop found with slug: "${trimmedSlug}"`);
            return null;
          }

          const d = snapshot.docs[0];
          const data = d.data() as any;
          
          console.log('📄 Raw Firestore Data:', data);
          // Map Firestore fields to Shop model
          const shop: Shop = {
            id: data.userId || d.id,
            slug: data.shopSlug || trimmedSlug,
            name: data.shopName || '',
            phoneE164: data.phoneE164 || '',
            address: data.address || '',
            ownerId: data.userId,
            gstNo: data.gstNo,
            upiId: data.upiId,
            razorpayKeyId: data.razorpayKeyId,
            theme: data.theme,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            isActive: data.status === 'active' || data.isActive === true
          };
          
          console.log('✅ Shop mapped successfully:', { 
            id: shop.id, 
            slug: shop.slug, 
            name: shop.name,
            isActive: shop.isActive
          });
          return shop;
        }),
        catchError(err => {
          console.error('❌ FIRESTORE getShopBySlug error:', err);
          console.log('📋 Error Details:', {
            code: (err as any).code,
            message: (err as any).message,
            slug: trimmedSlug
          });
          // Try mock data as fallback
          const mockShop = this.getMockShopBySlug(trimmedSlug);
          if (mockShop) {
            console.log('💾 Using mock data as fallback');
            return of(mockShop);
          }
          return of(null);
        })
      );
    } catch (err) {
      console.error('❌ getShopBySlug unexpected error:', err);
      return of(null);
    }
  }

  updateShop(shopId: string, shop: Partial<Shop>): Observable<void> {
    // TODO: Implement Firestore update
    console.log('Firebase: Updating shop', shopId, shop);
    return of(undefined);
  }

  // Product Methods
  getProductsByShopId(shopId: string): Observable<Product[]> {
    console.log('📥 Getting products for shopId:', shopId);
    console.log('   Using Firestore?', this.useFirestore && !!this.firestore);

    if (!this.useFirestore || !this.firestore) {
      // Fallback to mock + in-memory
      const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
      const filtered = allProducts.filter(p => p.shopId === shopId);
      console.log('📦 IN-MEMORY ONLY: Total products:', allProducts.length, '| Filtered:', filtered.length);
      console.log('   Products:', filtered.map(p => ({ id: p.id, name: p.name, shopId: p.shopId })));
      return of(filtered);
    }

    console.log('☁️ FIRESTORE: Querying products collection...');
    const col = collection(this.firestore, 'products');
    const q = query(col, where('shopId', '==', shopId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        // ALWAYS combine Firestore + in-memory products
        // This handles case where Firestore save fails but read succeeds
        const firestoreProducts = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Product));
        const mockProducts = this.getMockProducts().filter(p => p.shopId === shopId);
        const memoryProducts = this.inMemoryProducts.filter(p => p.shopId === shopId);
        
        // Combine all sources, remove duplicates by ID
        const allProducts = [...firestoreProducts, ...mockProducts, ...memoryProducts];
        const uniqueProducts = Array.from(
          new Map(allProducts.map(p => [p.id, p])).values()
        );
        
        console.log('✅ COMBINED RESULTS:');
        console.log('   Firestore:', firestoreProducts.length);
        console.log('   Mock:', mockProducts.length);
        console.log('   In-Memory:', memoryProducts.length);
        console.log('   Total Unique:', uniqueProducts.length);
        console.log('   Products:', uniqueProducts.map(p => ({ id: p.id, name: p.name, shopId: p.shopId })));
        
        return uniqueProducts;
      }),
      catchError(err => {
        console.error('❌ FIRESTORE ERROR:', err);
        console.warn('⚠️ Falling back to in-memory storage');
        const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
        const filtered = allProducts.filter(p => p.shopId === shopId);
        console.log('📦 FALLBACK: Returning', filtered.length, 'products');
        return of(filtered);
      })
    );
  }

  getProductById(productId: string): Observable<Product | null> {
    console.log('🔍 Getting product by ID:', productId);
    console.log('   Using Firestore?', this.useFirestore && !!this.firestore);

    if (!this.useFirestore || !this.firestore) {
      const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
      const product = allProducts.find(p => p.id === productId) || null;
      console.log('📦 IN-MEMORY: Found product?', !!product, product?.name);
      return of(product);
    }

    // Try Firestore first, but ALWAYS check in-memory as fallback
    const d = doc(this.firestore, 'products', productId);
    return from(getDoc(d)).pipe(
      map(snap => {
        if (snap.exists()) {
          const product = { id: snap.id, ...(snap.data() as any) } as Product;
          console.log('✅ FIRESTORE: Found product', product.name);
          return product;
        }
        
        // Not in Firestore, check in-memory
        const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
        const product = allProducts.find(p => p.id === productId) || null;
        console.log('📦 IN-MEMORY FALLBACK: Found product?', !!product, product?.name);
        return product;
      }),
      catchError(err => {
        console.error('❌ FIRESTORE ERROR:', err);
        console.warn('⚠️ Falling back to in-memory search');
        const allProducts = [...this.getMockProducts(), ...this.inMemoryProducts];
        const product = allProducts.find(p => p.id === productId) || null;
        console.log('📦 FALLBACK: Found product?', !!product, product?.name);
        return of(product);
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    console.log('➕ Adding product:', { 
      name: product.name, 
      shopId: product.shopId,
      price: product.price 
    });
    console.log('   Using Firestore?', this.useFirestore && !!this.firestore);

    if (!this.useFirestore || !this.firestore) {
      // localStorage add
      const newId = `prod-${this.productIdCounter++}`;
      const newProduct = { ...product, id: newId };
      this.inMemoryProducts.push(newProduct);
      this.saveToLocalStorage();
      console.log('✅ localStorage: Product added with ID:', newId);
      console.log('   Total products:', this.inMemoryProducts.length);
      return of(newProduct);
    }

    console.log('☁️ FIRESTORE: Saving to products collection...');
    const col = collection(this.firestore, 'products');
    const productData = { ...product };
    delete productData.id; // Remove id field before saving to Firestore
    
    return from(addDoc(col, productData)).pipe(
      map(ref => {
        const newProduct = { ...product, id: ref.id } as Product;
        console.log('✅ FIRESTORE: Product saved successfully!');
        console.log('   Document ID:', ref.id);
        console.log('   Product:', { name: newProduct.name, shopId: newProduct.shopId });
        return newProduct;
      }),
      catchError(err => {
        console.error('❌ FIRESTORE ERROR:', err);
        console.warn('⚠️ Falling back to localStorage storage');
        const newId = `prod-${this.productIdCounter++}`;
        const newProduct = { ...product, id: newId };
        this.inMemoryProducts.push(newProduct);
        this.saveToLocalStorage();
        console.log('💾 FALLBACK: Product saved to localStorage with ID:', newId);
        return of(newProduct);
      })
    );
  }

  updateProduct(productId: string, product: Partial<Product>): Observable<void> {
    console.log('Firebase: Updating product', productId, product);

    if (!this.useFirestore || !this.firestore) {
      const index = this.inMemoryProducts.findIndex(p => p.id === productId);
      if (index >= 0) {
        this.inMemoryProducts[index] = { ...this.inMemoryProducts[index], ...product };
        this.saveToLocalStorage();
        console.log('✅ Product updated in localStorage');
      }
      return of(undefined);
    }

    const d = doc(this.firestore, 'products', productId);
    return from(updateDoc(d, product as any)).pipe(
      map(() => undefined),
      catchError(err => {
        console.warn('Firestore updateProduct error, falling back to localStorage:', err);
        const index = this.inMemoryProducts.findIndex(p => p.id === productId);
        if (index >= 0) {
          this.inMemoryProducts[index] = { ...this.inMemoryProducts[index], ...(product as any) };
          this.saveToLocalStorage();
        }
        return of(undefined);
      })
    );
  }

  deleteProduct(productId: string): Observable<void> {
    console.log('Firebase: Deleting product', productId);

    if (!this.useFirestore || !this.firestore) {
      const index = this.inMemoryProducts.findIndex(p => p.id === productId);
      if (index >= 0) {
        this.inMemoryProducts.splice(index, 1);
        this.saveToLocalStorage();
        console.log('✅ Product deleted from localStorage');
      }
      return of(undefined);
    }

    const d = doc(this.firestore, 'products', productId);
    return from(deleteDoc(d)).pipe(
      map(() => undefined),
      catchError(err => {
        console.warn('Firestore deleteProduct error, falling back to localStorage:', err);
        const index = this.inMemoryProducts.findIndex(p => p.id === productId);
        if (index >= 0) {
          this.inMemoryProducts.splice(index, 1);
          this.saveToLocalStorage();
        }
        return of(undefined);
      })
    );
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
      slug: 'ganesh-bakery',
      name: 'Sri Ganesh Bakery',
      phoneE164: '918220762702',
      address: 'Main Street, Kurinjipadi, Tamil Nadu - 607302',
      gstNo: '33AAAAA0000A1Z5',
      upiId: 'sriganesh@paytm',
      razorpayKeyId: 'rzp_test_ganesh',
      theme: {
        primaryColor: '#FF6B6B',
        logoUrl: ''
      },
      isActive: true
    };
  }

  private getMockShopBySlug(slug: string): Shop | null {
    // Mock multiple shops for testing
    const shops: { [key: string]: Shop } = {
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
