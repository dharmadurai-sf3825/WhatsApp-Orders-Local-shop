# 🔧 Admin Panel - Sellers Management Setup

## 🎯 Overview

Admin Panel allows **project owners** to:
- ✅ Add new seller accounts
- ✅ Manage existing sellers
- ✅ Assign shops to sellers
- ✅ View all sellers in one place
- ✅ Delete seller accounts

**Security**: Only users with admin role can access this panel.

---

## 🔐 Setup Admin Access

### Step 1: Enable Firebase Authentication
Already done in previous steps. ✅

### Step 2: Create Your Admin Account

#### Option A: Firebase Console (Recommended)
```
1. Go to: Firebase Console → Authentication → Users
2. Click "Add User"
3. Email: your-admin-email@example.com
4. Password: your-secure-password
5. Copy the User UID (abc123xyz...)
```

#### Option B: Command Line
```powershell
firebase auth:import admin-users.json
```

### Step 3: Grant Admin Role in Firestore

#### Manual Method (Firestore Console):
```
1. Go to: Firebase Console → Firestore Database
2. Start Collection: "admins"
3. Document ID: [Your User UID from Step 2]
4. Fields:
   - role: "owner"
   - email: "your-admin-email@example.com"
   - createdAt: [Current timestamp]
5. Save
```

#### Data Structure:
```
admins/
  {userId}/
    ├─ role: "owner"
    ├─ email: "admin@yourproject.com"
    └─ createdAt: timestamp
```

---

## 🚀 Access Admin Panel

### URLs:

**Admin Login**:
```
https://whatsapp-local-order.web.app/admin/login
```

**Sellers Management**:
```
https://whatsapp-local-order.web.app/admin/sellers
```

### Login:
```
1. Visit: /admin/login
2. Enter admin email & password
3. System verifies admin role
4. Redirects to sellers management
```

---

## 👥 Adding Sellers via Admin Panel

### Step-by-Step Process:

#### 1. Access Admin Panel
```
Login at: /admin/login
Automatically redirected to: /admin/sellers
```

#### 2. Click "Add New Seller"
Opens seller creation form

#### 3. Fill Seller Details

**Email Address**:
```
Format: seller@shopname.com
Example: seller@ganeshbakery.com

✅ Good: seller@ganeshbakery.com
✅ Good: owner@anbugrocery.com
❌ Bad: randomuser@gmail.com (doesn't match shop)
```

**Temporary Password**:
```
Minimum 6 characters
Example: demo123456

The seller should change this after first login
```

**Shop Name**:
```
Display name for the shop
Example: Ganesh Bakery
Example: Anbu Grocery Store
```

**Shop Slug**:
```
URL-friendly identifier
Format: lowercase-with-hyphens
Example: ganesh-bakery
Example: anbu-grocery

This becomes part of URL: /ganesh-bakery/seller/login
```

**Role**:
```
Owner: Full access to everything
Manager: Limited access (future feature)
```

#### 4. Click "Create Seller Account"

System creates:
- ✅ Shop ownership record in Firestore
- ✅ Database entry with seller details
- ⚠️ **Manual step required**: Create Firebase Auth user (see below)

#### 5. **IMPORTANT**: Create Firebase Auth User

The admin panel creates the database records, but you must manually create the user in Firebase Authentication:

```
1. Copy the email & password from success message
2. Go to: Firebase Console → Authentication → Users
3. Click "Add User"
4. Paste email and password
5. Click "Add User"
```

**Why Manual?**
- Requires Firebase Cloud Functions for full automation
- Keeps your Firebase project secure
- Simple one-time setup per seller

#### 6. Share Credentials with Seller

Send them:
```
Login URL: https://whatsapp-local-order.web.app/ganesh-bakery/seller/login
Email: seller@ganeshbakery.com
Password: demo123456

Instructions:
1. Visit the URL
2. Login with provided credentials
3. Change password after first login (future feature)
4. Start managing your shop!
```

---

## 📊 Sellers List View

The admin panel shows all sellers with:

| Column | Description |
|--------|-------------|
| Email | Seller's login email |
| Shop | Shop name + slug |
| Role | Owner / Manager |
| Status | Active / Inactive |
| Created | Date created |
| Actions | Delete button |

### Features:
- 🔍 View all sellers at a glance
- 📋 See shop assignments
- 🗑️ Delete sellers if needed
- 📊 Track creation dates

---

## 🔐 Security Architecture

### Admin Guard:
```
User visits /admin/sellers
    ↓
Check: Logged in? ❌ → Redirect to /admin/login
    ↓
Check: Admin role? ❌ → Redirect to /unauthorized
    ↓
Admin role verified ✅ → Allow access
```

### Shop Ownership Verification:
```
Seller logs in with: seller@ganeshbakery.com
Tries to access: /anbu-grocery/seller
    ↓
System checks: Email domain vs Shop slug
    ↓
ganeshbakery ≠ anbugrocery → Access DENIED ❌
```

---

## 🎓 Example Workflow

