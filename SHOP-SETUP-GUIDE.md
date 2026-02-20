# 🏪 Multi-Shop Setup Guide

## 📋 Overview

This guide explains how to set up the WhatsApp Ordering System for multiple shops. Each shop gets:
- ✅ Their own Firebase project
- ✅ Their own web URL
- ✅ Their own WhatsApp number
- ✅ Their own product catalog
- ✅ Complete data isolation

---

## 🎯 Setup Process for Each New Shop

### **For Every New Client, Follow These Steps:**

---

## 📝 **Step 1: Gather Shop Information**

**Create a checklist for each shop:**

```
Shop Details Checklist:
━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Shop Name: _______________________
□ Owner Name: _______________________
□ WhatsApp Business Number: +91 __________
□ Email: _______________________
□ Address: _______________________
□ GST Number (if any): _______________________
□ Business Logo: (collect image file)
□ Preferred Colors: Primary: ______ Secondary: ______
□ UPI ID for payments: _______________________
```

---

## 🔥 **Step 2: Create New Firebase Project**

For each shop, create a separate Firebase project:

### **A. Go to Firebase Console:**
```
https://console.firebase.google.com/
```

### **B. Create New Project:**
1. Click "+ Add project"
2. **Project name:** Use format: `{shopname}-orders`
   - Example: `ganesh-bakery-orders`
   - Example: `anbu-grocery-orders`
3. Click "Continue"
4. Disable Google Analytics (or enable, your choice)
5. Click "Create project"
6. Wait 30 seconds
7. Click "Continue"

