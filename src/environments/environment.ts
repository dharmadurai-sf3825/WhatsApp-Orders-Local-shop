export const environment = {
  production: false,
    firebase: {
    apiKey: "AIzaSyBY_bTIjjyYPm4MCilSd7dGL9sxji92vHg",
    authDomain: "whatsapp-local-order.firebaseapp.com",
    projectId: "whatsapp-local-order",
    storageBucket: "whatsapp-local-order.firebasestorage.app",
    messagingSenderId: "354992539785",
    appId: "1:354992539785:web:ea26b8fcad3048f2b45e58",
    measurementId: "G-49CPEYL3CX"
    },
  razorpay: {
    keyId: 'YOUR_RAZORPAY_PRODUCTION_KEY_ID',
    keySecret: 'YOUR_RAZORPAY_PRODUCTION_KEY_SECRET'
  },
  whatsapp: {
    businessNumber: '918220762702', // E.164 format without +
    defaultMessage: 'Hello, I want to place an order'
  }
};