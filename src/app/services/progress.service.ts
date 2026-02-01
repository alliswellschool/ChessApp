import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  increment,
  serverTimestamp
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface PuzzleStats {
  completed: number;
  totalTime?: number;
  bestTime?: number;
  bestScore?: number;
  lastPlayed?: any;
  completedPuzzles?: number[]; // Array of puzzle IDs or level numbers
}

export interface UserProgress {
  coordinates?: PuzzleStats;
  knightsTour?: PuzzleStats;
  captureTheShapes?: PuzzleStats;
  independence?: PuzzleStats;
  dominance?: PuzzleStats;
  quiz?: PuzzleStats;
  totalPuzzles?: number;
  lastUpdated?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  /**
   * Track puzzle completion
   * @param puzzleType - Type of puzzle (coordinates, knightsTour, etc.)
   * @param data - Additional stats like time, score, level
   */
  async trackCompletion(
    puzzleType: string,
    data: {
      time?: number;
      score?: number;
      level?: number;
      puzzleId?: number;
    } = {}
  ): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) {
      console.log('No user logged in, skipping progress tracking');
      return;
    }

    try {
      const progressRef = doc(
        this.firestore,
        `userProgress/${user.uid}/puzzles/${puzzleType}`
      );

      const progressDoc = await getDoc(progressRef);
      const currentData = progressDoc.data() as PuzzleStats | undefined;

      const updates: any = {
        completed: increment(1),
        lastPlayed: serverTimestamp()
      };

      // Track time if provided
      if (data.time !== undefined) {
        updates.totalTime = increment(data.time);
        if (!currentData?.bestTime || data.time < currentData.bestTime) {
          updates.bestTime = data.time;
        }
      }

      // Track score if provided
      if (data.score !== undefined) {
        if (!currentData?.bestScore || data.score > currentData.bestScore) {
          updates.bestScore = data.score;
        }
      }

      // Track specific puzzle/level completion
      if (data.puzzleId !== undefined || data.level !== undefined) {
        const puzzleId = data.puzzleId ?? data.level!;
        const completedPuzzles = currentData?.completedPuzzles || [];
        if (!completedPuzzles.includes(puzzleId)) {
          updates.completedPuzzles = [...completedPuzzles, puzzleId];
        }
      }

      await setDoc(progressRef, updates, { merge: true });

      // Update total puzzles count in main progress doc
      const mainProgressRef = doc(this.firestore, `userProgress/${user.uid}`);
      await setDoc(
        mainProgressRef,
        {
          totalPuzzles: increment(1),
          lastUpdated: serverTimestamp()
        },
        { merge: true }
      );

      console.log(`Progress tracked for ${puzzleType}:`, updates);
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  }

  /**
   * Get user's progress for a specific puzzle type
   */
  async getPuzzleProgress(puzzleType: string): Promise<PuzzleStats | null> {
    const user = this.authService.currentUser();
    if (!user) return null;

    try {
      const progressRef = doc(
        this.firestore,
        `userProgress/${user.uid}/puzzles/${puzzleType}`
      );
      const progressDoc = await getDoc(progressRef);
      return progressDoc.exists() ? (progressDoc.data() as PuzzleStats) : null;
    } catch (error) {
      console.error('Error getting puzzle progress:', error);
      return null;
    }
  }

  /**
   * Get all user progress
   */
  async getAllProgress(): Promise<UserProgress> {
    const user = this.authService.currentUser();
    if (!user) return {};

    try {
      const puzzleTypes = [
        'coordinates',
        'knightsTour',
        'captureTheShapes',
        'independence',
        'dominance',
        'quiz'
      ];

      const progress: UserProgress = {};

      // Get main progress doc
      const mainProgressRef = doc(this.firestore, `userProgress/${user.uid}`);
      const mainDoc = await getDoc(mainProgressRef);
      if (mainDoc.exists()) {
        const data = mainDoc.data();
        progress.totalPuzzles = data['totalPuzzles'];
        progress.lastUpdated = data['lastUpdated'];
      }

      // Get individual puzzle progress
      for (const type of puzzleTypes) {
        const stats = await this.getPuzzleProgress(type);
        if (stats) {
          progress[type as keyof UserProgress] = stats;
        }
      }

      return progress;
    } catch (error) {
      console.error('Error getting all progress:', error);
      return {};
    }
  }

  /**
   * Check if a specific puzzle/level has been completed
   */
  async isPuzzleCompleted(puzzleType: string, puzzleId: number): Promise<boolean> {
    const stats = await this.getPuzzleProgress(puzzleType);
    return stats?.completedPuzzles?.includes(puzzleId) || false;
  }

  /**
   * Get completion percentage for a puzzle type
   */
  async getCompletionPercentage(puzzleType: string, totalPuzzles: number): Promise<number> {
    const stats = await this.getPuzzleProgress(puzzleType);
    if (!stats || !stats.completedPuzzles) return 0;
    return Math.round((stats.completedPuzzles.length / totalPuzzles) * 100);
  }

  /**
   * Reset progress for a specific puzzle type (for testing/admin)
   */
  async resetPuzzleProgress(puzzleType: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      const progressRef = doc(
        this.firestore,
        `userProgress/${user.uid}/puzzles/${puzzleType}`
      );
      await setDoc(progressRef, {
        completed: 0,
        completedPuzzles: [],
        lastPlayed: serverTimestamp()
      });
      console.log(`Reset progress for ${puzzleType}`);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }
}
