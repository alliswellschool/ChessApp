# Social Login Error: "Operation not allowed"

## Problem
When clicking "Continue with Google" or "Continue with Facebook", you see the error:
**"Operation not allowed."**

## Root Cause
This error occurs because the authentication providers (Google/Facebook) are not enabled in your Firebase project configuration.

## Solution

### Quick Fix - Enable Providers in Firebase Console

#### For Google Sign-In:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click the **Sign-in method** tab
5. Find **Google** in the providers list
6. Click on it
7. Toggle the **Enable** switch to ON
8. Enter your project public-facing name: `Chess Activities`
9. Select a support email from the dropdown
10. Click **Save**

✅ **Google sign-in is now enabled!** Try logging in again.

---

#### For Facebook Sign-In:
Facebook requires additional setup with a Facebook App:

**Step 1: Create Facebook App**
1. Go to https://developers.facebook.com/
2. Click "My Apps" → "Create App"
3. Choose "Consumer" type → Click "Next"
4. App name: `Chess Activities` → Create App
5. Add Product: "Facebook Login" → Set Up
6. Choose "Web" platform
7. Site URL: `http://localhost:4200` (for development)

**Step 2: Configure Facebook App**
1. Left sidebar: "Facebook Login" → "Settings"
2. Add to "Valid OAuth Redirect URIs":
   ```
   https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
   ```
   Replace `YOUR_PROJECT_ID` with your actual Firebase project ID
3. Click "Save Changes"
4. Go to "Settings" → "Basic"
5. Copy your **App ID** and **App Secret**

**Step 3: Enable in Firebase**
1. Back to Firebase Console → Authentication → Sign-in method
2. Click on **Facebook**
3. Toggle **Enable** to ON
4. Paste your Facebook **App ID**
5. Paste your Facebook **App Secret**
6. Click **Save**

✅ **Facebook sign-in is now enabled!**

---

## How to Check If Providers Are Enabled

1. Firebase Console → Authentication → Sign-in method
2. Look for these providers:
   - ✅ **Email/Password** - Status: "Enabled"
   - ✅ **Google** - Status: "Enabled"  
   - ✅ **Facebook** - Status: "Enabled"

If any show "Disabled", follow the steps above to enable them.

---

## Testing

After enabling:
1. Refresh your Chess Activities website
2. Clear browser cache if needed (Ctrl+Shift+Del)
3. Try clicking "Continue with Google" again
4. You should see the Google/Facebook login popup

---

## Common Issues

### "Popup was blocked"
- Allow popups for your site in browser settings
- Or use redirect mode (requires code changes)

### Facebook: "App Not Set Up"
- Make sure you added the OAuth redirect URI to your Facebook App
- Check that App ID and Secret match exactly

### Still Getting Errors?
- Double-check your Firebase project ID in the OAuth redirect URI
- Verify your Facebook App is in "Development" mode (allows test users)
- Check browser console for detailed error messages

---

## Need Help?
See the full setup guide: `docs/FIREBASE_SETUP.md`
