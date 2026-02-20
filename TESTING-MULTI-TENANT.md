# Testing Multi-Tenant Setup - Quick Reference

## 🚀 Quick Start

### 1. Start Development Server
```bash
cd d:\My\WhatsApp-Orders-Local-shop
ng serve
```
Wait for: `✔ Browser application bundle generation complete.`

### 2. Open Test URLs

Copy and paste these URLs into your browser:

#### Demo Shop (Original)
```
http://localhost:4200/?shop=demo-shop
```
- **Shop Name**: Demo Shop
- **WhatsApp**: +91 82207 62702
- **Theme**: Red
- **Type**: General store

#### Ganesh Bakery
```
http://localhost:4200/?shop=ganesh-bakery
```
- **Shop Name**: Ganesh Bakery
- **WhatsApp**: +91 82207 62702
- **Theme**: Red & Teal
- **Type**: Bakery items (cakes, breads, snacks)

#### Anbu Grocery
```
http://localhost:4200/?shop=anbu-grocery
```
- **Shop Name**: Anbu Grocery Store
- **WhatsApp**: +91 98765 43210
- **Theme**: Green
- **Type**: Groceries, vegetables, dairy

#### Kumar Restaurant
```
http://localhost:4200/?shop=kumar-restaurant
```
- **Shop Name**: Kumar South Indian Restaurant
- **WhatsApp**: +91 98876 54321
- **Theme**: Orange
- **Type**: South Indian food (dosa, idli, meals)

## ✅ Verification Checklist

For EACH shop URL, verify:

### Visual Checks
- [ ] Shop name appears in top toolbar
- [ ] Products load without errors
- [ ] Cart icon visible and functional
- [ ] Language switch (TA/EN) works
- [ ] Images display or show placeholder

### Console Checks (F12 → Console)
Expected logs:
```
ShopService: Initializing shop...
ShopService: Slug detected: ganesh-bakery
ShopService: Shop loaded: Ganesh Bakery
```

No errors should appear!

### Shopping Flow Test
1. [ ] Click on "Products" or category
2. [ ] Add item to cart
3. [ ] Click cart icon (should show badge count)
4. [ ] Fill customer details:
   - Name: Test Customer
   - Phone: 9876543210
   - Address: Test Address
5. [ ] Click "Order on WhatsApp" button
6. [ ] Verify WhatsApp link includes shop name

### WhatsApp Link Verification
When you click "Order on WhatsApp", the link should be:
```
https://wa.me/{shop-phone}?text=Hello!%20I%20want%20to%20order%20from%20{shop-name}...
```

Example for Ganesh Bakery:
```
https://wa.me/918220762702?text=Hello!%20I%20want%20to%20order%20from%20Ganesh%20Bakery...
```

## 🎨 Theme Verification

Open browser DevTools (F12) → Elements tab → Check CSS variables:

### Demo Shop (Red)
```css
--whatsapp-green: #25d366
--whatsapp-teal: #075e54
--primary-color: #d32f2f
```

### Ganesh Bakery (Red/Teal)
```css
--primary-color: #d32f2f
--accent-color: #00897b
```

### Anbu Grocery (Green)
```css
--primary-color: #4caf50
--accent-color: #81c784
```

### Kumar Restaurant (Orange)
```css
--primary-color: #ff9800
--accent-color: #ffa726
```

## 🧪 Edge Cases to Test

### Invalid Shop Slug
```
http://localhost:4200/?shop=nonexistent-shop
```
**Expected**: Console error + redirect/error page (pending implementation)

### Missing Shop Parameter
```
http://localhost:4200/
```
**Expected**: Console error + shop selection page (pending implementation)

### Special Characters in Slug
```
http://localhost:4200/?shop=test-shop-123
```
**Expected**: Should handle gracefully (error or fallback)

## 📊 Browser Console Commands

Open Console (F12) and run these to inspect current state:

### Check Current Shop
```javascript
// Get current shop from service
// (Note: requires access to Angular component)
console.log('Current URL:', window.location.href);
console.log('Shop Slug:', new URLSearchParams(window.location.search).get('shop'));
```

### Check Local Storage
```javascript
console.log('Cart:', localStorage.getItem('shopping_cart'));
console.log('Customer Info:', localStorage.getItem('customer_info'));
console.log('Language:', localStorage.getItem('language'));
```

