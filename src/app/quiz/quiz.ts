import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService, Question } from '../services/quiz.service';

interface QuizState {
  currentQuestion: number;
  score: number;
  totalAnswered: number;
  correctAnswers: number;
  currentDifficulty: number; // 1-9 scale
  streak: number;
  isComplete: boolean;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css']
})
export class Quiz implements OnInit {
  quizState: QuizState = {
    currentQuestion: 0,
    score: 0,
    totalAnswered: 0,
    correctAnswers: 0,
    currentDifficulty: 1, // Start at level 1
    streak: 0,
    isComplete: false
  };

  selectedAnswers: Set<number> = new Set();
  showExplanation = false;
  hasAnswered = false;

  currentQuestions: Question[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.generateQuestions();
  }

  generateQuestions(): void {
    // Start with difficulty level 1-2
    this.currentQuestions = this.getQuestionsByDifficultyRange(1, 2, 1);
  }

  getQuestionsByDifficultyRange(minDiff: number, maxDiff: number, count: number): Question[] {
    const filtered = this.quizService.getQuestionsByDifficultyRange(minDiff, maxDiff);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  get currentQuestion(): Question | null {
    return this.currentQuestions[this.quizState.currentQuestion] || null;
  }

  toggleAnswer(index: number): void {
    if (this.hasAnswered) return;
    
    if (this.selectedAnswers.has(index)) {
      this.selectedAnswers.delete(index);
    } else {
      this.selectedAnswers.add(index);
    }
  }

  isAnswerSelected(index: number): boolean {
    return this.selectedAnswers.has(index);
  }

  isAnswerCorrect(index: number): boolean {
    return this.currentQuestion?.correctAnswers.includes(index) || false;
  }

  submitAnswer(): void {
    if (this.selectedAnswers.size === 0 || this.hasAnswered) return;

    this.hasAnswered = true;
    this.showExplanation = true;

    // Check if all correct answers are selected and no wrong answers
    const correctAnswers = new Set(this.currentQuestion?.correctAnswers || []);
    const correct = 
      this.selectedAnswers.size === correctAnswers.size &&
      Array.from(this.selectedAnswers).every(ans => correctAnswers.has(ans));

    if (correct) {
      this.quizState.correctAnswers++;
      this.quizState.streak++;
      
      // Award points based on difficulty
      const points = this.getDifficultyPoints(this.quizState.currentDifficulty);
      this.quizState.score += points;
    } else {
      this.quizState.streak = 0;
    }
  }

  getDifficultyPoints(difficulty: number): number {
    // Base points: 10 * difficulty level
    const basePoints = difficulty * 10;
    
    // Bonus points for streak (max 50)
    const streakBonus = Math.min(this.quizState.streak * 5, 50);
    
    return basePoints + streakBonus;
  }

  adaptDifficulty(): void {
    const accuracy = this.quizState.correctAnswers / this.quizState.totalAnswered;

    // Increase difficulty if performing well
    if (this.quizState.streak >= 3 && this.quizState.currentDifficulty < 9) {
      this.quizState.currentDifficulty = Math.min(this.quizState.currentDifficulty + 2, 9);
    } else if (accuracy >= 0.75 && this.quizState.currentDifficulty < 9) {
      this.quizState.currentDifficulty = Math.min(this.quizState.currentDifficulty + 1, 9);
    }
    // Decrease difficulty if struggling
    else if (accuracy < 0.4 && this.quizState.currentDifficulty > 1) {
      this.quizState.currentDifficulty = Math.max(this.quizState.currentDifficulty - 2, 1);
    } else if (accuracy < 0.6 && this.quizState.currentDifficulty > 1) {
      this.quizState.currentDifficulty = Math.max(this.quizState.currentDifficulty - 1, 1);
    }
  }

  nextQuestion(): void {
    // Increment totalAnswered when moving to next question
    this.quizState.totalAnswered++;
    
    // Adapt difficulty based on performance after answering
    this.adaptDifficulty();
    
    this.selectedAnswers.clear();
    this.showExplanation = false;
    this.hasAnswered = false;

    // Check if we've answered enough questions (10 questions per quiz)
    if (this.quizState.totalAnswered >= 10) {
      this.quizState.isComplete = true;
      // Save performance
      this.quizService.savePerformance({
        score: this.quizState.score,
        totalQuestions: this.quizState.totalAnswered,
        correctAnswers: this.quizState.correctAnswers,
        accuracy: this.getAccuracy(),
        avgDifficulty: `Level ${this.quizState.currentDifficulty}`
      });
      return;
    }

    // Generate next question based on adapted difficulty (±1 level for variety)
    const minDiff = Math.max(1, this.quizState.currentDifficulty - 1);
    const maxDiff = Math.min(9, this.quizState.currentDifficulty + 1);
    const nextQuestions = this.getQuestionsByDifficultyRange(minDiff, maxDiff, 1);
    
    if (nextQuestions.length > 0) {
      this.currentQuestions.push(nextQuestions[0]);
      this.quizState.currentQuestion++;
    } else {
      this.quizState.isComplete = true;
      // Save performance even if quiz ends early
      this.quizService.savePerformance({
        score: this.quizState.score,
        totalQuestions: this.quizState.totalAnswered,
        correctAnswers: this.quizState.correctAnswers,
        accuracy: this.getAccuracy(),
        avgDifficulty: `Level ${this.quizState.currentDifficulty}`
      });
    }
  }

  restartQuiz(): void {
    this.quizState = {
      currentQuestion: 0,
      score: 0,
      totalAnswered: 0,
      correctAnswers: 0,
      currentDifficulty: 1,
      streak: 0,
      isComplete: false
    };
    this.selectedAnswers.clear();
    this.showExplanation = false;
    this.hasAnswered = false;
    this.currentQuestions = [];
    this.generateQuestions();
  }

  getAccuracy(): number {
    return this.quizState.totalAnswered > 0 
      ? Math.round((this.quizState.correctAnswers / this.quizState.totalAnswered) * 100) 
      : 0;
  }

  getDifficultyColor(difficulty: number | string): string {
    const level = typeof difficulty === 'string' ? parseInt(difficulty.replace('Level ', '')) : difficulty;
    
    if (level <= 2) return '#10b981'; // Green
    if (level <= 4) return '#84cc16'; // Light green
    if (level <= 6) return '#f59e0b'; // Orange
    if (level <= 8) return '#ef4444'; // Red
    return '#991b1b'; // Dark red
  }

  getDifficultyLabel(difficulty: number): string {
    if (difficulty <= 2) return 'Very Easy';
    if (difficulty <= 4) return 'Easy';
    if (difficulty <= 6) return 'Medium';
    if (difficulty <= 8) return 'Hard';
    return 'Extremely Hard';
  }

  getPerformanceMessage(): string {
    const accuracy = this.getAccuracy();
    if (accuracy >= 90) return 'Outstanding! You\'re a chess master! 👑';
    if (accuracy >= 75) return 'Excellent work! Keep it up! 🌟';
    if (accuracy >= 60) return 'Good job! You\'re improving! 💪';
    if (accuracy >= 40) return 'Not bad! Keep practicing! 📚';
    return 'Keep learning! You\'ll get better! 🎯';
  }
}
