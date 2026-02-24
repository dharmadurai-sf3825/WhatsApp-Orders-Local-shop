# 🛠️ Complete Setup Guide - WhatsApp Ordering PWA

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Node.js** 18+ and npm
- ✅ **Angular CLI** 17+: `npm install -g @angular/cli`
- ✅ **Firebase CLI**: `npm install -g firebase-tools`
- ✅ **Git** for version control
- ✅ **VS Code** (recommended) or any code editor

---

## 🚀 Step 1: Clone and Install

```powershell
# Clone the repository
git clone https://github.com/your-username/WhatsApp-Orders-Local-shop.git
cd WhatsApp-Orders-Local-shop

# Install dependencies
npm install
```

---

## 🔥 Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "whatsapp-orders")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2.2 Enable Firebase Services

#### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

#### Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Select **Start in test mode** (we'll add rules later)
4. Choose your region
5. Click **Enable**

#### Storage
1. Go to **Storage**
2. Click **Get Started**
3. Use default rules
4. Click **Done**

#### Hosting (for deployment)
1. Go to **Hosting**
2. Click **Get Started**
3. Follow the setup wizard

### 2.3 Get Firebase Configuration

1. Click **Project Settings** ⚙️
2. Scroll to **Your apps**
3. Click **Web** icon `</>`
4. Register app (nickname: "WhatsApp PWA")
5. **Copy the configuration object**

---

## 🔧 Step 3: Configure Environment Files

### 3.1 Development Environment

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  
  // Firebase Configuration (from Firebase Console)
  firebase: {
    apiKey: 'AIzaSy...', // Your API key
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef'
  },
  
  // Razorpay Configuration (TEST keys for development)
  razorpay: {
    keyId: 'rzp_test_XXXXXXXXXX', // Get from Razorpay Dashboard
    keySecret: '' // Keep empty on frontend
  },
  
  // WhatsApp Configuration
  whatsapp: {
    businessNumber: '918220762702', // Your WhatsApp number with country code
    defaultMessage: 'Hello, I want to place an order'
  }
};
```

### 3.2 Production Environment

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  
  firebase: {
    apiKey: 'AIzaSy...', // Your PRODUCTION API key
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef'
  },
  
  razorpay: {
    keyId: 'rzp_live_XXXXXXXXXX', // LIVE keys for production
    keySecret: '' // Keep empty on frontend
  },
  
  whatsapp: {
    businessNumber: '918220762702',
    defaultMessage: 'Hello, I want to place an order'
  }
};
```

⚠️ **IMPORTANT**: These files are git-ignored and won't be committed!

---

## 💳 Step 4: Razorpay Setup (Optional for Testing)

### 4.1 Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Complete KYC verification

### 4.2 Get API Keys

1. Go to **Settings** → **API Keys**
2. For **Development**: Use **Test Mode** keys
   - Test Key: `rzp_test_XXXXXXXXXX`
3. For **Production**: Generate **Live Mode** keys
   - Live Key: `rzp_live_XXXXXXXXXX`

### 4.3 Test Cards (for Development)

Use these test cards in Test Mode:
- **Success**: `4111 1111 1111 1111` (Any CVV, future expiry)
- **Failure**: `4000 0000 0000 0002`

---

## 📱 Step 5: WhatsApp Configuration

### 5.1 Get WhatsApp Business Number

1. Get a **WhatsApp Business** account
2. Note your phone number in E.164 format
   - Example: India +91 8220762702 → `918220762702`
   - Example: USA +1 234 567 8900 → `12345678900`

### 5.2 Update Configuration

Already done in Step 3! Just update the `businessNumber` in environment files.

---

## 🗃️ Step 6: Initialize Firestore Database

### 6.1 Create Collections

You need to create these collections (with at least 1 document each):

#### **Collection: `admin`**
```typescript
// Document ID: (your email or 'super-admin')
{
  email: 'admin@shop.com',
  role: 'super_admin',
  status: 'active',
  createdAt: Timestamp
}
```

#### **Collection: `shops`**
```typescript
// Document ID: (auto-generated)
{
  slug: 'demo-shop',
  name: 'Demo Shop',
  phoneE164: '918220762702',
  address: '123 Main St, City',
  isActive: true,
  theme: {
    primaryColor: '#1976d2',
    accentColor: '#ff4081'
  },
  createdAt: Timestamp
}
```

#### **Collection: `shop_ownership`**
```typescript
// Document ID: {userId}_{shopSlug}
{
  userId: 'abc123...',        // Firebase Auth UID
  email: 'seller@shop.com',
  shopSlug: 'demo-shop',      // Must match shops.slug
  shopName: 'Demo Shop',
  role: 'owner',
  status: 'active',
  createdAt: Timestamp
}
```

