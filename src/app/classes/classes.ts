import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  mode: 'Online';
  whatsappLink: string;
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class Classes {
  readonly whatsappLink = 'https://wa.me/919962550573';

  courses: Course[] = [
    {
      id: 'beginner',
      name: 'Beginner',
      subtitle: 'Learn rules, piece movement, and core tactical patterns.',
      icon: '♟',
      level: 'Beginner',
      mode: 'Online',
      whatsappLink: this.whatsappLink
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      subtitle: 'Build calculation, planning, and practical game strategy.',
      icon: '♞',
      level: 'Intermediate',
      mode: 'Online',
      whatsappLink: this.whatsappLink
    },
    {
      id: 'advanced',
      name: 'Advanced',
      subtitle: 'Deep positional play, critical thinking, and game mastery.',
      icon: '♛',
      level: 'Advanced',
      mode: 'Online',
      whatsappLink: this.whatsappLink
    }
  ];
}
