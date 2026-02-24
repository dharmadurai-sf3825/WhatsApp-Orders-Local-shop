# 🔧 Troubleshooting Guide - WhatsApp Ordering PWA

## 📋 Common Issues and Solutions

---

## 🔥 Firebase Issues

### Error: "Firebase not configured"

**Symptoms:**
- Console error: "Firebase app not initialized"
- Pages show loading spinner indefinitely

**Solution:**
```typescript
// 1. Verify environment.ts has Firebase config
export const environment = {
  firebase: {
    apiKey: 'AIza...',  // Should NOT be empty
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    // ... rest of config
  }
};

// 2. Check Firebase project exists
// Go to: https://console.firebase.google.com/
// Verify your project is active

// 3. Ensure services are enabled
// - Authentication → Email/Password
// - Firestore Database
// - Storage
```

### Error: "Permission denied" in Firestore

**Symptoms:**
- Console error: "Missing or insufficient permissions"
- Data not loading

**Solution:**
```powershell
# 1. Check Firestore rules are deployed
firebase deploy --only firestore:rules

# 2. Verify rules in Firebase Console
# Go to: Firestore Database → Rules

# 3. For development, temporarily use test rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ ONLY FOR TESTING!
    }
  }
}

# 4. After testing, use production rules from SETUP-GUIDE.md
```

---

## 🔐 Authentication Issues

### "Access denied" for Seller Login

**Symptoms:**
- Seller can login but gets "Access denied" or redirected to unauthorized page
- Dashboard doesn't load

**Diagnostic Steps:**
```typescript
// 1. Check Firebase Auth user exists
// Go to: Firebase Console → Authentication → Users
// Verify user email is there

// 2. Check shop_ownership document
// Go to: Firestore → shop_ownership collection
// Look for document with ID: {userId}_{shopSlug}

// Example document ID: abc123uid_revathy-hdb
{
  userId: 'abc123uid...',     // ✅ Must match Firebase Auth UID
  email: 'seller@shop.com',
  shopSlug: 'revathy-hdb',    // ✅ Must match shops.slug
  status: 'active'            // ✅ Must be 'active'
}
```

**Solution:**

**Option A: Fix existing document (Firebase Console)**
1. Open Firestore Database
2. Navigate to `shop_ownership` collection
3. Find the seller's document
4. Click "Edit"
5. Ensure fields:
   - `userId` = Firebase Auth UID (get from Authentication → Users)
   - `shopSlug` = correct shop slug (e.g., 'revathy-hdb')
   - `status` = 'active'

**Option B: Create new document**
1. Firestore → `shop_ownership` collection
2. Click "Add document"
3. Document ID: `{userId}_{shopSlug}` (e.g., `abc123_revathy-hdb`)
4. Fields:
   ```
   userId: "abc123..."
   email: "seller@shop.com"
   shopSlug: "revathy-hdb"
   shopName: "Revathy HDB"
   role: "owner"
   status: "active"
   createdAt: [Current timestamp]
   ```
5. Save

**Option C: Use Admin Panel**
```
1. Login as admin at /admin/login
2. Go to Sellers Management
3. Add New Seller with correct details
4. System will create documents automatically
```

### "No shops assigned" Error

**Symptoms:**
- Seller logs in successfully
- Error message: "You have no shops assigned"
- Redirected back to login

**Solution:**
```typescript
// User has no shop_ownership documents
// Create one via Firebase Console or Admin Panel

// 1. Get user's Firebase Auth UID
// Firebase Console → Authentication → Users → Copy UID

// 2. Create shop_ownership document
// Document ID: {UID}_revathy-hdb
{
  userId: "{copied UID}",
  email: "seller@shop.com",
  shopSlug: "revathy-hdb",
  shopName: "Revathy HDB",
  role: "owner",
  status: "active",
  createdAt: Timestamp
}
```

---

## 🛍️ Product & Shop Issues

### Products Not Showing on Customer Site

**Symptoms:**
- Customer navigates to `/:shopSlug/products`
- Page loads but shows "No products available"

**Diagnostic Steps:**
```typescript
// 1. Verify shop exists
// Firestore → shops collection
// Check document with slug: 'revathy-hdb'

{
  slug: 'revathy-hdb',  // ✅ Must match URL
  name: 'Revathy HDB',
  isActive: true,       // ✅ Must be true
  // ... other fields
}

// 2. Verify products exist
// Firestore → products collection
// Check documents with:

{
  shopId: 'shop-revathy-001',  // ✅ Must match shop document ID
  shopSlug: 'revathy-hdb',     // ✅ Must match shop slug
  isAvailable: true,           // ✅ Must be true
  // ... other fields
}
```