### **C. Register Web App:**
1. Click Web icon `</>`
2. **App nickname:** `{Shop Name} PWA`
3. ✅ Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **COPY THE CONFIG** (you'll need this next!)

```javascript
// Save this config for the shop:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "ganesh-bakery-orders.firebaseapp.com",
  projectId: "ganesh-bakery-orders",
  storageBucket: "ganesh-bakery-orders.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### **D. Enable Services:**

**Enable Authentication:**
1. Build → Authentication → Get started
2. Email/Password → Enable → Save

**Enable Firestore:**
1. Build → Firestore Database → Create database
2. Start in test mode → Next
3. Location: asia-south1 → Enable

**Enable Storage:**
1. Build → Storage → Get started
2. Start in test mode → Next → Done

---

## 📂 **Step 3: Clone and Configure Code**

### **Option A: Create Separate Folder per Shop**

```powershell
# For each shop, create a new folder:

# Shop 1 - Ganesh Bakery
cd D:\My\Projects
xcopy /E /I "WhatsApp-Orders-Local-shop" "ganesh-bakery-orders"
cd ganesh-bakery-orders

# Shop 2 - Anbu Grocery  
cd D:\My\Projects
xcopy /E /I "WhatsApp-Orders-Local-shop" "anbu-grocery-orders"
cd anbu-grocery-orders
```

### **Option B: Use Git Branches (Better)**

```powershell
# Create a branch for each shop:
git checkout -b shop/ganesh-bakery
# Configure and deploy for this shop

git checkout main
git checkout -b shop/anbu-grocery
# Configure and deploy for this shop
```

---

## ⚙️ **Step 4: Update Configuration Files**

### **A. Update `environment.prod.ts`:**

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIza...', // From Firebase Console (Step 2C)
    authDomain: 'ganesh-bakery-orders.firebaseapp.com',
    projectId: 'ganesh-bakery-orders',
    storageBucket: 'ganesh-bakery-orders.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123'
  },
  razorpay: {
    keyId: 'rzp_live_XXXXX', // Shop owner's Razorpay key
    keySecret: 'YOUR_SECRET'
  },
  whatsapp: {
    businessNumber: '919876543210', // Shop's WhatsApp number
    defaultMessage: 'Hello, I want to place an order from Ganesh Bakery'
  }
};
```

### **B. Update `firebase.json` (if needed):**

Usually no changes needed, but verify paths are correct.

### **C. Update Shop Branding (Future):**

In `firebase.service.ts`, update mock shop data:

```typescript
private getMockShop(): Shop {
  return {
    id: 'shop-ganesh-bakery',
    name: 'Ganesh Bakery', // Shop name
    phoneE164: '919876543210', // Shop WhatsApp
    address: 'Shop address',
    gstNo: 'GST123...',
    upiId: 'ganeshbakery@paytm',
    theme: {
      primaryColor: '#FF6B6B', // Shop's color
      logoUrl: '' // Shop's logo URL
    },
    isActive: true
  };
}
```

---

## 🏗️ **Step 5: Build and Deploy**

For each shop:

```powershell
# 1. Install dependencies (first time only)
npm install

# 2. Build production version
cmd /c "npm run build:prod"

# 3. Login to Firebase (first time only)
cmd /c "firebase login"

# 4. Set the Firebase project for this shop
cmd /c "firebase use ganesh-bakery-orders"

# 5. Initialize Firebase (first time only)
cmd /c "firebase init"
# Select: Firestore + Hosting
# Use existing project: ganesh-bakery-orders
# Public directory: dist/whatsapp-ordering-pwa/browser
# Single-page app: Yes

# 6. Deploy Firestore rules
cmd /c "firebase deploy --only firestore"

# 7. Deploy the app
cmd /c "firebase deploy --only hosting"
```

**Result:**
```
✔ Deploy complete!
Hosting URL: https://ganesh-bakery-orders.web.app
```

---

## 📊 **Shop Tracking Spreadsheet**

**Create a spreadsheet to track all shops:**

| Shop Name | Project ID | URL | WhatsApp | Status | Deployed Date | Notes |
|-----------|-----------|-----|----------|--------|---------------|-------|
| Ganesh Bakery | ganesh-bakery-orders | ganesh-bakery-orders.web.app | 919876543210 | ✅ Live | 20-Feb-2026 | - |
| Anbu Grocery | anbu-grocery-orders | anbu-grocery-orders.web.app | 919887654321 | ✅ Live | 21-Feb-2026 | - |
| Kumar Restaurant | kumar-restaurant-orders | kumar-restaurant-orders.web.app | 919898765432 | 🔄 Setup | - | In progress |

---

## 🔐 **Security: Environment Files**

**IMPORTANT:** Never commit shop-specific configs to Git!

For each shop, keep their `environment.prod.ts` file **locally only**.

**Better approach:** Store configs securely:

1. Create `shop-configs` folder (add to .gitignore)
2. Save each shop's config there:
   ```
   shop-configs/
   ├── ganesh-bakery.env.ts
   ├── anbu-grocery.env.ts
   └── kumar-restaurant.env.ts
   ```

---

## ⚡ **Quick Deployment Script**

Create `deploy-shop.ps1`:

```powershell
# Deploy script for a specific shop
param(
    [Parameter(Mandatory=$true)]
    [string]$ShopProjectId,
    
    [Parameter(Mandatory=$true)]
    [string]$ShopName
)

Write-Host "🚀 Deploying $ShopName..." -ForegroundColor Cyan

# Build
Write-Host "Building..." -ForegroundColor Yellow
cmd /c "npm run build:prod"

# Set project
Write-Host "Setting Firebase project..." -ForegroundColor Yellow
cmd /c "firebase use $ShopProjectId"

# Deploy
Write-Host "Deploying..." -ForegroundColor Yellow
cmd /c "firebase deploy"

Write-Host "✅ $ShopName deployed successfully!" -ForegroundColor Green
Write-Host "URL: https://$ShopProjectId.web.app" -ForegroundColor Cyan
```

**Usage:**
```powershell
.\deploy-shop.ps1 -ShopProjectId "ganesh-bakery-orders" -ShopName "Ganesh Bakery"
```

---

## 📋 **Onboarding Checklist (Per Shop)**

**Use this checklist for each new client:**

### **Pre-Setup (Day 1):**
- [ ] Collect shop information
- [ ] Get shop logo and branding
- [ ] Get WhatsApp business number
- [ ] Get Razorpay keys (or set up for them)
- [ ] Collect initial product list (Excel/Photos)

### **Setup (Day 2-3):**
- [ ] Create Firebase project
- [ ] Enable Firebase services
- [ ] Configure environment files
- [ ] Update branding/colors
- [ ] Add products to system
- [ ] Build and deploy

### **Testing (Day 4):**
- [ ] Test product browsing
- [ ] Test WhatsApp integration
- [ ] Test payment (if enabled)
- [ ] Test on shop owner's phone
- [ ] Fix any issues

### **Training (Day 5):**
- [ ] Train shop owner on dashboard
- [ ] Show how to add/edit products
- [ ] Explain order management
- [ ] Provide support contact
- [ ] Get feedback

### **Go Live (Day 6-7):**
- [ ] Share URL with shop owner
- [ ] Help create QR code
- [ ] Share on shop's social media
- [ ] Monitor first orders
- [ ] Collect testimonial

---

## 💰 **Cost Management**

**Firebase Free Tier (per project):**
- ✅ 10GB storage
- ✅ 360MB/day database reads
- ✅ 10GB/month bandwidth
- ✅ 50,000 reads/day

**With 10 shops:**
- Each shop = 1 Firebase project
- All on free tier = ₹0 cost
- Total capacity: 100GB bandwidth/month

**When you exceed free tier:**
- Firebase Blaze plan (pay as you go)
- Typical cost: ₹100-500/month per shop
- Still profitable at ₹999/month pricing

---

## 🎯 **Scaling Strategy**

### **Phase 1: 1-10 Shops**
- Use separate Firebase projects
- Manual setup for each
- Easy to manage

### **Phase 2: 10-50 Shops**
- Consider automation scripts
- Standardize deployment
- Create shop dashboard

### **Phase 3: 50+ Shops**
- Migrate to multi-tenant architecture
- Single database, multiple shops
- Automated onboarding
- Central management dashboard

---

## 🆘 **Troubleshooting**

### **Issue: Wrong WhatsApp number showing**
**Solution:** Check `environment.prod.ts` has correct number

### **Issue: Products from another shop showing**
**Solution:** Each shop needs separate Firebase project

### **Issue: Payment going to wrong account**
**Solution:** Check Razorpay keyId in environment.prod.ts

---

## ✅ **Success Criteria**

For each shop deployment, verify:

- [ ] Correct shop name displays
- [ ] Correct WhatsApp number configured
- [ ] Shop-specific products show
- [ ] Orders go to correct WhatsApp
- [ ] Payments go to shop's account
- [ ] Branding matches shop
- [ ] URL is accessible
- [ ] PWA is installable
- [ ] Works on mobile

---

## 📞 **Support Process**

**For ongoing support:**

1. Create WhatsApp group with shop owner
2. Respond to queries within 24 hours
3. Monthly check-in call
4. Collect feedback for improvements

---

**Next Steps:** Follow Step 1 for your first client shop! 🚀
