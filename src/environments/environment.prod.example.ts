// Template for production environment
// Copy this to environment.prod.ts and fill in your actual values
// NEVER commit environment.prod.ts to Git!

export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  },
  business: {
    name: 'Chess Activities',
    email: 'support@chessactivities.com',
    domain: 'chessactivities.com',
    description: 'Master chess through interactive puzzles, quizzes, and training activities'
  },
  razorpay: {
    keyId: 'rzp_live_YOUR_KEY_ID',
    // Secret key should be kept server-side only (Firebase Functions/Cloud Functions)
    // Never expose secret key in frontend code
  }
};
