// Run this in browser console while on localhost:4200

// Paste this into browser console (F12):
import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js').then(({ initializeApp }) => {
  return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ getAuth, signInWithEmailAndPassword }) => {
    
    const firebaseConfig = {
      apiKey: "AIzaSyACEj8IaQJGUcP5WR8EBZf1ZqQy_KK5MYw",
      authDomain: "whatsapp-local-order.firebaseapp.com",
      projectId: "whatsapp-local-order",
      storageBucket: "whatsapp-local-order.firebasestorage.app",
      messagingSenderId: "637890946421",
      appId: "1:637890946421:web:a1fc5bb15aeefd09ac8c58"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const email = "admin@orders.com";
    const password = "123456";

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        console.log("✅ SUCCESS!");
        console.log("📧 Email:", email);
        console.log("🆔 YOUR REAL UID:", uid);
        console.log("");
        console.log("👉 USE THIS UID AS DOCUMENT ID IN FIRESTORE!");
        console.log("");
        console.log("Copy this UID:", uid);
      })
      .catch((error) => {
        console.error("❌ Error:", error.message);
      });
  });
});
