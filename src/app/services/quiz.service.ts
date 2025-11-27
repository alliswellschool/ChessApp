import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[]; // Changed to array to support multiple correct answers
  difficulty: number; // Changed to 1-9 scale
  explanation?: string;
}

export interface UserPerformance {
  quizId: string;
  timestamp: Date;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  avgDifficulty: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questionsSubject = new BehaviorSubject<Question[]>(this.loadQuestionsFromStorage());
  private performanceSubject = new BehaviorSubject<UserPerformance[]>(this.loadPerformanceFromStorage());

  questions$ = this.questionsSubject.asObservable();
  performance$ = this.performanceSubject.asObservable();

  private storageKey = 'chess_quiz_questions';
  private performanceKey = 'chess_quiz_performance';

  constructor() {
    // Initialize with default questions if none exist
    if (this.questionsSubject.value.length === 0) {
      this.initializeDefaultQuestions();
    }
  }

  private loadQuestionsFromStorage(): Question[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private loadPerformanceFromStorage(): UserPerformance[] {
    try {
      const stored = localStorage.getItem(this.performanceKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return data.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  private saveQuestionsToStorage(questions: Question[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(questions));
    this.questionsSubject.next(questions);
  }

  private savePerformanceToStorage(performance: UserPerformance[]): void {
    localStorage.setItem(this.performanceKey, JSON.stringify(performance));
    this.performanceSubject.next(performance);
  }

  getQuestions(): Question[] {
    return this.questionsSubject.value;
  }

  getQuestionsByDifficulty(difficulty: number): Question[] {
    return this.questionsSubject.value.filter(q => q.difficulty === difficulty);
  }

  getQuestionsByDifficultyRange(minDifficulty: number, maxDifficulty: number): Question[] {
    return this.questionsSubject.value.filter(q => q.difficulty >= minDifficulty && q.difficulty <= maxDifficulty);
  }

  addQuestion(question: Omit<Question, 'id'>): void {
    const questions = this.questionsSubject.value;
    const maxId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0;
    const newQuestion: Question = {
      ...question,
      id: maxId + 1
    };
    this.saveQuestionsToStorage([...questions, newQuestion]);
  }

  updateQuestion(id: number, question: Partial<Question>): void {
    const questions = this.questionsSubject.value;
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...question };
      this.saveQuestionsToStorage([...questions]);
    }
  }

  deleteQuestion(id: number): void {
    const questions = this.questionsSubject.value.filter(q => q.id !== id);
    this.saveQuestionsToStorage(questions);
  }

  importQuestionsFromExcel(questions: Omit<Question, 'id'>[]): void {
    const existingQuestions = this.questionsSubject.value;
    const maxId = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.id)) : 0;
    
    const newQuestions = questions.map((q, index) => ({
      ...q,
      id: maxId + index + 1
    }));

    this.saveQuestionsToStorage([...existingQuestions, ...newQuestions]);
  }

  clearAllQuestions(): void {
    this.saveQuestionsToStorage([]);
  }

  // Performance tracking
  savePerformance(performance: Omit<UserPerformance, 'quizId' | 'timestamp'>): void {
    const allPerformance = this.performanceSubject.value;
    const newPerformance: UserPerformance = {
      ...performance,
      quizId: this.generateQuizId(),
      timestamp: new Date()
    };
    this.savePerformanceToStorage([...allPerformance, newPerformance]);
  }

  getPerformance(): UserPerformance[] {
    return this.performanceSubject.value;
  }

  getPerformanceStats() {
    const performance = this.performanceSubject.value;
    if (performance.length === 0) {
      return {
        totalQuizzes: 0,
        avgScore: 0,
        avgAccuracy: 0,
        totalQuestions: 0,
        totalCorrect: 0
      };
    }

    const totalQuizzes = performance.length;
    const totalScore = performance.reduce((sum, p) => sum + p.score, 0);
    const totalQuestions = performance.reduce((sum, p) => sum + p.totalQuestions, 0);
    const totalCorrect = performance.reduce((sum, p) => sum + p.correctAnswers, 0);
    const avgAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    return {
      totalQuizzes,
      avgScore: Math.round(totalScore / totalQuizzes),
      avgAccuracy: Math.round(avgAccuracy),
      totalQuestions,
      totalCorrect
    };
  }

  clearPerformance(): void {
    this.savePerformanceToStorage([]);
  }

