import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  description: string;
  amazonUrl: string;
  image: string;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css']
})
export class Books {
  searchQuery: string = '';
  
  books: Book[] = [
    {
      id: 1,
      title: 'Fun with Chess',
      description: 'A comprehensive Learning & Training Guide that makes chess fun and accessible for students of all levels. This book covers essential chess concepts through engaging exercises and clear explanations.',
      amazonUrl: 'https://www.amazon.com/Fun-Chess-Learning-Training-Guide-ebook/dp/B0851GB62S/ref=sr_1_1?sr=8-1',
      image: '/books/Fun with Chess_3D cover.jpg (1).jpeg'
    },
    {
      id: 2,
      title: '101 Magical Treasures',
      description: 'Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective.',
      amazonUrl: 'https://www.amazon.com/101-Magical-Treasures-Principles-relationships/dp/B0DDQ3S8TV/ref=books_amazonstores_desktop_mfs_aufs_ap_sc_dsk_2?_encoding=UTF8',
      image: '/books/101 MT 3D Cover.png'
    },
    {
      id: 3,
      title: 'Classical Thought Provoking Puzzles',
      description: 'A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers and logic puzzles.',
      amazonUrl: '#',
      image: '/books/Classical Thought Provoking Puzzles_3D Cover.png'
    },
    {
      id: 4,
      title: 'சதுரங்கம் கற்றுக்கொள்வோம்',
      description: 'கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises.',
      amazonUrl: '#',
      image: '/books/Tamil Chess book_3D_New.png'
    }
  ];

  get filteredBooks(): Book[] {
    if (!this.searchQuery.trim()) {
      return this.books;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
  }

  buyOnAmazon(book: Book): void {
    if (book.amazonUrl && book.amazonUrl !== '#') {
      window.open(book.amazonUrl, '_blank');
    } else {
      alert('Amazon link coming soon for this book!');
    }
  }
}
