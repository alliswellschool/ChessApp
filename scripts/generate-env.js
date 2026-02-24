const fs = require('fs');
const path = require('path');

// Get environment variables from Cloudflare (or fallback to local values)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCECR4FK_tqD2JB1k2FAtPQOtRiAz2bcZU',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'chess-app-41191.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'chess-app-41191',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'chess-app-41191.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '873425350058',
  appId: process.env.FIREBASE_APP_ID || '1:873425350058:web:e5c5c60fa967ff5e210fd3'
};

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_S4u4V8JqDVMOMz';

// Create environment.prod.ts content
const envContent = `export const environment = {
  production: true,
  firebase: {
    apiKey: "${firebaseConfig.apiKey}",
    authDomain: "${firebaseConfig.authDomain}",
    projectId: "${firebaseConfig.projectId}",
    storageBucket: "${firebaseConfig.storageBucket}",
    messagingSenderId: "${firebaseConfig.messagingSenderId}",
    appId: "${firebaseConfig.appId}"
  },
  business: {
    name: 'All is well school of chess',
    email: 'spraveen2@gmail.com',
    domain: 'chessactivities.com',
    description: 'Master chess through interactive puzzles, quizzes, and training activities'
  },
  razorpay: {
    keyId: '${razorpayKeyId}'
  }
};
`;

// Create scripts directory if it doesn't exist
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Write to environment.prod.ts
const envPath = path.join(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(envPath, envContent);

console.log('✓ environment.prod.ts generated successfully from environment variables');
console.log(`  API Key: ${firebaseConfig.apiKey.substring(0, 15)}...`);
console.log(`  Project: ${firebaseConfig.projectId}`);
