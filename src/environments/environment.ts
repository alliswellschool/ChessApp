// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDpW8OGi_4ohV2AZFF7b2EEELSe_txoS08",
    authDomain: "chess-app-41191.firebaseapp.com",
    projectId: "chess-app-41191",
    storageBucket: "chess-app-41191.firebasestorage.app",
    messagingSenderId: "873425350058",
    appId: "1:873425350058:web:e5c5c60fa967ff5e210fd3"
  },
  business: {
    name: 'All is well school of chess',
    email: 'spraveen2@gmail.com',
    domain: 'chessactivities.com', // Update this once you get your domain
    description: 'Master chess through interactive puzzles, quizzes, and training activities'
  },
  razorpay: {
    keyId: 'rzp_live_S4u4V8JqDVMOMz',
    // Secret key should be kept server-side only (Firebase Functions/Cloud Functions)
    // Never expose secret key in frontend code
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
