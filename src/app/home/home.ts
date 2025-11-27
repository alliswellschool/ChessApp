import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

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
  activities: Activity[] = [
    {
      id: 'dominance',
      title: 'Dominance',
      description: 'Master board control by dominating all squares with minimal pieces',
      icon: '♕',
      route: '/dominance'
    },
    {
      id: 'independence',
      title: 'Independence',
      description: 'Solve classic puzzles where pieces must not attack each other',
      icon: '♛',
      route: '/independents'
    },
    {
      id: 'coordinates',
      title: 'Coordinates',
      description: 'Train your speed in recognizing chess board coordinates',
      icon: '⚐',
      route: '/coordinates'
    },
    {
      id: 'knights-tour',
      title: "Knight's Tour",
      description: 'Guide the knight to visit every square exactly once',
      icon: '♞',
      route: '/knights-tour'
    },
    {
      id: 'quiz',
      title: 'Adaptive Quiz',
      description: 'Test your chess knowledge with adaptive difficulty',
      icon: '🧠',
      route: '/quiz'
    },
    {
      id: 'puzzles',
      title: 'Puzzles',
      description: 'Collection of various chess puzzles and challenges',
      icon: '🧩',
      route: '/puzzles'
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      description: 'Manage quiz questions, import from Excel, and view analytics',
      icon: '🔧',
      route: '/admin'
    }
  ];

  announcements: Announcement[] = [
    {
      id: 1,
      title: 'Welcome to Chess Activities!',
      content: 'Start your chess learning journey with our interactive activities and puzzles.',
      date: new Date('2025-11-27'),
      type: 'info'
    },
    {
      id: 2,
      title: 'New Feature: Adaptive Quiz',
      content: 'Try our new adaptive quiz system that adjusts difficulty based on your performance!',
      date: new Date('2025-11-27'),
      type: 'success'
    },
    {
      id: 3,
      title: "Knight's Tour Available",
      content: 'Challenge yourself with the classic Knight\'s Tour puzzle.',
      date: new Date('2025-11-27'),
      type: 'info'
    }
  ];

  constructor() {}
}
