export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDwC-v-wBLc3C_aip1UHF4ZcTQlgQ19Ha8",
    authDomain: "chess-activities.firebaseapp.com",
    projectId: "chess-activities",
    storageBucket: "chess-activities.firebasestorage.app",
    messagingSenderId: "705283779084",
    appId: "1:705283779084:web:ec701c3c968d1d313c5c29",
    measurementId: "G-DRQ5HSBGEB"
  },
  business: {
    name: 'Chess Activities',
    email: 'support@chessactivities.com',
    domain: 'chessactivities.com', // Update this with your actual domain
    description: 'Master chess through interactive puzzles, quizzes, and training activities'
  },
  razorpay: {
    keyId: 'rzp_live_S4u4V8JqDVMOMz',
    // Secret key should be kept server-side only (Firebase Functions/Cloud Functions)
    // Never expose secret key in frontend code
  }
};
