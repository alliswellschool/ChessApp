import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  description: string;
  amazonUrl: string;
  amazonInUrl?: string;
  image: string;
  displaySize?: 'a4' | 'a5-small';
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
      amazonInUrl: 'https://www.amazon.in/Fun-Chess-Learning-Training-Guide/dp/1946390801/',
      image: '/books/Fun with Chess_3D cover.jpg (1).jpeg',
      displaySize: 'a4'
    },
    {
      id: 2,
      title: '101 Magical Treasures',
      description: 'Principles to improve well-being, strengthen relationships and excel in life. A collection of 101 timeless wisdom nuggets that will transform your perspective.',
      amazonUrl: 'https://www.amazon.com/101-Magical-Treasures-Principles-relationships/dp/B0DDQ3S8TV/ref=books_amazonstores_desktop_mfs_aufs_ap_sc_dsk_2?_encoding=UTF8',
      amazonInUrl: 'https://www.amazon.in/101-Magical-Treasures-Principles-relationships/dp/B0DDQ3S8TV',
      image: '/books/101 MT 3D Cover.png'
    },
    {
      id: 3,
      title: 'Classical Thought Provoking Puzzles',
      description: 'A collection of timeless puzzles to spend fun filled quality time with family & friends. Challenge your mind with engaging brain teasers and logic puzzles.',
      amazonUrl: '#',
      amazonInUrl: 'https://www.amazon.in/Classical-Thought-Provoking-Puzzles-Peppered/dp/1646502221/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.5QJTOturg2CiKjoLqM5crzPUnFR6lx2mfF9GhNGIiPd5Q15U0nrWSIZR1KIGxUEV2LB6i6ZEgE2fvVrThNSCxVLSqH2nK8NXP59n7znYAJI.v1IYAPsRu6R3O6-UBeE2_sPRlyWGwweyTKdWhgb9anw',
      image: '/books/Classical Thought Provoking Puzzles_3D Cover.png'
    },
    {
      id: 4,
      title: 'சதுரங்கம் கற்றுக்கொள்வோம்',
      description: 'கற்றல் மற்றும் பயிற்சி வழிகாட்டி - Learn chess in Tamil with comprehensive lessons and training exercises.',
      amazonUrl: 'https://www.amazon.com/Sathurangam-Kattrukkolvom-%E0%AE%9A%E0%AE%A4%E0%AF%81%E0%AE%B0%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%AE%E0%AF%8D-%E0%AE%95%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%8A%E0%AE%B3%E0%AF%8D%E0%AE%B5%E0%AF%8B%E0%AE%AE%E0%AF%8D-Vazhikatti/dp/1648992285?ref_=ast_author_dp_rw&th=1&psc=1&dib=eyJ2IjoiMSJ9.tfLXZSI0TGfePsbuOYhK3rH3u478UZ4Hy-q2qdy9QXr_rNJ9I4FG0T7AZzNY7QhPbZSzfcxdJZi42o0M8Wld_g.d9t5OYgOPtNpLZwHmyI36fsRmbdkUTJ17vKdICmoRQk&dib_tag=AUTHOR',
      amazonInUrl: 'https://www.amazon.in/Sathurangam-Kattrukkolvom-%E0%AE%9A%E0%AE%A4%E0%AF%81%E0%AE%B0%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%AE%E0%AF%8D-%E0%AE%95%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%8A%E0%AE%B3%E0%AF%8D%E0%AE%B5%E0%AF%8B%E0%AE%AE%E0%AF%8D-Vazhikatti/dp/1648992285',
      image: '/books/Tamil Chess book_3D_New.png'
    },
    {
      id: 5,
      title: 'சிந்தனையை தூண்டும் புதிர்கள்',
      description: 'தமிழில் சிந்தனையைத் தூண்டும் புதிர்கள் தொகுப்பு - engaging Tamil puzzles to sharpen logical thinking and reasoning skills.',
      amazonUrl: '#',
      amazonInUrl: 'https://www.amazon.in/Sinthanayai-Thoondum-Puthirgal-%E0%AE%9A%E0%AE%BF%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AE%A9%E0%AF%88%E0%AE%AF%E0%AF%88-%E0%AE%AA%E0%AF%81%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D/dp/B0CLZMY9VX?ref_=ast_author_dp_rw&th=1&psc=1&dib=eyJ2IjoiMSJ9.5QJTOturg2CiKjoLqM5crzPUnFR6lx2mfF9GhNGIiPd5Q15U0nrWSIZR1KIGxUEV2LB6i6ZEgE2fvVrThNSCxVLSqH2nK8NXP59n7znYAJI.v1IYAPsRu6R3O6-UBeE2_sPRlyWGwweyTKdWhgb9anw&dib_tag=AUTHOR',
      image: '/books/Tamil Puzzle book 3d cover.png',
      displaySize: 'a5-small'
    }
  ];

  getImageSizeClass(book: Book): string {
    return book.displaySize || '';
  }

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

  buyOnAmazonIndia(book: Book): void {
    if (book.amazonInUrl && book.amazonInUrl !== '#') {
      window.open(book.amazonInUrl, '_blank');
    } else {
      alert('Amazon India link coming soon for this book!');
    }
  }
}
