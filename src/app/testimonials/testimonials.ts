import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: Date;
  image: string;
  achievement?: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css']
})
export class Testimonials {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Emily Johnson',
      role: 'Student, Age 12',
      rating: 5,
      comment: 'I joined the academy 2 years ago as a complete beginner. Now I\'m a rated player competing in state tournaments! The coaches are patient and make learning fun. The online platform with puzzles and games helped me practice every day.',
      date: new Date('2025-12-15'),
      image: '👧',
      achievement: 'State Champion U-13'
    },
    {
      id: 2,
      name: 'Michael Brown',
      role: 'Parent',
      rating: 5,
      comment: 'My son has been attending classes for 6 months and the transformation is incredible. Not only has his chess improved dramatically, but his concentration, problem-solving, and critical thinking skills have flourished. The academy truly cares about each student\'s development.',
      date: new Date('2025-12-10'),
      image: '👨'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      role: 'Advanced Student',
      rating: 5,
      comment: 'The advanced training program with GM Petrov has taken my game to the next level. The personalized attention, detailed game analysis, and tournament preparation strategies are world-class. Highly recommended for serious players!',
      date: new Date('2025-11-28'),
      image: '👩',
      achievement: 'Achieved FIDE 2000+ Rating'
    },
    {
      id: 4,
      name: 'David Lee',
      role: 'Student, Age 15',
      rating: 5,
      comment: 'The online learning platform is amazing! I can access lessons anytime, solve puzzles, and track my progress. The coaches are always available to review my games and answer questions. Best chess school ever!',
      date: new Date('2025-11-20'),
      image: '🧑',
      achievement: 'National Junior Participant'
    },
    {
      id: 5,
      name: 'Jennifer Martinez',
      role: 'Adult Learner',
      rating: 5,
      comment: 'I always wanted to learn chess but thought I was too old. The academy proved me wrong! The beginner classes are well-structured and the coaches make complex concepts easy to understand. I\'m now playing in local club tournaments and loving it!',
      date: new Date('2025-11-15'),
      image: '👩‍💼'
    },
    {
      id: 6,
      name: 'Robert Chen',
      role: 'Parent & Chess Enthusiast',
      rating: 5,
      comment: 'My daughter and I both take classes here - she in the junior program and me in adult classes. The academy has something for everyone. The community is welcoming, the coaching is professional, and the results speak for themselves.',
      date: new Date('2025-11-05'),
      image: '👨‍👧'
    },
    {
      id: 7,
      name: 'Amanda Taylor',
      role: 'Student, Age 10',
      rating: 5,
      comment: 'Chess is so much fun here! My favorite coach is IM Chen - she explains things really well and is super nice. I love the puzzle competitions and playing with my friends. I want to become a master one day!',
      date: new Date('2025-10-30'),
      image: '👧',
      achievement: 'School Chess Champion'
    },
    {
      id: 8,
      name: 'James Wilson',
      role: 'Competitive Player',
      rating: 5,
      comment: 'The tournament preparation program is exceptional. The coaches help with opening preparation, time management, and psychological aspects of competitive play. Since joining, my tournament results have improved significantly.',
      date: new Date('2025-10-22'),
      image: '🏆',
      achievement: 'Regional Open Winner 2025'
    },
    {
      id: 9,
      name: 'Lisa Anderson',
      role: 'School Teacher',
      rating: 5,
      comment: 'We partnered with the academy to bring chess to our school. The program has been phenomenal! Students are more engaged, their academic performance has improved, and they\'re learning valuable life skills. Highly recommend for schools!',
      date: new Date('2025-10-15'),
      image: '👩‍🏫'
    }
  ];

  stats = {
    totalStudents: 500,
    averageRating: 4.9,
    successStories: 150,
    satisfactionRate: 98
  };

  constructor() {}

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