#### **Collection: `products`**
```typescript
// Document ID: (auto-generated)
{
  name: 'Sample Product',
  description: 'Product description',
  price: 100,
  shopId: '(shop document ID)',
  category: 'General',
  imageUrl: '',
  isAvailable: true,
  createdAt: Timestamp
}
```

### 6.2 Deploy Firestore Rules

```powershell
firebase deploy --only firestore:rules
```

---

## 🏃 Step 7: Run Development Server

```powershell
# Start the development server
npm start

# Or explicitly:
ng serve --open
```

Navigate to **http://localhost:4200/**

---

## 🧪 Step 8: Test the Application

### Test Customer Flow
1. Navigate to: `http://localhost:4200/demo-shop/home`
2. Browse products
3. Add items to cart
4. Click "Order via WhatsApp"
5. Verify WhatsApp opens with order details

### Test Seller Flow
1. Create a seller account in Firestore (see Step 6.1)
2. Navigate to: `http://localhost:4200/seller/login`
3. Login with seller credentials
4. Verify redirect to: `http://localhost:4200/seller/demo-shop/dashboard`
5. Test product management, order management

### Test Admin Flow
1. Create admin account in Firestore (see Step 6.1)
2. Navigate to: `http://localhost:4200/admin/login`
3. Login with admin credentials
4. Test seller management

---

## 🔒 Step 9: Configure Security Rules

### 9.1 Firestore Security Rules

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admin/$(request.auth.token.email));
    }
    
    function isShopOwner(shopSlug) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/shop_ownership/$(request.auth.uid + '_' + shopSlug));
    }
    
    // Admin collection
    match /admin/{adminId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Firebase Console
    }
    
    // Shops collection
    match /shops/{shopId} {
      allow read: if true; // Public read
      allow write: if isAdmin() || isShopOwner(resource.data.slug);
    }
    
    // Shop ownership
    match /shop_ownership/{ownershipId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Products
    match /products/{productId} {
      allow read: if true; // Public read
      allow write: if isAdmin() || isShopOwner(resource.data.shopSlug);
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if true; // Anyone can create orders
      allow update: if isAdmin() || isShopOwner(resource.data.shopSlug);
    }
  }
}
```

Deploy rules:
```powershell
firebase deploy --only firestore:rules
```

---

## 📦 Step 10: Build for Production

```powershell
# Build optimized production bundle
npm run build:prod

# Output will be in: dist/whatsapp-ordering-pwa/browser/
```

Verify the build:
- Check `dist/whatsapp-ordering-pwa/browser/index.html` exists
- Check `ngsw-worker.js` (Service Worker) exists
- Check `manifest.webmanifest` (PWA) exists

---

## 🚀 Step 11: Deploy to Firebase

```powershell
# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Select:
# - Hosting
# - Firestore
# Public directory: dist/whatsapp-ordering-pwa/browser
# Single-page app: Yes

# Deploy everything
firebase deploy

# OR deploy only hosting
firebase deploy --only hosting
```

Your app will be live at:
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`

---

## ✅ Post-Setup Checklist

- [ ] Development server runs without errors
- [ ] Customer pages load correctly (/:shopSlug/home)
- [ ] Seller login works (/seller/login)
- [ ] Admin login works (/admin/login)
- [ ] WhatsApp integration works
- [ ] Razorpay test payment works
- [ ] PWA installs on mobile device
- [ ] Firestore rules deployed
- [ ] Production environment configured

---

## 🆘 Troubleshooting

### "Firebase not configured" Error
- Verify `environment.ts` has correct Firebase config
- Check Firebase project is created and enabled

### "Products not showing"
- Verify products collection has documents
- Check `shopId` in products matches shop document ID
- Check Firestore rules allow read access

### "Access denied" for Seller
- Verify `shop_ownership` document exists
- Check document ID format: `{userId}_{shopSlug}`
- Verify `userId` matches Firebase Auth UID

### Build Errors
```powershell
# Clear Angular cache
rd /s /q .angular
rd /s /q dist
npm install
npm run build:prod
```

### Port Already in Use
```powershell
# Kill process on port 4200
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process
```

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Angular Material](https://material.angular.io)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## 🎉 Setup Complete!

You're ready to start developing! For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Next Steps:**
1. Customize your shop theme
2. Add your products
3. Test the order flow
4. Deploy to production

---

**Last Updated:** February 2026
