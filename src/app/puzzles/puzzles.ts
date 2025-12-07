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
@Component({
  selector: 'app-puzzles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './puzzles.html',
  styleUrls: ['./puzzles.css']
})

export class Puzzles {

  activities: Activity[] = [
    {
      id: 'independence',
      title: 'Independence',
      description: 'Solve classic puzzles where pieces must not attack each other',
      icon: '♛',
      route: '/independents'
    },
    {
      id: 'dominance',
      title: 'Dominance',
      description: 'Master board control by dominating all squares with minimal pieces',
      icon: '♕',
      route: '/dominance'
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
    }
  ];

}
