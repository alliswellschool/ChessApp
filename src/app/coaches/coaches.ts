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
      name: 'Praveen Sadasivam',
      title: 'Certified Chess Coach & Author',
      rating: 'IIT Madras Graduate',
      specialization: ['Beginner Training', 'Intermediate Strategy', 'Train the Trainer', 'Soft Skills & Leadership'],
      experience: '10+ years',
      achievements: [
        'Trained 400+ students worldwide',
        'Author of 5 published chess books',
        'Created distinctive "Train the Trainer" program',
        'Organized numerous online and offline tournaments',
        'Conducts activity-based soft skills and leadership workshops',
        'Former software professional bringing analytical clarity to chess education'
      ],
      bio: 'Praveen Sadasivam is an IIT Madras graduate and software professional who brings analytical clarity and a deep passion for teaching into the world of chess education. As a certified chess coach and published author, he has trained over 400 beginner and intermediate players across the globe, helping students build strong fundamentals, strategic thinking, and confidence at the board. Beyond chess, Praveen conducts activity-based soft skills and leadership workshops, blending strategy, communication, and personal development into engaging learning experiences for corporates and students of all ages. With a unique mix of technical expertise, coaching experience, and a learner-centric approach, Praveen is committed to helping every student discover the joy of chess and the life skills it inspires.',
      image: '👨‍🏫'
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
