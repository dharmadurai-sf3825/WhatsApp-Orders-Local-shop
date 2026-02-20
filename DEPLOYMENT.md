# 🚀 Deployment Guide - WhatsApp Ordering PWA

## Prerequisites

Before deploying, ensure you have:
- ✅ Node.js (v18 or higher) installed
- ✅ Firebase account and project created
- ✅ Razorpay account (Production keys)
- ✅ WhatsApp Business number

---

## 📝 Step 1: Configure Production Environment

### 1.1 Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Click on "Project Settings" ⚙️ → "General"
4. Scroll to "Your apps" and copy the configuration

Update `src/environments/environment.prod.ts`:
```typescript
firebase: {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef'
}
```

### 1.2 Razorpay Configuration

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Switch to "Live Mode" (not Test Mode)
3. Go to Settings → API Keys
4. Generate Production API Keys

Update `src/environments/environment.prod.ts`:
```typescript
razorpay: {
  keyId: 'rzp_live_XXXXXXXXXX',
  keySecret: 'YOUR_SECRET_KEY' // Keep this secure!
}
```

⚠️ **IMPORTANT:** Never commit production keys to Git!

### 1.3 WhatsApp Configuration

Update your business WhatsApp number:
```typescript
whatsapp: {
  businessNumber: '919876543210', // Your actual number
  defaultMessage: 'Hello, I want to place an order'
}
```

---

## 🔧 Step 2: Install Dependencies

```powershell
npm install
```

If you haven't installed Firebase CLI:
```powershell
npm install -g firebase-tools
```

---

## 🏗️ Step 3: Build for Production

Build the optimized production bundle:

```powershell
npm run build:prod
```

This will create an optimized build in `dist/whatsapp-ordering-pwa/browser/`

### Verify Build

Check that the following files exist:
- `dist/whatsapp-ordering-pwa/browser/index.html`
- `dist/whatsapp-ordering-pwa/browser/ngsw-worker.js` (Service Worker)
- `dist/whatsapp-ordering-pwa/browser/manifest.webmanifest` (PWA Manifest)

---

## 🔥 Step 4: Deploy to Firebase Hosting

### 4.1 Login to Firebase

```powershell
firebase login
```

### 4.2 Initialize Firebase (if not done)

```powershell
firebase init
```

Select:
- ✅ Hosting
- ✅ Firestore
- Choose your existing project
- Public directory: `dist/whatsapp-ordering-pwa/browser`
- Single-page app: **Yes**
- Set up automatic builds: **No** (for now)

### 4.3 Deploy Firestore Rules

```powershell
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 4.4 Deploy Hosting

```powershell
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

---

## 🌐 Step 5: Custom Domain (Optional)

### 5.1 In Firebase Console

1. Go to Hosting → Add custom domain
2. Enter your domain (e.g., `shop.yourdomain.com`)
3. Follow the verification steps

### 5.2 Update DNS Records

Add the provided DNS records to your domain registrar:
- Type: A
- Host: @ or your subdomain
- Value: (Firebase will provide IPs)

⏱️ DNS propagation may take 24-48 hours

---

## 🔐 Step 6: Enable Firebase Authentication

1. Go to Firebase Console → Authentication
2. Enable sign-in methods:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Phone (for WhatsApp verification)

---

## 💳 Step 7: Configure Razorpay Webhooks

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://YOUR-DOMAIN.com/api/razorpay-webhook`
3. Select events:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid

---

## ✅ Step 8: Post-Deployment Checklist

### Test PWA Installation
- [ ] Visit your site on mobile
- [ ] Check "Install App" prompt appears
- [ ] Install and test offline functionality

### Test Core Features
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] WhatsApp ordering works
- [ ] Razorpay payment works
- [ ] Seller dashboard accessible
- [ ] Order management works

### Performance
- [ ] Run [Lighthouse audit](https://web.dev/measure/)
- [ ] PWA score should be 90+
- [ ] Performance score should be 80+

### Security
- [ ] HTTPS is enabled (automatic with Firebase)
- [ ] Firestore rules are deployed
- [ ] API keys are not exposed in client code
- [ ] CSP headers are configured

---

## 🔄 Continuous Deployment

### Automated Deployments with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build:prod
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## 📱 Alternative Deployment Options

### Option 1: Netlify
```powershell
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist/whatsapp-ordering-pwa/browser
```

### Option 2: Vercel
```powershell
npm install -g vercel
vercel login
vercel --prod
```

### Option 3: AWS Amplify
1. Connect your GitHub repository
2. Set build command: `npm run build:prod`
3. Set output directory: `dist/whatsapp-ordering-pwa/browser`
4. Deploy

---

## 🐛 Troubleshooting

### Build Errors
```powershell
# Clear Angular cache
rd /s /q .angular
npm run build:prod
```

### Service Worker Not Updating
```powershell
# Clear browser cache and service workers
# In browser DevTools: Application → Service Workers → Unregister
```

### Firebase Deploy Fails
```powershell
# Re-authenticate
firebase logout
firebase login
firebase use --add
```

### PWA Not Installing
- Ensure HTTPS is enabled
- Check `manifest.webmanifest` is accessible
- Verify service worker is registered
- Run Lighthouse PWA audit

---

## 📊 Monitoring

### Firebase Analytics
1. Enable Analytics in Firebase Console
2. Monitor user engagement
3. Track conversion rates

### Error Tracking
Consider integrating:
- Sentry: `npm install @sentry/angular`
- LogRocket: `npm install logrocket`

---

## 🔒 Security Best Practices

1. **Never commit sensitive data**
   - Add `.env` files to `.gitignore`
   - Use Firebase Remote Config for secrets

2. **Implement rate limiting**
   - Use Firebase App Check
   - Add reCAPTCHA for forms

3. **Regular updates**
   ```powershell
   npm audit
   npm audit fix
   ```

4. **Backup Firestore data**
   ```powershell
   firebase firestore:backup
   ```

---

## 📞 Support

For issues:
1. Check [Angular Documentation](https://angular.dev)
2. Check [Firebase Documentation](https://firebase.google.com/docs)
3. Check [Razorpay Documentation](https://razorpay.com/docs)

---

## 🎉 Success!

Your WhatsApp Ordering PWA is now live! 🚀

Share your app URL with your customers and start receiving orders!

---

**Last Updated:** February 2026