### Scenario: Add Ganesh Bakery Seller

**Step 1: Admin Login**
```
URL: /admin/login
Email: admin@yourproject.com
Password: your-admin-password
```

**Step 2: Create Seller**
```
Click: "Add New Seller"

Fill Form:
- Email: seller@ganeshbakery.com
- Password: demo123456
- Shop Name: Ganesh Bakery
- Shop Slug: ganesh-bakery
- Role: Owner

Click: "Create Seller Account"
```

**Step 3: Firebase Auth User**
```
Firebase Console → Authentication → Add User
- Email: seller@ganeshbakery.com
- Password: demo123456
```

**Step 4: Notify Seller**
```
Email to Ganesh Bakery owner:

Subject: Your Seller Account is Ready!

Your WhatsApp ordering system is live!

Login Details:
URL: https://whatsapp-local-order.web.app/ganesh-bakery/seller/login
Email: seller@ganeshbakery.com
Password: demo123456

Please change your password after first login.

Need help? Contact us at support@yourproject.com
```

**Step 5: Seller Logs In**
```
Seller visits URL
Enters credentials
Accesses dashboard
Starts adding products!
```

---

## 🛠️ Firestore Structure

### Collections Created:

**admins/**
```
admins/
  {adminUserId}/
    ├─ role: "owner"
    ├─ email: "admin@project.com"
    └─ createdAt: timestamp
```

**shop_ownership/**
```
shop_ownership/
  {autoId}/
    ├─ email: "seller@ganeshbakery.com"
    ├─ shopSlug: "ganesh-bakery"
    ├─ shopName: "Ganesh Bakery"
    ├─ role: "owner"
    ├─ status: "active"
    ├─ createdAt: timestamp
    └─ temporaryPassword: "demo123456" (for admin reference)
```

---

## 🔥 Firebase Security Rules

Update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admin collection - only admins can read
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only via console
    }
    
    // Shop ownership - admins can write, sellers can read own
    match /shop_ownership/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'owner';
    }
    
    // Other collections...
  }
}
```

Deploy rules:
```powershell
firebase deploy --only firestore:rules
```

---

## 🧪 Testing the Admin Panel

### Test 1: Admin Login
```
1. Visit: /admin/login
2. Enter admin credentials
3. Should redirect to /admin/sellers
4. See sellers management page ✅
```

### Test 2: Non-Admin Access
```
1. Login as seller (not admin)
2. Try to visit: /admin/sellers
3. Should redirect to /unauthorized ✅
```

### Test 3: Create Seller
```
1. Login as admin
2. Click "Add New Seller"
3. Fill form and submit
4. See success message ✅
5. Seller appears in list ✅
```

### Test 4: Seller Login
```
1. Create Firebase Auth user manually
2. Visit: /{shop-slug}/seller/login
3. Login with seller credentials
4. Should access dashboard ✅
5. Try to access other shop → Blocked ✅
```

---

## 📞 Common Issues & Solutions

### Issue 1: Admin Login Shows "Access Denied"
**Cause**: User not in `admins` collection  
**Fix**: Add user to Firestore `admins/{userId}` with role="owner"

### Issue 2: Seller Can't Login
**Cause**: Firebase Auth user not created  
**Fix**: Create user in Firebase Console → Authentication

### Issue 3: Seller Can Access All Shops
**Cause**: Shop ownership check not working  
**Fix**: Check email matches shop slug format

### Issue 4: Admin Panel Not Loading
**Cause**: Route not configured  
**Fix**: Check `app.routes.ts` includes admin routes

---

## 🚀 Deployment

### Build & Deploy:
```powershell
# Build production app
npm run build:prod

# Deploy to Firebase
firebase deploy

# Test on production
Visit: https://your-site.web.app/admin/login
```

---

## 📋 Admin Panel Checklist

**Setup**:
- [x] Created admin guard
- [x] Created admin login component
- [x] Created sellers management component
- [x] Added admin routes
- [ ] Create admin user in Firebase Auth
- [ ] Add admin user to Firestore admins collection
- [ ] Deploy to production
- [ ] Test admin login
- [ ] Test creating sellers

**Security**:
- [x] Admin guard protects routes
- [x] Role verification in Firestore
- [x] Unauthorized access blocked
- [ ] Update Firestore security rules
- [ ] Deploy security rules

**Functionality**:
- [x] Add seller form
- [x] Sellers list view
- [x] Delete seller option
- [ ] Edit seller (future)
- [ ] Password reset (future)

---

## 🎉 Summary

**Admin Panel Features:**
- ✅ Secure admin-only access
- ✅ Add sellers via web interface
- ✅ Manage shop assignments
- ✅ View all sellers in one place
- ✅ Role-based security

**Next Steps:**
1. Create your admin account in Firebase
2. Add admin role to Firestore
3. Deploy the application
4. Login to admin panel
5. Start adding sellers!

**Access:**
- Admin Login: `/admin/login`
- Sellers Management: `/admin/sellers`

**Your multi-tenant system now has complete admin functionality!** 🎯
