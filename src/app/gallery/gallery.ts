import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: 'tournament' | 'class' | 'event' | 'achievement';
  image: string;
  date: Date;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class Gallery {
  categories = [
    { id: 'all', name: 'All', icon: '🎨' },
    { id: 'tournament', name: 'Tournaments', icon: '🏆' },
    { id: 'class', name: 'Classes', icon: '📚' },
    { id: 'event', name: 'Events', icon: '🎉' },
    { id: 'achievement', name: 'Achievements', icon: '⭐' }
  ];

  selectedCategory: string = 'all';

  galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'State Championship 2025',
      description: 'Our students dominated the state championship, winning 5 medals including 2 gold!',
      category: 'tournament',
      image: '🏆',
      date: new Date('2025-11-15')
    },
    {
      id: 2,
      title: 'Beginner Class Session',
      description: 'New students learning the basics of chess in our interactive beginner program',
      category: 'class',
      image: '♟️',
      date: new Date('2025-11-10')
    },
    {
      id: 3,
      title: 'Annual Chess Festival',
      description: 'Hundreds of chess enthusiasts gathered for our annual festival with simultaneous exhibitions',
      category: 'event',
      image: '🎪',
      date: new Date('2025-10-28')
    },
    {
      id: 4,
      title: 'First FIDE Rating Achievement',
      description: 'Celebrating Emily\'s first FIDE rating of 1850 after just 18 months of training!',
      category: 'achievement',
      image: '🌟',
      date: new Date('2025-10-20')
    },
    {
      id: 5,
      title: 'Advanced Tactics Workshop',
      description: 'GM Petrov conducting an intensive tactics training session with advanced students',
      category: 'class',
      image: '🎯',
      date: new Date('2025-10-15')
    },
    {
      id: 6,
      title: 'Regional Team Championship',
      description: 'Our team secured 1st place in the regional championship with a perfect score!',
      category: 'tournament',
      image: '🥇',
      date: new Date('2025-10-05')
    },
    {
      id: 7,
      title: 'Chess & Pizza Night',
      description: 'Monthly social event where students play casual games and build friendships',
      category: 'event',
      image: '🍕',
      date: new Date('2025-09-30')
    },
    {
      id: 8,
      title: 'Junior Championship Winners',
      description: 'Three of our juniors qualified for the National Junior Championship',
      category: 'achievement',
      image: '👦',
      date: new Date('2025-09-25')
    },
    {
      id: 9,
      title: 'Endgame Masterclass',
      description: 'IM Chen teaching critical endgame positions to intermediate students',
      category: 'class',
      image: '♚',
      date: new Date('2025-09-20')
    },
    {
      id: 10,
      title: 'Simultaneous Exhibition',
      description: 'GM Petrov played 20 opponents simultaneously, showcasing chess mastery',
      category: 'event',
      image: '👨‍🏫',
      date: new Date('2025-09-10')
    },
    {
      id: 11,
      title: 'Online Blitz Tournament',
      description: 'Over 100 participants in our monthly online blitz championship',
      category: 'tournament',
      image: '⚡',
      date: new Date('2025-08-28')
    },
    {
      id: 12,
      title: 'Opening Repertoire Workshop',
      description: 'Building complete opening systems for competitive play',
      category: 'class',
      image: '📖',
      date: new Date('2025-08-15')
    },
    {
      id: 13,
      title: 'First Tournament Win',
      description: 'David won his first-ever tournament after 6 months of dedication',
      category: 'achievement',
      image: '🎊',
      date: new Date('2025-08-10')
    },
    {
      id: 14,
      title: 'Summer Chess Camp',
      description: 'Intensive 2-week summer camp with daily training and activities',
      category: 'event',
      image: '☀️',
      date: new Date('2025-07-15')
    },
    {
      id: 15,
      title: 'Club Championship Finals',
      description: 'Exciting final round of our internal club championship',
      category: 'tournament',
      image: '♔',
      date: new Date('2025-07-01')
    }
  ];

  selectedImage: GalleryItem | null = null;

  constructor() {}

  filterGallery(category: string): void {
    this.selectedCategory = category;
  }

  get filteredItems(): GalleryItem[] {
    if (this.selectedCategory === 'all') {
      return this.galleryItems;
    }
    return this.galleryItems.filter(item => item.category === this.selectedCategory);
  }

  openImage(item: GalleryItem): void {
    this.selectedImage = item;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  navigateImage(direction: 'prev' | 'next'): void {
    if (!this.selectedImage) return;
    
    const currentIndex = this.filteredItems.findIndex(item => item.id === this.selectedImage!.id);
    let newIndex: number;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.filteredItems.length - 1;
    } else {
      newIndex = currentIndex < this.filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    this.selectedImage = this.filteredItems[newIndex];
  }
}
