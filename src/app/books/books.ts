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
      title: 'Chess Fundamentals',
      author: 'José Raúl Capablanca',
      description: 'A timeless classic covering the essential principles of chess. Perfect for beginners who want to build a strong foundation.',
      price: 15.99,
      originalPrice: 19.99,
      category: 'beginner',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      bestseller: true,
      image: '📖'
    },
    {
      id: 2,
      title: 'My System',
      author: 'Aron Nimzowitsch',
      description: 'Revolutionary work on positional chess and strategic thinking. A must-read for advancing players.',
      price: 22.99,
      category: 'intermediate',
      rating: 4.7,
      reviews: 203,
      inStock: true,
      image: '📕'
    },
    {
      id: 3,
      title: '1001 Chess Exercises for Beginners',
      author: 'Franco Masetti',
      description: 'Comprehensive collection of tactical puzzles designed specifically for beginners.',
      price: 18.99,
      originalPrice: 24.99,
      category: 'beginner',
      rating: 4.9,
      reviews: 342,
      inStock: true,
      bestseller: true,
      image: '🧩'
    },
    {
      id: 4,
      title: 'Dvoretsky\'s Endgame Manual',
      author: 'Mark Dvoretsky',
      description: 'The definitive guide to chess endgames. Essential for serious players looking to master endgame technique.',
      price: 35.99,
      category: 'endgame',
      rating: 5.0,
      reviews: 178,
      inStock: true,
      bestseller: true,
      image: '♚'
    },
    {
      id: 5,
      title: 'Modern Chess Openings (MCO-15)',
      author: 'Nick de Firmian',
      description: 'Comprehensive encyclopedia of chess openings. The standard reference for opening theory.',
      price: 32.99,
      category: 'openings',
      rating: 4.6,
      reviews: 124,
      inStock: true,
      image: '📚'
    },
    {
      id: 6,
      title: 'The Art of Attack in Chess',
      author: 'Vladimir Vukovic',
      description: 'Learn the principles and patterns of successful attacking play. Classic work on offensive chess.',
      price: 19.99,
      category: 'intermediate',
      rating: 4.8,
      reviews: 189,
      inStock: true,
      image: '⚔️'
    },
    {
      id: 7,
      title: 'Bobby Fischer Teaches Chess',
      author: 'Bobby Fischer',
      description: 'Learn chess from a World Champion. Interactive format perfect for beginners.',
      price: 12.99,
      originalPrice: 16.99,
      category: 'beginner',
      rating: 4.7,
      reviews: 521,
      inStock: true,
      bestseller: true,
      image: '👑'
    },
    {
      id: 8,
      title: 'Silman\'s Complete Endgame Course',
      author: 'Jeremy Silman',
      description: 'Structured approach to learning endgames based on rating level. Accessible and practical.',
      price: 24.99,
      category: 'endgame',
      rating: 4.8,
      reviews: 267,
      inStock: true,
      image: '🎓'
    },
    {
      id: 9,
      title: 'Winning Chess Tactics',
      author: 'Yasser Seirawan',
      description: 'Master tactical patterns and combinations. Clear explanations with numerous examples.',
      price: 17.99,
      category: 'tactics',
      rating: 4.7,
      reviews: 198,
      inStock: true,
      image: '⚡'
    },
    {
      id: 10,
      title: 'Think Like a Grandmaster',
      author: 'Alexander Kotov',
      description: 'Classic work on chess thinking and decision-making process. Essential for advanced players.',
      price: 21.99,
      category: 'advanced',
      rating: 4.6,
      reviews: 145,
      inStock: true,
      image: '🧠'
    },
    {
      id: 11,
      title: 'The Sicilian Defense',
      author: 'Garry Kasparov',
      description: 'Deep dive into the most popular chess opening. Part of Kasparov\'s masterpiece series.',
      price: 28.99,
      category: 'openings',
      rating: 4.9,
      reviews: 167,
      inStock: false,
      image: '🎯'
    },
    {
      id: 12,
      title: 'Chess Strategy for Club Players',
      author: 'Herman Grooten',
      description: 'Modern approach to chess strategy. Practical advice for improving club players.',
      price: 23.99,
      category: 'intermediate',
      rating: 4.7,
      reviews: 134,
      inStock: true,
      image: '🏆'
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

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

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