**Common Mistakes:**
```typescript
// ❌ WRONG: shopSlug doesn't match
products: { shopSlug: 'revathy' }
shops: { slug: 'revathy-hdb' }

// ✅ CORRECT: Both match
products: { shopSlug: 'revathy-hdb' }
shops: { slug: 'revathy-hdb' }

// ❌ WRONG: shopId doesn't match document ID
products: { shopId: 'shop-ganesh' }
shops: { id: 'shop-revathy-001' }

// ✅ CORRECT: shopId matches document ID
products: { shopId: 'shop-revathy-001' }
shops: { id: 'shop-revathy-001' }
```

### Shop Not Found (404)

**Symptoms:**
- Customer visits `/:shopSlug/home`
- Shows "Shop not found" or error page

**Solution:**
```typescript
// 1. Check shop slug in URL matches Firestore
// URL: http://localhost:4200/revathy-hdb/home
// Firestore: shops collection → slug field must be 'revathy-hdb'

// 2. Check isActive flag
// Firestore → shops → {document} → isActive: true

// 3. Check Firestore rules allow read
// Firestore → Rules → should have:
match /shops/{shopId} {
  allow read: if true; // Public read
}
```

---

## 🔄 Routing Issues

### Page Loading Forever / White Screen

**Symptoms:**
- Navigate to seller dashboard
- Page shows loading spinner indefinitely
- No errors in console

**Solution:**
```typescript
// 1. Check for redirect loops
// Open browser DevTools → Network tab
// Look for repeated navigation requests

// 2. Clear browser cache and localStorage
localStorage.clear();
sessionStorage.clear();
// Hard refresh: Ctrl+Shift+R

// 3. Check route configuration
// Verify app.routes.ts has correct structure:

{
  path: 'seller',
  loadChildren: () => import('./features/seller/seller.routes')...
}

// NOT nested under :shopSlug:
{
  path: ':shopSlug',
  children: [
    { path: 'seller', ... } // ❌ WRONG! Causes issues
  ]
}
```

### "Cannot match any routes" Error

**Symptoms:**
- Console error: "Error: Cannot match any routes. URL Segment: '...'"
- Page shows blank or 404

**Solution:**
```typescript
// 1. Check route exists in app.routes.ts
export const routes: Routes = [
  { path: 'seller', loadChildren: ... },     // ✅ Seller routes
  { path: ':shopSlug', children: [...] },    // ✅ Customer routes
  { path: '', redirectTo: '/seller/login' }, // ✅ Default route
  { path: '**', redirectTo: '/error' }       // ✅ Catch-all
];

// 2. Verify seller.routes.ts has paths
export const SELLER_ROUTES: Routes = [
  { path: 'login', ... },              // ✅ /seller/login
  { path: ':shopSlug/dashboard', ... } // ✅ /seller/{slug}/dashboard
];

// 3. Clear Angular build cache
rd /s /q .angular
ng serve
```

---

## 💳 Razorpay Issues

### "Razorpay is not defined" Error

**Symptoms:**
- Error when clicking "Pay Now"
- Console error: "ReferenceError: Razorpay is not defined"

**Solution:**
```html
<!-- 1. Ensure Razorpay script is loaded -->
<!-- In index.html: -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<!-- 2. Check environment config -->
<!-- environment.ts: -->
razorpay: {
  keyId: 'rzp_test_XXXXXXXXXX',  // ✅ Must start with rzp_test_ or rzp_live_
  keySecret: '' // Leave empty on frontend
}

<!-- 3. Verify script loads -->
<!-- Browser DevTools → Network → Filter 'checkout.js' -->
```

### Payment Window Doesn't Open

**Solution:**
```typescript
// 1. Check popup blockers
// Browser may block popup windows
// Test: Disable popup blocker temporarily

// 2. Verify Razorpay options
const options = {
  key: environment.razorpay.keyId,  // ✅ Required
  amount: order.amount * 100,       // ✅ Convert to paise
  currency: 'INR',
  name: 'Shop Name',
  description: 'Order Payment',
  order_id: razorpayOrderId,        // ✅ From createOrder API
  handler: (response) => {          // ✅ Success callback
    console.log(response);
  }
};

// 3. Check Razorpay dashboard
// Ensure API keys are active
// Verify account is not suspended
```

---

## 📱 WhatsApp Issues

### WhatsApp Link Doesn't Open

**Symptoms:**
- Click "Order via WhatsApp"
- Nothing happens or error

**Solution:**
```typescript
// 1. Check phone number format (E.164)
// ✅ CORRECT: '918220762702' (country code + number, no spaces/+)
// ❌ WRONG: '+91 8220762702' or '08220762702'

whatsapp: {
  businessNumber: '918220762702',  // ✅ No + or spaces
}

// 2. Verify WhatsApp URL construction
const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
// Example: https://wa.me/918220762702?text=Hello

// 3. Test URL manually
// Copy the URL from console and open in browser
console.log('WhatsApp URL:', url);
```

### Message Not Formatted Correctly

