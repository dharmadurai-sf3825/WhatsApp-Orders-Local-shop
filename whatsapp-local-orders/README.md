# WhatsApp Ordering PWA for Local Shops

A Progressive Web Application (PWA) for local shops (kirana, bakeries, pharmacies, boutiques) that enables customers to browse products and place orders via WhatsApp, with integrated Razorpay payment links.

## 🎯 Features

### Customer Features
- 📱 **Installable PWA** - Add to home screen like a native app
- 🌐 **Bilingual Support** - Tamil & English (Tamil-first)
- 🛍️ **Product Catalog** - Browse products by category
- 🛒 **Shopping Cart** - Add items, adjust quantities
- 💬 **WhatsApp Ordering** - Pre-filled order message via WhatsApp Click-to-Chat
- 🔒 **Offline Support** - Basic functionality works offline

### Seller Features
- 📊 **Dashboard** - Overview of orders and sales
- 📦 **Product Management** - Add, edit, delete products with Tamil translations
- 📋 **Order Management** - Track orders from new → delivered
- 💳 **Payment Links** - Generate Razorpay payment links
- 🧾 **Invoice Generation** - Download order invoices (coming soon)
- 📈 **Reports** - Sales and revenue analytics (coming soon)

## 🛠️ Tech Stack

- **Frontend**: Angular 17+ (Standalone Components)
- **UI Framework**: Angular Material
- **Backend**: Firebase (Firestore, Cloud Functions)
- **Payment**: Razorpay Payment Links API
- **PWA**: Service Worker, Web App Manifest
- **Messaging**: WhatsApp Click-to-Chat (wa.me API)
- **Language**: TypeScript (Strict Mode)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- Firebase account
- Razorpay account

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
# Navigate to project directory
cd d:\\p

# Install dependencies
npm install
\`\`\`

### 2. Configure Environment

Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your credentials:

\`\`\`typescript
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
    keySecret: 'YOUR_RAZORPAY_KEY_SECRET' // Store in backend only!
  },
  whatsapp: {
    businessNumber: '919876543210', // E.164 format without +
    defaultMessage: 'Hello, I want to place an order'
  }
};
\`\`\`

**⚠️ Security Warning**: Never expose `razorpay.keySecret` in frontend code. Move payment link creation to Firebase Cloud Functions.

### 3. Firebase Setup

#### Install Firebase Tools
\`\`\`bash
npm install -g firebase-tools
firebase login
\`\`\`

#### Initialize Firebase
\`\`\`bash
firebase init
\`\`\`

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

#### Create Firestore Collections

Create these collections in Firebase Console:

**shops**
\`\`\`json
{
  "id": "shop-1",
  "name": "Sri Ganesh Bakery",
  "phoneE164": "919876543210",
  "address": "Main Street, Kurinjipadi, TN",
  "gstNo": "33AAAAA0000A1Z5",
  "upiId": "shop@paytm",
  "isActive": true
}
\`\`\`

**products** - Will be managed via seller dashboard

**orders** - Created when orders are placed

**payments** - Created when payment links are generated

### 4. Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard → Settings → API Keys
3. Enable Payment Links in Dashboard → Payment Links
4. Configure webhooks for payment status updates

### 5. Run Development Server

\`\`\`bash
npm start
# or
ng serve
\`\`\`

Navigate to `http://localhost:4200/`

### 6. Build for Production

\`\`\`bash
npm run build:prod
# or
ng build --configuration production
\`\`\`

The build artifacts will be stored in the `dist/` directory.

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit your deployed site
2. Look for the install icon in the address bar
3. Click "Install"

### Mobile (Android)
1. Visit your site in Chrome
2. Tap the menu (3 dots)
3. Select "Add to Home Screen"

### Mobile (iOS)
1. Visit your site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🔧 Configuration

### WhatsApp Click-to-Chat

The app uses WhatsApp's official Click-to-Chat feature:

**Format**: `https://wa.me/<number>?text=<message>`

**Requirements**:
- Phone number in E.164 format (no +, spaces, or dashes)
- Example: `919876543210` for +91 98765 43210
- Message is URL-encoded automatically

