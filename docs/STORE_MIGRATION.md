# Store Migration Guide

## What Changed

Your books app now uses **Firestore** to store products dynamically instead of hardcoded data. This gives you:
- ✅ Edit books from the admin panel (no code changes needed)
- ✅ Add/remove products anytime
- ✅ Modern, purple-themed UI
- ✅ Dashboard showing app metrics

## Migration Steps

### 1. Add Your Existing Books to Firestore

Go to the **Admin Panel** → **Store Products** tab and add each book manually:

**Book 1: Fun with Chess**
- Name: `Fun with Chess`
- Description: `A comprehensive Learning & Training Guide that makes chess fun and accessible for students of all levels. This book covers essential chess concepts through engaging exercises and clear explanations, perfect for building a strong foundation in chess.`
- Price: `299`
- Image URL: `/books/Fun with Chess_3D cover.jpg (1).jpeg`
- Active: ✓ (checked)

**Book 2: 101 Magical Treasures**
- Name: `101 Magical Treasures`
- Description: `Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective and help you navigate life's challenges with clarity and purpose.`
- Price: `349`
- Image URL: `/books/101 MT 3D Cover.png`
- Active: ✓ (checked)

**Book 3: Classical Thought Provoking Puzzles**
- Name: `Classical Thought Provoking Puzzles`
- Description: `A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers, logic puzzles, and creative problem-solving exercises suitable for all ages.`
- Price: `299`
- Image URL: `/books/Classical Thought Provoking Puzzles_3D Cover.png`
- Active: ✓ (checked)

**Book 4: சதுரங்கம் கற்றுக்கொள்வோம்**
- Name: `சதுரங்கம் கற்றுக்கொள்வோம்`
- Description: `கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises. Perfect for Tamil-speaking students who want to master the game of chess with clear, culturally relevant explanations.`
- Price: `249`
- Image URL: `/books/Tamil Chess book_3D_New.png`
- Active: ✓ (checked)

### 2. Deploy Firestore Rules

Run this command to deploy the updated security rules:
```bash
firebase deploy --only firestore:rules
```

### 3. Test Everything

1. Visit `/books` page - should show "Loading products..." then display your products
2. Try adding a product to cart
3. Visit `/admin` - Dashboard should show product count
4. Edit/delete products from the admin panel

## New Features

### Admin Dashboard
- 📊 Overview of products, questions, users, and quiz stats
- 🎯 Recent activity summary
- 💡 Quick action buttons
- 📌 System status indicators

### Modern Books Store
- 🎨 Purple gradient theme (matches your app)
- ⚡ Loading states with spinner
- 🔍 Better search experience
- 💳 INR currency display (₹)

### Admin Product Management
- ✏️ Edit products inline
- 🗑️ Delete with confirmation
- 👁️ Active/inactive toggle
- 🖼️ Image URL support

## Important Notes

- Only users with `role: "admin"` in Firestore can manage products
- Products with `active: false` won't appear in the store
- All prices are in INR (₹)
- Image URLs can be local paths (e.g., `/books/image.jpg`) or external URLs

## Troubleshooting

**Books page is empty?**
- Check if you added products in Admin → Store Products
- Make sure products are marked as "Active"
- Check browser console for Firestore errors

**Can't edit products?**
- Verify your user document has `role: "admin"` in Firestore
- Check Firestore rules are deployed

**Images not showing?**
- Verify image paths are correct
- Images in `/public/books/` need to be accessible
- Try using full URLs for testing
