# Razorpay Donation Setup Guide

## ✅ What's Been Created

1. **Service**: `razorpay.service.ts` - Handles all Razorpay interactions
2. **Component**: `donate/` - Beautiful donation page with predefined & custom amounts
3. **Route**: `/donate` - Accessible via navigation menu
4. **Database**: Auto-saves donations to Firestore `donations` collection

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Click **Sign Up** → Select **Individual/Business**
3. Enter email, phone, and create password
4. Verify email and phone

### Step 2: Get Your API Key
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key** (or **Live Key** for production)
4. Copy the **Key ID** (starts with `rzp_test_` or `rzp_live_`)

### Step 3: Update Your Code
Open `src/app/services/razorpay.service.ts` and replace:
```typescript
private razorpayKey = 'rzp_test_YOUR_KEY_HERE';
```
With your actual key:
```typescript
private razorpayKey = 'rzp_test_abcdefghijklmnop';
```

### Step 4: Test It!
```bash
# Run your app
ng serve

# Navigate to
http://localhost:4200/donate
```

---

## 🎨 Features

### Predefined Amounts
- ₹50, ₹100, ₹200, ₹500, ₹1000
- One-click selection

### Custom Amount
- Enter any amount ≥ ₹10
- Real-time validation

### Payment Methods (via Razorpay)
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Credit/Debit Cards
- ✅ Net Banking
- ✅ Wallets (Paytm, PhonePe, Freecharge, etc.)

### Auto-Save to Firestore
Every successful donation is saved:
```typescript
{
  userId: "user123" or "anonymous",
  userName: "John Doe",
  userEmail: "john@example.com",
  amount: 100,
  paymentId: "pay_xxxxx",
  timestamp: Firestore.Timestamp
}
```

---

## 💰 Fees

**Test Mode**: FREE (no real money)
**Live Mode**: 
- UPI: 2%
- Cards: 2.9%
- Net Banking: ₹10 per transaction
- Wallets: 2%

---

## 🧪 Testing

### Test Mode (Default)
1. Use test key (`rzp_test_...`)
2. Test payment flow
3. Use any UPI ID or card number
4. Payments won't be real

### Test Cards
```
Success: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Test UPI
```
Success: success@razorpay
Failure: failure@razorpay
```

---

## 🔥 Go Live Checklist

### 1. Complete KYC
- Go to Razorpay Dashboard → **Settings** → **KYC**
- Upload:
  - PAN Card
  - Bank Account details
  - Address proof

### 2. Switch to Live Key
Replace test key with live key in `razorpay.service.ts`

### 3. Enable Payment Methods
Dashboard → **Settings** → **Payment Methods**
- Enable UPI, Cards, NetBanking, Wallets

### 4. Set Settlement Schedule
Dashboard → **Settings** → **Settlements**
- Choose when funds transfer to your bank (T+1, T+3, etc.)

---

## 🎯 Customization

### Change Predefined Amounts
In `donate.ts`:
```typescript
amounts = [50, 100, 200, 500, 1000]; // Modify these
```

### Change Minimum Amount
In `donate.ts`:
```typescript
if (amount < 10) { // Change 10 to your minimum
  this.showMessage('Minimum donation amount is ₹10', 'error');
  return;
}
```

### Change Colors
In `donate.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change to your brand colors */
```

### Add Logo
In `razorpay.service.ts`:
```typescript
image: '/assets/logo.png', // Your logo URL
```

---

## 📊 View Donations

### Option 1: Firebase Console
1. Go to Firebase Console → Firestore
2. Open `donations` collection
3. View all donations

### Option 2: Create Admin Page
Add to your admin component to display donations:
```typescript
donations$ = collectionData(
  collection(this.firestore, 'donations')
) as Observable<any[]>;
```

---

## 🛡️ Security Rules

Add to `firestore.rules`:
```javascript
match /donations/{donationId} {
  allow read: if request.auth != null && 
    (request.auth.uid == resource.data.userId || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
  allow write: if false; // Only app can write
}
```

---

## 🐛 Troubleshooting

### "Razorpay is not defined"
- Script not loaded yet
- Service auto-loads it, just wait a moment

### "Payment failed"
- Using test mode? Use test credentials
- Check if key is correct (no typos)
- Check browser console for errors

### Donations not saving to Firestore
- Check Firebase console for errors
- Verify Firestore is initialized
- Check security rules

---

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs
- **Razorpay Support**: support@razorpay.com
- **Test Dashboard**: https://dashboard.razorpay.com/test

---

## 🎉 That's It!

Your donate button is ready! Users can now support your chess platform with:
- 🇮🇳 **Zero fees for UPI** (2% for you, but free for users!)
- ⚡ **Instant payments**
- 🔒 **Secure via Razorpay**
- 💳 **Multiple payment methods**

**Next Steps:**
1. Get your Razorpay key
2. Replace in code
3. Test donation flow
4. Complete KYC
5. Go live! 🚀

---

**Need Help?** Check Razorpay documentation or reach out to their support team!
