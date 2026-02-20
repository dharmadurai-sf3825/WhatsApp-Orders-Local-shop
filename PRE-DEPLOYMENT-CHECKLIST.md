# ✅ Pre-Deployment Checklist

Complete this checklist before deploying your WhatsApp Ordering PWA to production.

---

## 📋 Configuration

### Environment Files
- [ ] `src/environments/environment.prod.ts` created with production values
- [ ] Firebase configuration updated with production project
- [ ] Razorpay production keys configured (not test keys)
- [ ] WhatsApp business number configured correctly
- [ ] Environment files added to `.gitignore`

### Firebase Setup
- [ ] Firebase project created for production
- [ ] Firebase Authentication enabled
  - [ ] Email/Password provider enabled
  - [ ] Google Sign-In enabled (optional)
  - [ ] Phone authentication enabled (optional)
- [ ] Firestore database created
- [ ] Firestore security rules deployed
- [ ] Firestore indexes created
- [ ] Firebase Hosting enabled
- [ ] Firebase Storage enabled (if using images)

### Razorpay Setup
- [ ] Razorpay account verified and activated
- [ ] Production API keys generated
- [ ] Webhook URL configured
- [ ] Payment methods enabled (UPI, Cards, NetBanking, Wallets)
- [ ] Test payment completed successfully

### WhatsApp
- [ ] WhatsApp Business account created
- [ ] Business number verified
- [ ] Business profile completed
- [ ] Quick replies set up
- [ ] Auto-reply messages configured

---

## 🛠️ Technical Checks

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] `npm run lint` passes without errors
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all API calls
- [ ] Loading states implemented for async operations

### Testing
- [ ] All features tested on localhost
- [ ] Product browsing works
- [ ] Shopping cart functions correctly
- [ ] WhatsApp message generation works
- [ ] Razorpay payment flow tested (test mode)
- [ ] Seller dashboard accessible and functional
- [ ] Order management works
- [ ] Language switching works (Tamil/English)

### Build
- [ ] `npm run build:prod` completes successfully
- [ ] No build warnings or errors
- [ ] Bundle size within acceptable limits
- [ ] Source maps disabled in production build

### PWA Requirements
- [ ] `manifest.webmanifest` configured correctly
  - [ ] App name, short_name set
  - [ ] Icons provided (192x192, 512x512)
  - [ ] Theme color and background color set
  - [ ] Start URL configured
  - [ ] Display mode set to "standalone"
- [ ] Service worker configuration (`ngsw-config.json`) reviewed
- [ ] Offline fallback page created
- [ ] Icons in all required sizes created

---

## 🔒 Security

### Authentication & Authorization
- [ ] Firebase authentication rules configured
- [ ] Firestore security rules prevent unauthorized access
- [ ] User roles implemented (customer, seller, admin)
- [ ] Password reset functionality tested

### Data Security
- [ ] Sensitive data not stored in client-side code
- [ ] API keys not exposed in public repositories
- [ ] CORS configured correctly
- [ ] Input validation implemented on all forms
- [ ] XSS protection implemented

### Payment Security
- [ ] Razorpay integration follows PCI DSS guidelines
- [ ] No credit card data stored locally
- [ ] Payment webhook signature verification implemented
- [ ] Failed payment handling implemented

---

## 📱 Mobile & PWA Testing

### Installation
- [ ] PWA installable on Android Chrome
- [ ] PWA installable on iOS Safari
- [ ] Install prompt appears correctly
- [ ] App icon displays correctly after installation
- [ ] Splash screen displays correctly

### Functionality
- [ ] All features work when installed as PWA
- [ ] Offline mode works (cached content accessible)
- [ ] App updates automatically when new version deployed
- [ ] Service worker updates correctly

### Responsiveness
- [ ] Tested on mobile devices (320px width minimum)
- [ ] Tested on tablets (768px - 1024px)
- [ ] Tested on desktop (1280px+)
- [ ] All UI elements accessible and usable
- [ ] Touch targets minimum 44x44px

---

## 🌐 SEO & Meta Tags

- [ ] `<title>` tag set appropriately
- [ ] Meta description added
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags added
- [ ] Canonical URL set
- [ ] robots.txt configured
- [ ] sitemap.xml generated (if applicable)

---

## ⚡ Performance

### Optimization
- [ ] Images optimized (WebP format preferred)
- [ ] Lazy loading implemented for images
- [ ] Tree shaking enabled (automatic with production build)
- [ ] AOT compilation enabled (automatic with production build)
- [ ] Code splitting implemented

### Testing
- [ ] Lighthouse audit run with good scores:
  - [ ] Performance: 80+ 
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
  - [ ] PWA: 90+
- [ ] Tested on 3G network (acceptable load time)
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s

---

## 📊 Analytics & Monitoring

- [ ] Firebase Analytics enabled
- [ ] Google Analytics configured (optional)
- [ ] Error tracking setup (Sentry, LogRocket, etc.)
- [ ] Performance monitoring enabled
- [ ] Custom events tracked:
  - [ ] Product views
  - [ ] Add to cart
  - [ ] Order initiated via WhatsApp
  - [ ] Payment successful
  - [ ] Payment failed

---

## 📄 Documentation

- [ ] README.md updated with project info
- [ ] DEPLOYMENT.md reviewed
- [ ] API documentation created (if applicable)
- [ ] User guide created for sellers
- [ ] Troubleshooting guide created

---

## 🚀 Deployment Preparation

### DNS & Domain
- [ ] Domain purchased (if using custom domain)
- [ ] DNS records prepared for updating
- [ ] SSL certificate planning (automatic with Firebase Hosting)

### Backup
- [ ] Current development data backed up
- [ ] Git repository pushed to remote
- [ ] Database backup taken
- [ ] Environment configs saved securely

### Communication
- [ ] Maintenance page ready (if migrating from old system)
- [ ] Customer notification prepared
- [ ] Support team briefed
- [ ] Contact information updated

---

## 🧪 Final Pre-Deployment Tests

### Smoke Tests (Production Build)
- [ ] Build production version locally
- [ ] Serve production build: `npx http-server dist/whatsapp-ordering-pwa/browser -p 8080`
- [ ] Test all critical user flows
- [ ] Verify no development-only code executing
- [ ] Check browser console for errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

### Load Testing
- [ ] Simulate multiple concurrent users
- [ ] Test database read/write performance
- [ ] Verify no memory leaks
- [ ] Check error rates under load

---

## 📝 Deployment Day

- [ ] Deploy during low-traffic hours
- [ ] Monitor error logs immediately after deployment
- [ ] Test all critical features on production
- [ ] Verify analytics tracking works
- [ ] Test payment flow with small transaction
- [ ] Announce launch to customers
- [ ] Monitor for the first 24 hours

---

## 🆘 Rollback Plan

- [ ] Previous version deployment script ready
- [ ] Database rollback procedure documented
- [ ] Know how to quickly revert DNS changes
- [ ] Emergency contact list prepared

---

## ✅ Post-Deployment

- [ ] Monitor Firebase usage and quotas
- [ ] Set up billing alerts
- [ ] Schedule regular backups
- [ ] Plan for scaling (if needed)
- [ ] Collect user feedback
- [ ] Plan next iteration features

---

**Checklist Completed on:** _________________

**Deployed by:** _________________

**Production URL:** _________________

**Notes:**
_________________
_________________
_________________

---

🎉 **Ready to Deploy!** See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
