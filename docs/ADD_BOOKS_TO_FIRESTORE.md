# Quick way to add books to Firestore

## Option 1: Using Firebase Console (Easiest - No code needed)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `chess-app-41191`
3. Go to **Firestore Database** → **Data** tab
4. Create a new collection called `products` (if it doesn't exist)
5. Click **Add Document** and add each book:

### Book 1
```
id: (auto-generated)
name: Fun with Chess
description: A comprehensive Learning & Training Guide that makes chess fun and accessible for students of all levels. This book covers essential chess concepts through engaging exercises and clear explanations, perfect for building a strong foundation in chess.
price: 299
imageUrl: /books/Fun with Chess_3D cover.jpg (1).jpeg
active: true
```

### Book 2
```
id: (auto-generated)
name: 101 Magical Treasures
description: Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective and help you navigate life's challenges with clarity and purpose.
price: 349
imageUrl: /books/101 MT 3D Cover.png
active: true
```

### Book 3
```
id: (auto-generated)
name: Classical Thought Provoking Puzzles
description: A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers, logic puzzles, and creative problem-solving exercises suitable for all ages.
price: 299
imageUrl: /books/Classical Thought Provoking Puzzles_3D Cover.png
active: true
```

### Book 4
```
id: (auto-generated)
name: சதுரங்கம் கற்றுக்கொள்வோம்
description: கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises. Perfect for Tamil-speaking students who want to master the game of chess with clear, culturally relevant explanations.
price: 249
imageUrl: /books/Tamil Chess book_3D_New.png
active: true
```

---

## Option 2: Using Seed Script (Requires Firebase Setup)

1. **Create a service account key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save it as `firebase-service-account.json` in the project root

2. **Install Firebase Admin SDK:**
   ```powershell
   npm install firebase-admin
   ```

3. **Run the seed script:**
   ```powershell
   node seed-books.js
   ```

---

**Recommendation:** Use **Option 1** (Firebase Console) - it's the easiest and no dependencies needed. Just point and click!
