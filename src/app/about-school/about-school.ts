import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ClassSchedule {
  id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: string;
  coach: string;
  duration: string;
  schedule: string[];
  price: number;
  priceType: 'month' | 'session';
  capacity: number;
  enrolled: number;
  description: string;
  topics: string[];
  startDate: Date;
  mode: 'online' | 'offline' | 'hybrid';
  icon: string;
}

@Component({
  selector: 'app-about-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './about-school.html',
  styleUrls: ['./about-school.css']
})
export class AboutSchool {
  selectedLevel: string = 'all';
  selectedMode: string = 'all';
  selectedClass: ClassSchedule | null = null;

  levelFilters = [
    { id: 'all', name: 'All Levels', icon: '📚' },
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'intermediate', name: 'Intermediate', icon: '📈' },
    { id: 'advanced', name: 'Advanced', icon: '🎯' }
  ];

  modeFilters = [
    { id: 'all', name: 'All Modes' },
    { id: 'online', name: 'Online' },
    { id: 'offline', name: 'In-Person' },
    { id: 'hybrid', name: 'Hybrid' }
  ];

  schoolInfo = {
    name: 'All is Well School of Chess',
    founded: '2013',
    mission: 'To nurture chess talent and develop strategic thinking skills in students of all ages through comprehensive training programs, helping students build strong fundamentals, strategic thinking, and confidence at the board.',
    vision: 'To help every student discover the joy of chess and the life skills it inspires through structured, learner-centric approach that develops not just chess players, but strategic thinkers and confident individuals.',
    achievements: [
      { icon: '👥', title: 'Students Trained', count: '400+', description: 'Beginners and intermediate players worldwide' },
      { icon: '🎓', title: 'Years of Excellence', count: '11+', description: 'Since 2013' },
      { icon: '🌍', title: 'Global Reach', count: 'Worldwide', description: 'Online and in-person classes' },
      { icon: '⭐', title: 'Amazing Testimonials', count: 'Many', description: 'From parents and students' }
    ],
    facilities: [
      { name: 'Online & In-Person Classes', description: 'Flexible learning options to suit your schedule and preference' },
      { name: 'Tournament Organization', description: 'Regular online and offline tournaments for practical experience' },
      { name: 'Soft Skills Integration', description: 'Activity-based workshops blending chess with leadership and communication skills' },
      { name: 'Train the Trainer Program', description: 'Support for aspiring coaches to develop teaching skills and launch coaching careers' }
    ],
    values: [
      { title: 'Strong Foundation', description: 'Building solid fundamentals through structured, analytical teaching methods' },
      { title: 'Learner-Centric', description: 'Every student receives personalized attention and guidance' },
      { title: 'Holistic Development', description: 'Integrating chess education with soft skills and leadership training' },
      { title: 'Joy of Learning', description: 'Making chess education engaging, meaningful, and inspiring' }
    ]
  };

  classes: ClassSchedule[] = [
    {
      id: 1,
      name: 'Chess Fundamentals',
      level: 'beginner',
      ageGroup: '6-10 years',
      coach: 'FM Rajesh Kumar',
      duration: '8 weeks',
      schedule: ['Monday 4:00 PM', 'Wednesday 4:00 PM'],
      price: 120,
      priceType: 'month',
      capacity: 12,
      enrolled: 9,
      description: 'Perfect for children starting their chess journey. Learn basic moves, tactics, and opening principles in a fun, interactive environment.',
      topics: ['Piece movements', 'Basic tactics', 'Checkmate patterns', 'Opening principles', 'Simple endgames'],
      startDate: new Date('2026-02-01'),
      mode: 'hybrid',
      icon: '♟️'
    },
    {
      id: 2,
      name: 'Tactical Training Boot Camp',
      level: 'intermediate',
      ageGroup: '11-16 years',
      coach: 'IM Sarah Chen',
      duration: '6 weeks',
      schedule: ['Tuesday 5:00 PM', 'Thursday 5:00 PM'],
      price: 35,
      priceType: 'session',
      capacity: 15,
      enrolled: 12,
      description: 'Intensive tactical training to sharpen your calculation skills. Solve hundreds of puzzles and learn tactical motifs.',
      topics: ['Pins & forks', 'Discovered attacks', 'Skewers', 'Deflection', 'Combination play'],
      startDate: new Date('2026-02-05'),
      mode: 'online',
      icon: '⚡'
    },
    {
      id: 3,
      name: 'Advanced Strategy Masterclass',
      level: 'advanced',
      ageGroup: 'Adults & Teens (16+)',
      coach: 'GM Alexander Petrov',
      duration: '12 weeks',
      schedule: ['Saturday 10:00 AM'],
      price: 250,
      priceType: 'month',
      capacity: 8,
      enrolled: 6,
      description: 'Deep dive into positional chess with a Grandmaster. Analyze master games and develop advanced strategic understanding.',
      topics: ['Pawn structures', 'Prophylaxis', 'Weak squares', 'Piece coordination', 'Plan formulation'],
      startDate: new Date('2026-02-08'),
      mode: 'offline',
      icon: '👑'
    },
    {
      id: 4,
      name: 'Opening Repertoire Builder',
      level: 'intermediate',
      ageGroup: '12-18 years',
      coach: 'WIM Elena Rodriguez',
      duration: '10 weeks',
      schedule: ['Friday 6:00 PM'],
      price: 180,
      priceType: 'month',
      capacity: 10,
      enrolled: 7,
      description: 'Build a complete opening repertoire tailored to your style. Learn key ideas and typical plans for both White and Black.',
      topics: ['Opening principles', 'Main line theory', 'Sidelines', 'Typical middlegame plans', 'Transpositions'],
      startDate: new Date('2026-02-07'),
      mode: 'online',
      icon: '📖'
    },
    {
      id: 5,
      name: 'Endgame Excellence',
      level: 'intermediate',
      ageGroup: 'All ages (12+)',
      coach: 'IM Sarah Chen',
      duration: '8 weeks',
      schedule: ['Wednesday 7:00 PM'],
      price: 160,
      priceType: 'month',
      capacity: 12,
      enrolled: 10,
      description: 'Master essential endgame positions. From basic king and pawn endings to complex rook endgames.',
      topics: ['King & pawn endgames', 'Rook endgames', 'Minor piece endgames', 'Theoretical positions', 'Practical techniques'],
      startDate: new Date('2026-02-06'),
      mode: 'hybrid',
      icon: '♔'
    },
    {
      id: 6,
      name: 'Tournament Preparation Workshop',
      level: 'advanced',
      ageGroup: 'Competitive players',
      coach: 'GM Alexander Petrov',
      duration: '4 weeks',
      schedule: ['Sunday 2:00 PM'],
      price: 50,
      priceType: 'session',
      capacity: 6,
      enrolled: 4,
      description: 'Get ready for your next tournament. Opening preparation, time management, psychological aspects, and post-game analysis.',
      topics: ['Pre-game preparation', 'Time management', 'Psychology', 'Critical positions', 'Game analysis'],
      startDate: new Date('2026-02-09'),
      mode: 'offline',
      icon: '🏆'
    },
    {
      id: 7,
      name: 'Junior Chess Champions',
      level: 'beginner',
      ageGroup: '8-12 years',
      coach: 'CM David Thompson',
      duration: '12 weeks',
      schedule: ['Tuesday 4:00 PM', 'Thursday 4:00 PM'],
      price: 100,
      priceType: 'month',
      capacity: 15,
      enrolled: 13,
      description: 'Fun and engaging chess program for juniors. Learn through games, puzzles, and friendly competitions.',
      topics: ['Chess basics', 'Tactical puzzles', 'Mini-tournaments', 'Chess etiquette', 'Sportsmanship'],
      startDate: new Date('2026-02-04'),
      mode: 'offline',
      icon: '👦'
    },
    {
      id: 8,
      name: 'Adult Beginner\'s Course',
      level: 'beginner',
      ageGroup: 'Adults (18+)',
      coach: 'NM Lisa Anderson',
      duration: '10 weeks',
      schedule: ['Saturday 6:00 PM'],
      price: 140,
      priceType: 'month',
      capacity: 10,
      enrolled: 8,
      description: 'Never too late to learn chess! Comprehensive course designed for adult learners at a comfortable pace.',
      topics: ['Rules & notation', 'Basic strategy', 'Common tactics', 'Simple endgames', 'Playing practice'],
      startDate: new Date('2026-02-08'),
      mode: 'online',
      icon: '🧑'
    },
    {
      id: 9,
      name: 'Blitz & Rapid Chess Training',
      level: 'intermediate',
      ageGroup: 'All ages (14+)',
      coach: 'FM Rajesh Kumar',
      duration: '6 weeks',
      schedule: ['Friday 8:00 PM'],
      price: 25,
      priceType: 'session',
      capacity: 20,
      enrolled: 16,
      description: 'Improve your fast chess skills. Learn time management, pattern recognition, and quick decision-making.',
      topics: ['Time management', 'Quick evaluation', 'Pattern recognition', 'Intuition', 'Practical play'],
      startDate: new Date('2026-02-07'),
      mode: 'online',
      icon: '⚡'
    }
  ];

  constructor() {}

  get filteredClasses(): ClassSchedule[] {
    return this.classes.filter(cls => {
      const levelMatch = this.selectedLevel === 'all' || cls.level === this.selectedLevel;
      const modeMatch = this.selectedMode === 'all' || cls.mode === this.selectedMode;
      return levelMatch && modeMatch;
    });
  }

  filterByLevel(level: string): void {
    this.selectedLevel = level;
  }

  filterByMode(mode: string): void {
    this.selectedMode = mode;
  }

  viewClassDetails(cls: ClassSchedule): void {
    this.selectedClass = cls;
  }

  closeDetails(): void {
    this.selectedClass = null;
  }

  enrollInClass(cls: ClassSchedule): void {
    alert(`Enrollment request submitted for "${cls.name}"! Our team will contact you shortly.`);
  }

  getAvailability(cls: ClassSchedule): string {
    const available = cls.capacity - cls.enrolled;
    if (available === 0) return 'Full';
    if (available <= 3) return `Only ${available} spots left`;
    return `${available} spots available`;
  }

  getModeIcon(mode: string): string {
    switch (mode) {
      case 'online': return '💻';
      case 'offline': return '🏫';
      case 'hybrid': return '🔄';
      default: return '📚';
    }
  }

  getModeColor(mode: string): string {
    switch (mode) {
      case 'online': return '#3498db';
      case 'offline': return '#e74c3c';
      case 'hybrid': return '#9b59b6';
      default: return '#95a5a6';
    }
  }
}
