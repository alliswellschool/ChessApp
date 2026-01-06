import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-school',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-school.html',
  styleUrls: ['./about-school.css']
})
export class AboutSchool {
  schoolInfo = {
    name: 'Chess Excellence Academy',
    founded: '2020',
    mission: 'To nurture chess talent and develop strategic thinking skills in students of all ages through comprehensive training programs.',
    vision: 'To become a leading chess education institution that produces world-class players and fosters a love for the game.',
    achievements: [
      { icon: '🏆', title: 'National Champions', count: '15+', description: 'Students who won national tournaments' },
      { icon: '👥', title: 'Active Students', count: '500+', description: 'Enrolled in our programs' },
      { icon: '⭐', title: 'Expert Coaches', count: '10+', description: 'FIDE-rated instructors' },
      { icon: '📚', title: 'Programs', count: '20+', description: 'Specialized training courses' }
    ],
    facilities: [
      { name: 'Digital Learning Platform', description: 'Access interactive lessons and puzzles anytime, anywhere' },
      { name: 'Tournament Hall', description: 'Host regular internal and external tournaments' },
      { name: 'Library & Resources', description: 'Extensive collection of chess books and materials' },
      { name: 'Analysis Room', description: 'Equipped with computers for game analysis' }
    ],
    values: [
      { title: 'Excellence', description: 'Striving for the highest standards in chess education' },
      { title: 'Integrity', description: 'Promoting fair play and sportsmanship' },
      { title: 'Innovation', description: 'Using modern teaching methods and technology' },
      { title: 'Community', description: 'Building a supportive chess learning environment' }
    ]
  };

  constructor() {}
}
