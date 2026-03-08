import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressService, UserProgress } from '../services/progress.service';
import { AuthService } from '../services/auth.service';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface ActivityCardView extends Activity {
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
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
  private destroyRef = inject(DestroyRef);
  
  userProgress: UserProgress = {};
  activityCards: ActivityCardView[] = [];
  isLoggedIn = false;
  isLoading = true;

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
    this.isLoggedIn = this.authService.isAuthenticated();
    this.buildActivityCards();

    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.isLoggedIn = !!user;

        if (!this.isLoggedIn) {
          this.userProgress = {};
          this.isLoading = false;
          this.buildActivityCards();
          return;
        }

        void this.loadProgress();
      });
  }

  private async loadProgress(): Promise<void> {
    this.isLoading = true;
    try {
      this.userProgress = await this.progressService.getAllProgress();
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      this.isLoading = false;
      this.buildActivityCards();
    }
  }

  private getCompletedPuzzles(activityId: string): number {
    const key = this.toCamelCase(activityId) as keyof UserProgress;
    const progressData = this.userProgress[key];
    
    if (!progressData) return 0;

    const completedFromCounter = progressData.completed || 0;
    const completedFromList = Array.isArray(progressData.completedPuzzles)
      ? progressData.completedPuzzles.length
      : 0;

    return Math.max(completedFromCounter, completedFromList);
  }

  private buildActivityCards(): void {
    this.activityCards = this.activities.map((activity) => {
      const total = this.totalPuzzles[activity.id] || 0;
      const completed = this.getCompletedPuzzles(activity.id);
      const percentage = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

      return {
        ...activity,
        completed,
        total,
        percentage,
        isComplete: total > 0 && completed >= total
      };
    });
  }

  trackByActivityId(_: number, activity: ActivityCardView): string {
    return activity.id;
  }

  isFinitePuzzle(total: number): boolean {
    return total < 999;
  }
    
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

}
