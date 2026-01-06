import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Coach {
  id: number;
  name: string;
  title: string;
  rating: string;
  specialization: string[];
  experience: string;
  achievements: string[];
  bio: string;
  image: string;
}

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coaches.html',
  styleUrls: ['./coaches.css']
})
export class Coaches {
  coaches: Coach[] = [
    {
      id: 1,
      name: 'GM Alexander Petrov',
      title: 'International Grandmaster',
      rating: '2650 FIDE',
      specialization: ['Opening Theory', 'Tournament Preparation', 'Advanced Strategy'],
      experience: '20+ years',
      achievements: [
        'World Championship Participant 2018',
        'Coached 5 International Masters',
        'National Champion 2015, 2017'
      ],
      bio: 'GM Petrov brings decades of elite chess experience to our academy. His deep understanding of classical and modern chess makes him an invaluable mentor for advanced players.',
      image: '👨‍🏫'
    },
    {
      id: 2,
      name: 'IM Sarah Chen',
      title: 'International Master',
      rating: '2450 FIDE',
      specialization: ['Youth Development', 'Tactics Training', 'Endgame Mastery'],
      experience: '12+ years',
      achievements: [
        'Youth Chess Coach of the Year 2022',
        'Trained 50+ students to National level',
        'Women\'s Continental Champion 2019'
      ],
      bio: 'IM Chen specializes in developing young talent with her patient and structured approach. Her students consistently achieve breakthrough results.',
      image: '👩‍🏫'
    },
    {
      id: 3,
      name: 'FM Rajesh Kumar',
      title: 'FIDE Master',
      rating: '2350 FIDE',
      specialization: ['Beginner Training', 'Middlegame Strategy', 'Psychology'],
      experience: '15+ years',
      achievements: [
        'Pioneer in Digital Chess Education',
        'Published Author of 3 Chess Books',
        'Founded successful chess clubs in 10 schools'
      ],
      bio: 'FM Kumar makes chess accessible to beginners while maintaining high standards. His innovative teaching methods have helped thousands start their chess journey.',
      image: '👨‍💼'
    },
    {
      id: 4,
      name: 'WIM Elena Rodriguez',
      title: 'Women\'s International Master',
      rating: '2380 FIDE',
      specialization: ['Women\'s Chess', 'Tournament Psychology', 'Opening Preparation'],
      experience: '10+ years',
      achievements: [
        'Women\'s Olympiad Team Member',
        'Continental Women\'s Champion 2020',
        'Mentored 3 Women FIDE Masters'
      ],
      bio: 'WIM Rodriguez is passionate about promoting women\'s chess. Her empowering teaching style has inspired many female players to pursue competitive chess.',
      image: '👩‍💻'
    },
    {
      id: 5,
      name: 'CM David Thompson',
      title: 'Candidate Master',
      rating: '2200 FIDE',
      specialization: ['Junior Chess', 'Puzzle Solving', 'Game Analysis'],
      experience: '8+ years',
      achievements: [
        'Junior Chess Specialist Certification',
        'Created 1000+ training puzzles',
        'State Junior Coach Award 2021'
      ],
      bio: 'CM Thompson connects with junior players through gamification and modern teaching techniques. His enthusiasm makes learning chess fun and engaging.',
      image: '👨‍🎓'
    },
    {
      id: 6,
      name: 'NM Lisa Anderson',
      title: 'National Master',
      rating: '2180 USCF',
      specialization: ['Scholastic Chess', 'Chess in Education', 'Group Classes'],
      experience: '14+ years',
      achievements: [
        'Former School Principal',
        'Integrated chess in 25+ schools',
        'National Excellence in Education Award'
      ],
      bio: 'NM Anderson combines educational pedagogy with chess instruction. Her background in education brings unique insights to chess teaching.',
      image: '👩‍🏫'
    }
  ];

  selectedCoach: Coach | null = null;

  constructor() {}

  viewCoachDetails(coach: Coach): void {
    this.selectedCoach = coach;
  }

  closeDetails(): void {
    this.selectedCoach = null;
  }
}
