// This is a one-time seeding script to add existing books to Firestore
// Run this in a terminal with: node seed-books.js

import admin from 'firebase-admin';
import serviceAccount from './firebase-service-account.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const books = [
  {
    name: 'Fun with Chess',
    description: 'A comprehensive Learning & Training Guide that makes chess fun and accessible for students of all levels. This book covers essential chess concepts through engaging exercises and clear explanations, perfect for building a strong foundation in chess.',
    price: 299,
    imageUrl: '/books/Fun with Chess_3D cover.jpg (1).jpeg',
    active: true
  },
  {
    name: '101 Magical Treasures',
    description: 'Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective and help you navigate life\'s challenges with clarity and purpose.',
    price: 349,
    imageUrl: '/books/101 MT 3D Cover.png',
    active: true
  },
  {
    name: 'Classical Thought Provoking Puzzles',
    description: 'A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers, logic puzzles, and creative problem-solving exercises suitable for all ages.',
    price: 299,
    imageUrl: '/books/Classical Thought Provoking Puzzles_3D Cover.png',
    active: true
  },
  {
    name: 'சதுரங்கம் கற்றுக்கொள்வோம்',
    description: 'கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises. Perfect for Tamil-speaking students who want to master the game of chess with clear, culturally relevant explanations.',
    price: 249,
    imageUrl: '/books/Tamil Chess book_3D_New.png',
    active: true
  }
];

async function seedBooks() {
  try {
    console.log('🌱 Starting to seed books...');
    
    for (const book of books) {
      await db.collection('products').add({
        ...book,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Added: ${book.name}`);
    }
    
    console.log('✨ All books added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
}

seedBooks();
