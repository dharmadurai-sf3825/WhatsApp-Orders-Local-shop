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

## 🛠️ Quick Start

### 1. Clone and Install

```powershell
git clone https://github.com/yourusername/WhatsApp-Orders-Local-shop.git
cd WhatsApp-Orders-Local-shop
npm install
```

### 2. Configure Firebase

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Hosting
3. Copy your Firebase config to `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    // ... rest of config
  },
  razorpay: { keyId: 'rzp_test_XXXXXXXXXX' },
  whatsapp: { businessNumber: '918220762702' }
};
```

### 3. Run Development Server

```powershell
npm start
```

Navigate to `http://localhost:4200/seller/login`

### 4. Build & Deploy

```powershell
npm run build:prod
firebase deploy
```

📚 **For detailed setup instructions, see [SETUP-GUIDE.md](./SETUP-GUIDE.md)**  
🚀 **For deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📁 Project Structure

```
src/app/
├── core/
│   ├── models/              # Data models (Product, Order, Shop, etc.)
│   └── services/            # Core services (Auth, Firebase, Cart, etc.)
├── features/
│   ├── customer/            # Customer storefront (Home, Products, Cart)
│   ├── seller/              # Seller dashboard (Products, Orders mgmt)
│   └── admin/               # Admin panel (Seller management)
├── environments/            # Environment configurations
└── assets/                  # Icons, images, i18n translations
```

## 🗺️ URL Structure

```
Customer:  /:shopSlug/home              → Browse shop products
Seller:    /seller/login                → Seller login
           /seller/:shopSlug/dashboard  → Manage products & orders
Admin:     /admin/login                 → Admin panel
```

📚 **For complete architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

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

## � Documentation

| Document | Description |
|----------|-------------|
| [SETUP-GUIDE.md](./SETUP-GUIDE.md) | Complete development setup instructions |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture & routing details |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions |

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Firebase for backend infrastructure
- Razorpay for payment processing
- Angular Material for UI components

---

**Made with ❤️ for local businesses in India** 🇮🇳