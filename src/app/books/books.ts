import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'beginner' | 'intermediate' | 'advanced' | 'openings' | 'endgame' | 'tactics';
  rating: number;
  reviews: number;
  inStock: boolean;
  bestseller?: boolean;
  image: string;
}

interface CartItem extends Book {
  quantity: number;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css']
})
export class Books {
  selectedCategory: string = 'all';
  sortBy: string = 'popular';
  searchQuery: string = '';
  cart: CartItem[] = [];
  showCart: boolean = false;

  categories = [
    { id: 'all', name: 'All Books', icon: '📚' },
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'intermediate', name: 'Intermediate', icon: '📈' },
    { id: 'advanced', name: 'Advanced', icon: '🎯' },
    { id: 'openings', name: 'Openings', icon: '♟️' },
    { id: 'endgame', name: 'Endgame', icon: '♔' },
    { id: 'tactics', name: 'Tactics', icon: '⚡' }
  ];

  books: Book[] = [
    {
      id: 1,
      title: 'Fun with Chess',
      author: 'Praveen Sadasivam',
      description: 'A comprehensive Learning & Training Guide that makes chess fun and accessible for students of all levels. This book covers essential chess concepts through engaging exercises and clear explanations, perfect for building a strong foundation in chess.',
      price: 299,
      category: 'beginner',
      rating: 4.9,
      reviews: 45,
      inStock: true,
      bestseller: true,
      image: '/books/Fun with Chess_3D cover.jpg (1).jpeg'
    },
    {
      id: 2,
      title: '101 Magical Treasures',
      author: 'Praveen Sadasivam',
      description: 'Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective and help you navigate life\'s challenges with clarity and purpose.',
      price: 349,
      category: 'beginner',
      rating: 4.8,
      reviews: 32,
      inStock: true,
      bestseller: false,
      image: '/books/101 MT 3D Cover.png'
    },
    {
      id: 3,
      title: 'Classical Thought Provoking Puzzles',
      author: 'Praveen Sadasivam',
      description: 'A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers, logic puzzles, and creative problem-solving exercises suitable for all ages.',
      price: 299,
      category: 'tactics',
      rating: 4.7,
      reviews: 28,
      inStock: true,
      bestseller: false,
      image: '/books/Classical Thought Provoking Puzzles_3D Cover.png'
    },
    {
      id: 4,
      title: 'சதுரங்கம் கற்றுக்கொள்வோம்',
      author: 'Praveen Sadasivam',
      description: 'கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises. Perfect for Tamil-speaking students who want to master the game of chess with clear, culturally relevant explanations.',
      price: 249,
      category: 'beginner',
      rating: 4.9,
      reviews: 56,
      inStock: true,
      bestseller: true,
      image: '/books/Tamil Chess book_3D_New.png'
    }
  ];

  constructor() {
    this.loadCartFromStorage();
  }

  get filteredBooks(): Book[] {
    let filtered = this.books;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  addToCart(book: Book): void {
    const existingItem = this.cart.find(item => item.id === book.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...book, quantity: 1 });
    }
    this.saveCartToStorage();
  }

  removeFromCart(bookId: number): void {
    this.cart = this.cart.filter(item => item.id !== bookId);
    this.saveCartToStorage();
  }

  updateQuantity(bookId: number, quantity: number): void {
    const item = this.cart.find(item => item.id === bookId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCartToStorage();
    }
  }

  get cartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get cartItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  // Rating and reviews - commented out for future use
  // getStarArray(rating: number): boolean[] {
  //   return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  // }

  private saveCartToStorage(): void {
    localStorage.setItem('chess-books-cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage(): void {
    const saved = localStorage.getItem('chess-books-cart');
    if (saved) {
      this.cart = JSON.parse(saved);
    }
  }

  checkout(): void {
    alert('Checkout functionality will be integrated with payment gateway. Total: $' + this.cartTotal.toFixed(2));
  }
}
