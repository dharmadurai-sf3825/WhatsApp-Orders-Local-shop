// 📝 Environment Configuration Template
// 
// INSTRUCTIONS:
// 1. Copy this file to create your environment files:
//    - For Development: cp environment.template.ts environment.ts
//    - For Production: cp environment.template.ts environment.prod.ts
// 
// 2. Replace all placeholder values with your actual credentials
// 
// 3. NEVER commit environment.ts or environment.prod.ts to Git!
//    (They are already in .gitignore)
//
// 4. Set production flag:
//    - environment.ts: production = false
//    - environment.prod.ts: production = true

export const environment = {
  production: false, // Change to true for environment.prod.ts
  
  firebase: {
    // Get these from Firebase Console:
    // https://console.firebase.google.com/ → Project Settings → General
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  
  razorpay: {
    // Get these from Razorpay Dashboard:
    // https://dashboard.razorpay.com/ → Settings → API Keys
    // For DEVELOPMENT: Use TEST keys (rzp_test_...)
    // For PRODUCTION: Use LIVE keys (rzp_live_...)
    keyId: 'YOUR_RAZORPAY_KEY_ID',
    keySecret: 'YOUR_RAZORPAY_KEY_SECRET'
  },
  
  whatsapp: {
    // Your WhatsApp Business number in E.164 format (without + sign)
    // Example: 919876543210 for +91 9876543210
    businessNumber: '919876543210',
    defaultMessage: 'Hello, I want to place an order'
  }
};
