import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService, UserProgress } from '../services/progress.service';
import { AuthService } from '../services/auth.service';
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

export class Puzzles implements OnInit {
  private progressService = inject(ProgressService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  
  userProgress: UserProgress = {};
  isLoggedIn = false;
  isLoading = true;
  
  // Make Math available in template
  Math = Math;

  // Total puzzles available per activity (adjust based on your actual counts)
  totalPuzzles: Record<string, number> = {
    'coordinates': 999, // Infinite practice
    'knights-tour': 1, // One main challenge
    'capture-the-shapes': 20, // Based on your puzzles array
    'independence': 30, // 5 pieces x 5 sizes + team mode
    'dominance': 30, // 6 pieces x 5 sizes
    'quiz': 999 // Infinite quizzes
  };

  activities: Activity[] = [
    {
      id: 'coordinates',
      title: 'Coordinates',
      description: 'Train your speed in recognizing chess board coordinates',
      icon: '🎯',
      route: '/coordinates'
    },
    {
      id: 'knights-tour',
      title: "Knight's Tour",
      description: 'Guide the knight to visit every square exactly once',
      icon: '♘',
      route: '/knights-tour'
    },
    {
      id: 'capture-the-shapes',
      title: 'Capture the Shapes',
      description: 'Place pieces strategically to capture all target shapes',
      icon: '🔷',
      route: '/capture-the-shapes'
    },
    {
      id: 'independence',
      title: 'Independence',
      description: 'Solve classic puzzles where pieces must not attack each other',
      icon: '👑',
      route: '/independence'
    },
    {
      id: 'dominance',
      title: 'Dominance',
      description: 'Master board control by dominating all squares with minimal pieces',
      icon: '⚔️',
      route: '/dominance'
    },
    {
      id: 'quiz',
      title: 'Adaptive Quiz',
      description: 'Test your chess knowledge with adaptive difficulty',
      icon: '🧠',
      route: '/quiz'
    }
  ];

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.isLoggedIn = this.authService.currentUser() !== null;
      
      if (this.isLoggedIn) {
        // Wait a bit for Firebase to initialize if needed
        await new Promise(resolve => setTimeout(resolve, 100));
        this.userProgress = await this.progressService.getAllProgress();
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      this.isLoading = false;
      // Force change detection
      this.cdr.detectChanges();
    }
  }

  getProgress(puzzleKey: string): number {
    const key = puzzleKey as keyof UserProgress;
    return this.userProgress[key]?.completed || 0;
  }

  getTotalPuzzles(activityId: string): number {
    return this.totalPuzzles[activityId] || 0;
  }

  getCompletedPuzzles(activityId: string): number {
    const key = this.toCamelCase(activityId) as keyof UserProgress;
    const progressData = this.userProgress[key];
    
    if (!progressData) return 0;
    
    // Try completedPuzzles array length first, then completed property
    if (progressData.completedPuzzles && Array.isArray(progressData.completedPuzzles)) {
      return progressData.completedPuzzles.length;
    }
    
    return progressData.completed || 0;
  }

  getProgressPercentage(activityId: string): number {
    const completed = this.getCompletedPuzzles(activityId);
    const total = this.getTotalPuzzles(activityId);
    
    if (!total || total === 0) return 0;
    if (!completed || completed === 0) return 0;
    
    // Calculate and round to whole number
    const percentage = Math.round((completed / total) * 100);
    
    // Cap at 100%
    return Math.min(percentage, 100);
  }

  isActivityComplete(activityId: string): boolean {
    const completed = this.getCompletedPuzzles(activityId);
    const total = this.getTotalPuzzles(activityId);
    
    if (!total || total === 0) return false;
    
    return completed >= total;
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

}
