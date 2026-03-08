import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
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
  private readonly cacheTtlMs = 60_000;
  private progressCache = new Map<string, { data: UserProgress; fetchedAt: number }>();
  private inFlightRequests = new Map<string, Promise<UserProgress>>();

  private getProgressKey(puzzleType: string): keyof UserProgress {
    const camelCaseKey = puzzleType.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return camelCaseKey as keyof UserProgress;
  }

  private isCacheValid(userId: string): boolean {
    const cached = this.progressCache.get(userId);
    if (!cached) return false;
    return Date.now() - cached.fetchedAt < this.cacheTtlMs;
  }

  private invalidateUserCache(userId: string): void {
    this.progressCache.delete(userId);
    this.inFlightRequests.delete(userId);
  }

  private async fetchAllProgressForUser(userId: string): Promise<UserProgress> {
    const puzzleTypes = ['coordinates', 'knightsTour', 'captureTheShapes', 'independence', 'dominance', 'quiz'];
    const progress: UserProgress = {};

    const mainProgressRef = doc(this.firestore, `userProgress/${userId}`);
    const mainDocPromise = getDoc(mainProgressRef);

    const puzzleDocPromises = puzzleTypes.map(async (type) => {
      const progressRef = doc(this.firestore, `userProgress/${userId}/puzzles/${type}`);
      const progressDoc = await getDoc(progressRef);
      return { type, progressDoc };
    });

    const [mainDoc, puzzleDocs] = await Promise.all([
      mainDocPromise,
      Promise.all(puzzleDocPromises)
    ]);

    if (mainDoc.exists()) {
      const data = mainDoc.data();
      progress.totalPuzzles = data['totalPuzzles'];
      progress.lastUpdated = data['lastUpdated'];
    }

    for (const { type, progressDoc } of puzzleDocs) {
      if (!progressDoc.exists()) continue;
      const key = this.getProgressKey(type);
      progress[key] = progressDoc.data() as PuzzleStats;
    }

    this.progressCache.set(userId, {
      data: progress,
      fetchedAt: Date.now()
    });

    return progress;
  }

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

      this.invalidateUserCache(user.uid);

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

    const key = this.getProgressKey(puzzleType);
    if (this.isCacheValid(user.uid)) {
      const cached = this.progressCache.get(user.uid)!.data;
      return (cached[key] as PuzzleStats | undefined) || null;
    }

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
  async getAllProgress(forceRefresh = false): Promise<UserProgress> {
    const user = this.authService.currentUser();
    if (!user) return {};

    if (!forceRefresh && this.isCacheValid(user.uid)) {
      return this.progressCache.get(user.uid)!.data;
    }

    if (!forceRefresh && this.inFlightRequests.has(user.uid)) {
      return this.inFlightRequests.get(user.uid)!;
    }

    const request = this.fetchAllProgressForUser(user.uid).finally(() => {
      this.inFlightRequests.delete(user.uid);
    });

    this.inFlightRequests.set(user.uid, request);

    try {
      return await request;
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
      this.invalidateUserCache(user.uid);
      console.log(`Reset progress for ${puzzleType}`);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }
}
