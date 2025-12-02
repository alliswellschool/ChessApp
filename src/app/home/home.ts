import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  
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