**Solution:**
```typescript
// Use proper WhatsApp formatting
const message = `
*New Order* 🛒

*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}

*Items:*
${order.items.map(item => 
  `• ${item.productName} x${item.quantity} = ₹${item.subtotal}`
).join('\n')}

*Total:* ₹${order.totalAmount}

_Thank you for your order!_
`.trim();

// *Bold* → Use asterisks
// _Italic_ → Use underscores
// Emojis work directly 🛒
```

---

## 🏗️ Build & Deployment Issues

### Build Fails with TypeScript Errors

**Solution:**
```powershell
# 1. Clear caches
rd /s /q .angular
rd /s /q dist
rd /s /q node_modules

# 2. Reinstall dependencies
npm install

# 3. Update Angular CLI (if needed)
npm install -g @angular/cli@latest

# 4. Build again
npm run build:prod

# 5. If errors persist, check specific error messages
# Common fixes:
# - Update imports
# - Fix type mismatches
# - Ensure all files saved
```

### Firebase Deploy Fails

**Solution:**
```powershell
# 1. Re-authenticate
firebase logout
firebase login

# 2. Select correct project
firebase use --add
# Choose your project from list

# 3. Verify firebase.json exists
# Should have:
{
  "hosting": {
    "public": "dist/whatsapp-ordering-pwa/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# 4. Build first, then deploy
npm run build:prod
firebase deploy

# 5. Check Firebase quotas
# Go to Firebase Console → Usage
# Ensure not exceeded free tier limits
```

### PWA Not Installing on Mobile

**Solution:**
```typescript
// 1. Verify manifest.webmanifest
{
  "name": "WhatsApp Ordering PWA",
  "short_name": "Shop",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    }
    // ... more icons (192x192, 512x512 required)
  ]
}

// 2. Check ngsw-config.json exists

// 3. Ensure HTTPS (required for PWA)
// Use Firebase Hosting or other HTTPS provider

// 4. Run Lighthouse audit
// Chrome DevTools → Lighthouse → PWA
// Fix any issues reported

// 5. Test install prompt
// Should appear after visiting site 2-3 times
// Or manually: Browser menu → Install app
```

---

## 🐛 Development Environment Issues

### Port 4200 Already in Use

**Solution:**
```powershell
# Option 1: Kill process on port 4200
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process -Force

# Option 2: Use different port
ng serve --port 4300

# Option 3: Find and kill all Node processes
Get-Process node | Stop-Process -Force
```

### Hot Reload Not Working

**Solution:**
```powershell
# 1. Restart dev server
# Ctrl+C to stop
ng serve

# 2. Clear Angular cache
rd /s /q .angular

# 3. Check file watching limits (Windows)
# Usually not an issue on Windows

# 4. Try with poll flag
ng serve --poll=2000
```

---

## 📊 Performance Issues

### Slow Loading Times

**Solution:**
```typescript
// 1. Enable production mode
// In environment.prod.ts:
production: true

// 2. Use lazy loading (already implemented)
loadChildren: () => import('./features/...')...

// 3. Optimize images
// Use WebP format
// Compress with tools like TinyPNG

// 4. Enable AOT compilation
ng build --prod --aot

// 5. Check network tab
// Identify slow API calls
// Add loading indicators
```

### Firestore Query Slow

**Solution:**
```typescript
// 1. Create Firestore indexes
// Firebase Console → Firestore → Indexes

// 2. Limit query results
const q = query(
  collection(firestore, 'products'),
  where('shopSlug', '==', slug),
  limit(50)  // ✅ Add limit
);

// 3. Use pagination
// Load products in batches

// 4. Cache frequently accessed data
// Use service with BehaviorSubject
```

---

## 🆘 Getting Help

### Still Having Issues?

1. **Check Console Errors**
   ```
   F12 → Console → Look for red errors
   Copy full error message for searching
   ```

2. **Check Network Tab**
   ```
   F12 → Network → Look for failed requests (red)
   Check response codes (401, 403, 404, 500)
   ```

3. **Enable Debug Mode**
   ```typescript
   // In app.config.ts:
   provideRouter(routes, withDebugTracing())
   ```

4. **Clear Everything and Start Fresh**
   ```powershell
   # Clear caches
   rd /s /q .angular
   rd /s /q dist
   rd /s /q node_modules
   
   # Reinstall
   npm install
   
   # Rebuild
   ng serve
   ```

5. **Check Documentation**
   - [Angular Docs](https://angular.dev)
   - [Firebase Docs](https://firebase.google.com/docs)
   - [Razorpay Docs](https://razorpay.com/docs)

---

## 📝 Reporting Bugs

When reporting issues, include:
- ✅ Full error message from console
- ✅ Browser and version
- ✅ Steps to reproduce
- ✅ Expected vs actual behavior
- ✅ Screenshot or video
- ✅ Environment (dev/prod)

---

**Last Updated:** February 2026