  private generateQuizId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultQuestions(): void {
    const defaultQuestions: Question[] = [
      // Level 1-2: Very Easy
      {
        id: 1,
        question: 'How many squares are on a standard chessboard?',
        options: ['64', '32', '48', '72'],
        correctAnswers: [0],
        difficulty: 1,
        explanation: 'A standard chessboard has 8 rows × 8 columns = 64 squares.'
      },
      {
        id: 2,
        question: 'Which piece can move diagonally any number of squares?',
        options: ['Knight', 'Bishop', 'Rook', 'Pawn'],
        correctAnswers: [1],
        difficulty: 1,
        explanation: 'The Bishop moves diagonally across the board.'
      },
      {
        id: 3,
        question: 'What is the most powerful piece on the chessboard?',
        options: ['King', 'Queen', 'Rook', 'Bishop'],
        correctAnswers: [1],
        difficulty: 2,
        explanation: 'The Queen is the most powerful piece as it can move in any direction.'
      },
      {
        id: 4,
        question: 'How many pawns does each player start with?',
        options: ['6', '8', '10', '12'],
        correctAnswers: [1],
        difficulty: 1,
        explanation: 'Each player starts with 8 pawns on the second rank.'
      },
      {
        id: 5,
        question: 'Which piece moves in an L-shape?',
        options: ['Bishop', 'Rook', 'Knight', 'Queen'],
        correctAnswers: [2],
        difficulty: 2,
        explanation: 'The Knight is the only piece that moves in an L-shape (2 squares in one direction and 1 square perpendicular).'
      },
      // Level 3-5: Medium
      {
        id: 6,
        question: 'What is "castling" in chess?',
        options: [
          'Moving the King two squares towards a Rook',
          'Capturing an opponent\'s piece',
          'Promoting a pawn',
          'Putting the King in check'
        ],
        correctAnswers: [0],
        difficulty: 4,
        explanation: 'Castling is a special move involving the King and Rook, where the King moves two squares towards a Rook and the Rook jumps over to the other side.'
      },
      {
        id: 7,
        question: 'What is "en passant"?',
        options: [
          'A special pawn capture',
          'A type of checkmate',
          'A knight\'s move',
          'A defensive strategy'
        ],
        correctAnswers: [0],
        difficulty: 4,
        explanation: 'En passant is a special pawn capture that can occur when an opponent\'s pawn moves two squares forward from its starting position.'
      },
      {
        id: 8,
        question: 'What happens when a pawn reaches the opposite end of the board?',
        options: [
          'It is removed from the game',
          'It can be promoted to any piece except the King',
          'It must be promoted to a Queen',
          'It stays as a pawn'
        ],
        correctAnswers: [1],
        difficulty: 3,
        explanation: 'When a pawn reaches the eighth rank, it must be promoted to a Queen, Rook, Bishop, or Knight.'
      },
      {
        id: 9,
        question: 'In the starting position, which pieces protect the King?',
        options: [
          'Bishop and Knight',
          'Queen and Rook',
          'Pawns only',
          'No pieces directly protect the King'
        ],
        correctAnswers: [0],
        difficulty: 5,
        explanation: 'In the starting position, the King is flanked by the Bishop and Knight on both sides.'
      },
      {
        id: 10,
        question: 'What is a "fork" in chess?',
        options: [
          'Attacking two or more pieces simultaneously',
          'Moving two pieces at once',
          'A type of opening',
          'Defending the King'
        ],
        correctAnswers: [0],
        difficulty: 5,
        explanation: 'A fork is a tactic where one piece attacks two or more opponent pieces at the same time.'
      },
      // Level 6-9: Hard to Extremely Hard
      {
        id: 11,
        question: 'What is "zugzwang"?',
        options: [
          'A situation where any move worsens your position',
          'A special opening sequence',
          'A type of stalemate',
          'A checkmate pattern'
        ],
        correctAnswers: [0],
        difficulty: 7,
        explanation: 'Zugzwang is a German word meaning "compulsion to move." It describes a situation where any legal move weakens your position.'
      },
      {
        id: 12,
        question: 'In the Ruy Lopez opening, what is the third move for White?',
        options: ['Bc4', 'Bb5', 'Nf3', 'd4'],
        correctAnswers: [1],
        difficulty: 6,
        explanation: 'The Ruy Lopez is characterized by 1.e4 e5 2.Nf3 Nc6 3.Bb5, attacking the knight that defends the e5 pawn.'
      },
      {
        id: 13,
        question: 'What is the "50-move rule"?',
        options: [
          'A player can claim a draw after 50 moves without a capture or pawn move',
          'The game must end in 50 moves',
          'A pawn must move within 50 moves',
          'Each player gets 50 moves total'
        ],
        correctAnswers: [0],
        difficulty: 7,
        explanation: 'The 50-move rule states that a player can claim a draw if no capture has been made and no pawn has been moved in the last 50 moves by each player.'
      },
      {
        id: 14,
        question: 'What is a "discovered check"?',
        options: [
          'Moving a piece that reveals a check from another piece',
          'Finding the King in an unexpected position',
          'Checking the King with two pieces',
          'A check that leads to checkmate'
        ],
        correctAnswers: [0],
        difficulty: 8,
        explanation: 'A discovered check occurs when moving one piece exposes a check from another piece behind it.'
      },
      {
        id: 15,
        question: 'What is "opposition" in chess endgames?',
        options: [
          'Having your King face the opponent\'s King with one square between them',
          'Blocking opponent\'s pieces',
          'Controlling the center',
          'Having more pieces than opponent'
        ],
        correctAnswers: [0],
        difficulty: 9,
        explanation: 'Opposition is a key endgame concept where Kings face each other with an odd number of squares between them on the same file, rank, or diagonal.'
      }
    ];

    this.saveQuestionsToStorage(defaultQuestions);
  }
}
