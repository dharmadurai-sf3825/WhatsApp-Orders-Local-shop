# 🛒 WhatsApp Ordering PWA for Local Shops

A modern Progressive Web App (PWA) that enables local shops to receive orders via WhatsApp with integrated payment processing.

## ✨ Features

### For Customers
- 📱 **PWA Support** - Install on mobile devices like a native app
- 🛍️ **Product Browsing** - Browse products by category
- 🛒 **Shopping Cart** - Add/remove items, manage quantities
- 💬 **WhatsApp Ordering** - Send orders directly via WhatsApp
- 💳 **Razorpay Integration** - Secure online payments
- 🌐 **Multilingual** - Tamil & English support
- 📴 **Offline Support** - Browse previously loaded products offline

### For Sellers
- 📊 **Dashboard** - Overview of orders and sales
- 📦 **Product Management** - Add, edit, delete products
- 🔔 **Order Management** - Track and update order status
- 📈 **Analytics** - Sales reports and insights

## 🚀 Technology Stack

- **Frontend:** Angular 17+ with Angular Material
- **PWA:** Service Worker & Web App Manifest
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Payments:** Razorpay
- **Messaging:** WhatsApp Business API (Click-to-Chat)
- **Styling:** SCSS + Angular Material

## 📋 Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Firebase account
- Razorpay account
- WhatsApp Business number

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/WhatsApp-Orders-Local-shop.git
cd WhatsApp-Orders-Local-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Update `src/environments/environment.ts` with your credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  razorpay: {
    keyId: 'YOUR_RAZORPAY_KEY_ID',
    keySecret: 'YOUR_RAZORPAY_KEY_SECRET'
  },
  whatsapp: {
    businessNumber: '918220762702',
    defaultMessage: 'Hello, I want to place an order'
  }
};
```

### 4. Run development server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### 5. Build for production

```bash
npm run build:prod
```

## 📦 Deployment

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy to Firebase:**
```bash
npm run build:prod
firebase login
firebase init
firebase deploy
```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Data models
│   │   └── services/        # Core services
│   ├── features/
│   │   ├── customer/        # Customer-facing features
│   │   └── seller/          # Seller dashboard
│   └── shared/              # Shared components
├── environments/            # Environment configurations
└── assets/                  # Static assets
```

## 🔒 Security

- Firebase Authentication for user management
- Firestore Security Rules for data protection
- HTTPS-only in production
- Razorpay secure payment gateway
- Environment-based configuration

## 🌍 Internationalization

Supports Tamil (ta) and English (en) languages. Language can be switched from the app settings.

## 📱 PWA Features

- ✅ Installable on mobile & desktop
- ✅ Offline browsing capability
- ✅ Push notifications (optional)
- ✅ App-like experience
- ✅ Fast loading with caching

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Lint code
npm run lint
```

## 📈 Performance

- Lighthouse PWA score: 90+
- Performance score: 80+
- Accessibility score: 90+
- Best practices: 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, email your-email@example.com or join our Slack channel.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Firebase for backend infrastructure
- Razorpay for payment processing
- Angular Material for UI components

---

**Made with ❤️ for local businesses**