### Clear Cart (for testing)
```javascript
localStorage.removeItem('shopping_cart');
location.reload();
```

## 🔄 Test Switching Shops

1. Open first shop: `http://localhost:4200/?shop=ganesh-bakery`
2. Add items to cart
3. Note cart count
4. Switch to different shop: `http://localhost:4200/?shop=anbu-grocery`
5. Verify:
   - [ ] Shop name changed in toolbar
   - [ ] Cart persists (localStorage-based, not shop-specific yet)
   - [ ] Products change (when shopId filtering added)

## 📱 Mobile Testing

### Chrome DevTools Device Emulation
1. Press F12
2. Click device toggle icon (Ctrl+Shift+M)
3. Select device (iPhone 12, Galaxy S20, etc.)
4. Test all 4 shops on mobile view

### Verify Mobile Features
- [ ] Responsive layout
- [ ] Touch-friendly buttons
- [ ] Cart FAB (floating action button) visible
- [ ] Forms easy to fill
- [ ] WhatsApp link works on mobile

## 🐛 Common Issues & Solutions

### Shop name not showing in toolbar
**Cause**: ShopService not initializing
**Solution**: Check browser console for errors, verify shop slug in URL

### Products not loading
**Cause**: Products don't have shopId field yet
**Solution**: This is expected - products need shopId in mock data

### WhatsApp link goes to wrong number
**Cause**: Shop object not passed correctly
**Solution**: Check CartComponent passes shop to WhatsAppService

### Theme not changing
**Cause**: Theme application might fail silently
**Solution**: Check shop has theme object, inspect CSS variables

### Console error: "No shop identifier found"
**Cause**: Missing or invalid shop parameter
**Solution**: Verify URL has `?shop=valid-slug`

## 🔍 Debugging Tips

### Enable Verbose Logging
Add this to `shop.service.ts` temporarily:
```typescript
console.log('ShopService Debug:', {
  shopSlug,
  shop: this.currentShop$.value,
  url: window.location.href
});
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for Firebase API calls
4. Verify shop slug in request params

### Inspect Component State
1. Install Angular DevTools extension
2. Open Components tab
3. Select HomeComponent or ProductsComponent
4. Check `currentShop` property value

## 📋 Test Completion Report

After testing all shops, fill this checklist:

### Demo Shop
- [ ] Shop name displays correctly
- [ ] Products load
- [ ] Cart works
- [ ] WhatsApp link correct (918220762702)
- [ ] Theme: Red

### Ganesh Bakery
- [ ] Shop name displays correctly
- [ ] Products load
- [ ] Cart works
- [ ] WhatsApp link correct (918220762702)
- [ ] Theme: Red/Teal

### Anbu Grocery
- [ ] Shop name displays correctly
- [ ] Products load
- [ ] Cart works
- [ ] WhatsApp link correct (919876543210)
- [ ] Theme: Green

### Kumar Restaurant
- [ ] Shop name displays correctly
- [ ] Products load
- [ ] Cart works
- [ ] WhatsApp link correct (919887654321)
- [ ] Theme: Orange

### Overall
- [ ] No console errors
- [ ] All links work
- [ ] Mobile responsive
- [ ] Language switch works
- [ ] Cart persists across pages
- [ ] Order flow completes

## 🎯 Success Criteria

✅ All 4 shops load without errors
✅ Shop names appear correctly in toolbar
✅ WhatsApp links use correct phone numbers
✅ No TypeScript/compilation errors
✅ Console shows successful shop initialization
✅ Cart and checkout work for all shops

## 📞 Contact & Support

If you encounter issues:
1. Check browser console for errors
2. Review `MULTI-TENANT-GUIDE.md` for detailed info
3. Verify code changes in `IMPLEMENTATION-STATUS.md`
4. Check if issue is in pending tasks

## 🚢 Ready for Production?

Before deploying, ensure:
- [ ] All tests pass
- [ ] Build succeeds: `npm run build`
- [ ] No console warnings
- [ ] Products have shopId field
- [ ] Firestore rules updated
- [ ] Mock data migrated to Firebase

---

**Testing Time**: ~15-20 minutes
**Prerequisites**: Development server running
**Next Step**: After successful testing → Deploy to Firebase