**Pre-filled Message Structure**:
\`\`\`
வணக்கம்! நான் ஆர்டர் செய்ய விரும்புகிறேன்:

*பொருட்கள்:*
1. 2 துண்டு - வெஜ் பஃப் - ₹30
2. 1 கப் - மசாலா டீ - ₹10

*மொத்தம்:* ₹40

*விவரங்கள்:*
பெயர்: [Customer Name]
தொலைபேசி: [Phone]
முகவரி: [Address]
\`\`\`

### Razorpay Payment Links

#### Backend Implementation (Firebase Cloud Function)

Create `functions/src/index.ts`:

\`\`\`typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret
});

export const createPaymentLink = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { orderId, amount, customerName, customerPhone } = data;

  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      description: \`Order #\${orderId}\`,
      customer: {
        name: customerName,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: false,
        whatsapp: true
      },
      reminder_enable: true,
      callback_url: \`https://yourdomain.com/payment-callback\`
    });

    await admin.firestore().collection('payments').doc(paymentLink.id).set({
      orderId,
      linkId: paymentLink.id,
      amount,
      status: 'created',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return paymentLink;
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to create payment link');
  }
});

// Webhook handler
export const razorpayWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  // Verify signature
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', functions.config().razorpay.webhook_secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    res.status(400).send('Invalid signature');
    return;
  }

  const event = req.body.event;
  const paymentLink = req.body.payload.payment_link.entity;

  if (event === 'payment_link.paid') {
    // Update order status
    const paymentsSnapshot = await admin.firestore()
      .collection('payments')
      .where('linkId', '==', paymentLink.id)
      .get();

    if (!paymentsSnapshot.empty) {
      const paymentDoc = paymentsSnapshot.docs[0];
      const orderId = paymentDoc.data().orderId;

      await admin.firestore().collection('orders').doc(orderId).update({
        paymentStatus: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  res.status(200).send('OK');
});
\`\`\`

#### Deploy Functions

\`\`\`bash
firebase deploy --only functions
\`\`\`

#### Set Config

\`\`\`bash
firebase functions:config:set razorpay.key_id="YOUR_KEY_ID"
firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET"
firebase functions:config:set razorpay.webhook_secret="YOUR_WEBHOOK_SECRET"
\`\`\`

## 📁 Project Structure

\`\`\`
d:/p/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/          # Data models (Shop, Product, Order, Payment)
│   │   │   └── services/        # Core services (Firebase, Razorpay, WhatsApp, Cart, Language)
│   │   ├── features/
│   │   │   ├── customer/        # Customer-facing components
│   │   │   │   ├── home/
│   │   │   │   ├── products/
│   │   │   │   ├── product-details/
│   │   │   │   └── cart/
│   │   │   └── seller/          # Seller dashboard components
│   │   │       ├── dashboard/
│   │   │       ├── products-management/
│   │   │       └── orders-management/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── icons/               # PWA icons (192x192, 512x512, etc.)
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   ├── manifest.webmanifest     # PWA manifest
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── ngsw-config.json             # Service worker config
└── README.md
\`\`\`

## 🌐 Deployment

### Firebase Hosting

\`\`\`bash
# Build production
npm run build:prod

# Deploy
firebase deploy --only hosting
\`\`\`

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

**Important**: Ensure HTTPS is enabled for PWA features to work.

## 📱 Icon Assets

Create PWA icons and place them in `src/assets/icons/`:

Required sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192 (required)
- 384x384
- 512x512 (required)

Use tools like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) or [RealFaviconGenerator](https://realfavicongenerator.net/).

## 🔒 Security Best Practices

1. **Never expose Razorpay key_secret** in frontend code
2. **Always create payment links** from backend (Cloud Functions)
3. **Verify webhook signatures** before processing payments
4. **Use Firestore security rules** to protect data
5. **Enable Firebase App Check** to prevent abuse
6. **Sanitize user inputs** before storing in database

## 🧪 Testing

### Local Testing

\`\`\`bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e
\`\`\`

### PWA Testing

1. Build production: `ng build --configuration production`
2. Serve locally: `npx http-server dist/whatsapp-ordering-pwa -p 8080`
3. Test on mobile device using ngrok or local network

### WhatsApp Testing

Test Click-to-Chat links with different scenarios:
- Single item order
- Multiple items order
- Orders with special characters
- Long addresses
- Optional fields (landmark, notes, preferred time)

## 🐛 Troubleshooting

### PWA Not Installing
- Ensure site is served over HTTPS
- Check manifest.webmanifest has all required fields
- Verify service worker is registered
- Check browser console for errors

### WhatsApp Link Not Working
- Verify phone number is in E.164 format (no +, spaces, dashes)
- Test URL encoding of message
- Check if WhatsApp is installed on device

### Payment Link Issues
- Verify Razorpay credentials
- Check Cloud Function logs
- Ensure webhook endpoint is accessible
- Verify webhook signature verification

### Firebase Connection Issues
- Check Firebase configuration in environment files
- Verify Firestore security rules
- Check network connectivity
- Enable Firebase debugging

## 📈 Roadmap

### v0 (Current - MVP)
- ✅ Product catalog with Tamil/English
- ✅ Shopping cart
- ✅ WhatsApp ordering (Click-to-Chat)
- ✅ Seller dashboard
- ✅ Product management
- ✅ Order management
- ✅ Razorpay payment links
- ✅ PWA installability

### v0.1 (Next)
- [ ] Stock management toggle
- [ ] Product options (size, add-ons)
- [ ] Order status tracking for customers
- [ ] Daily sales summary
- [ ] Email notifications

### v1 (Future)
- [ ] WhatsApp Cloud API integration
- [ ] Automated order updates via templates
- [ ] Customer opt-in management
- [ ] Invoice PDF generation
- [ ] Sales analytics & reports
- [ ] Multi-shop support
- [ ] Custom domains per shop
- [ ] Staff accounts
- [ ] Customer database & CRM
- [ ] Loyalty program
- [ ] Promotional campaigns

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email your-email@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- WhatsApp for Click-to-Chat API
- Razorpay for Payment Links API
- Angular Team for the awesome framework
- Firebase for backend infrastructure
- Material Design for UI components

## 📞 Contact

**Project Maintainer**: Your Name  
**Email**: your-email@example.com  
**Location**: Kurinjipadi, Kallakurichi, Tamil Nadu

---

**Built with ❤️ for Tamil Nadu's local businesses**

*Supporting neighborhood shops to go digital while keeping WhatsApp as the familiar ordering channel.*
