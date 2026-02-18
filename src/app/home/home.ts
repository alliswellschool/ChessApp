import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: Date;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  
  announcements: Announcement[] = [
    {
      id: 1,
      title: 'New Interactive Chess Puzzles Available!',
      content: 'We\'ve added over 200 new tactical puzzles with detailed explanations. Start challenging yourself today!',
      date: new Date('2026-02-18'),
      type: 'success'
    },
    {
      id: 2,
      title: 'Adaptive Quiz System Launch',
      content: 'Our new AI-powered adaptive quiz system now adjusts difficulty based on your performance for optimal learning.',
      date: new Date('2026-02-16'),
      type: 'success'
    },
    {
      id: 3,
      title: 'Spring Chess Challenge Started',
      content: 'Join our exciting spring chess challenge with prizes and recognition for top performers!',
      date: new Date('2026-02-14'),
      type: 'info'
    }
  ];

  constructor() {}
}
