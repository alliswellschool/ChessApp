import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService, Question, UserPerformance } from '../services/quiz.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  activeTab: 'dashboard' | 'questions' | 'import' | 'analytics' = 'dashboard';
  
  // Questions management
  questions: Question[] = [];
  editingQuestion: Question | null = null;
  newQuestion: Partial<Question> = {
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [0], // Array to support multiple correct answers
    difficulty: 1, // 1-9 scale (1=easy, 9=extremely hard)
    explanation: ''
  };
  
  // Import
  importFile: File | null = null;
  importStatus: string = '';
  importError: string = '';
  
  // Analytics
  performance: UserPerformance[] = [];
  stats: any = {};

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.loadPerformance();
  }

  loadQuestions(): void {
    this.questions = this.quizService.getQuestions();
  }

  loadPerformance(): void {
    this.performance = this.quizService.getPerformance();
    this.stats = this.quizService.getPerformanceStats();
  }

  // Question Management
  addQuestion(): void {
    if (!this.validateQuestion(this.newQuestion)) {
      alert('Please fill in all required fields');
      return;
    }

    this.quizService.addQuestion(this.newQuestion as Omit<Question, 'id'>);
    this.resetNewQuestion();
    this.loadQuestions();
  }

  editQuestion(question: Question): void {
    this.editingQuestion = { ...question };
  }

  updateQuestion(): void {
    if (this.editingQuestion && this.validateQuestion(this.editingQuestion)) {
      this.quizService.updateQuestion(this.editingQuestion.id, this.editingQuestion);
      this.editingQuestion = null;
      this.loadQuestions();
    }
  }

  deleteQuestion(id: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.quizService.deleteQuestion(id);
      this.loadQuestions();
    }
  }

  cancelEdit(): void {
    this.editingQuestion = null;
  }

  validateQuestion(q: Partial<Question>): boolean {
    return !!(
      q.question &&
      q.options &&
      q.options.length === 4 &&
      q.options.every(o => o.trim()) &&
      q.correctAnswers &&
      q.correctAnswers.length > 0 &&
      q.correctAnswers.every(a => a >= 0 && a < 4) &&
      q.difficulty &&
      q.difficulty >= 1 &&
      q.difficulty <= 9
    );
  }

  resetNewQuestion(): void {
    this.newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswers: [0],
      difficulty: 1,
      explanation: ''
    };
  }

  toggleCorrectAnswer(optionIndex: number, isNewQuestion: boolean): void {
    const targetQuestion = isNewQuestion ? this.newQuestion : this.editingQuestion;
    if (!targetQuestion || !targetQuestion.correctAnswers) return;

    const index = targetQuestion.correctAnswers.indexOf(optionIndex);
    if (index > -1) {
      // Remove if already selected
      targetQuestion.correctAnswers.splice(index, 1);
    } else {
      // Add if not selected
      targetQuestion.correctAnswers.push(optionIndex);
    }

    // Ensure at least one answer is selected
    if (targetQuestion.correctAnswers.length === 0) {
      targetQuestion.correctAnswers = [0];
    }
  }

  // Excel Import
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importFile = file;
      this.importStatus = '';
      this.importError = '';
    }
  }

  async importExcel(): Promise<void> {
    if (!this.importFile) {
      this.importError = 'Please select a file';
      return;
    }

    try {
      const data = await this.readExcelFile(this.importFile);
      const questions = this.parseExcelData(data);
      
      if (questions.length === 0) {
        this.importError = 'No valid questions found in the file';
        return;
      }

      this.quizService.importQuestionsFromExcel(questions);
      this.importStatus = `Successfully imported ${questions.length} questions`;
      this.importFile = null;
      this.loadQuestions();
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      this.importError = `Error importing file: ${error}`;
    }
  }

  private readExcelFile(file: File): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          resolve(jsonData as any[][]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private parseExcelData(data: any[][]): Omit<Question, 'id'>[] {
    const questions: Omit<Question, 'id'>[] = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Expected format: Question | Option1 | Option2 | Option3 | Option4 | CorrectAnswers (e.g., "0,2") | Difficulty (1-9) | Explanation
      if (row.length < 7) continue;
      
      // Parse correctAnswers - can be single number or comma-separated (e.g., "0" or "0,2")
      const correctAnswersStr = String(row[5] || '0').trim();
      const correctAnswers = correctAnswersStr.split(',').map(a => Number(a.trim())).filter(a => !isNaN(a) && a >= 0 && a < 4);
      
      const question: Omit<Question, 'id'> = {
        question: String(row[0] || '').trim(),
        options: [
          String(row[1] || '').trim(),
          String(row[2] || '').trim(),
          String(row[3] || '').trim(),
          String(row[4] || '').trim()
        ],
        correctAnswers: correctAnswers.length > 0 ? correctAnswers : [0],
        difficulty: this.normalizeDifficulty(String(row[6] || '1')),
        explanation: String(row[7] || '').trim()
      };
      
      // Validate question
      if (question.question && question.options.every(o => o)) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  private normalizeDifficulty(value: string): number {
    const normalized = value.toLowerCase().trim();
    
    // Try to parse as number first (1-9)
    const numValue = Number(normalized);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 9) {
      return Math.floor(numValue);
    }
    
    // Legacy string-based difficulty mapping
    if (normalized === 'easy') return 1;
    if (normalized === 'medium' || normalized === 'med') return 5;
    if (normalized === 'hard' || normalized === 'difficult') return 9;
    
    return 1; // Default to level 1
  }

  downloadTemplate(): void {
    // Create header row
    const header = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answers (0-3, comma-separated)', 'Difficulty (1-9)', 'Explanation'];
    
    // Convert all existing questions to Excel format
    const questionRows = this.questions.map(q => [
      q.question,
      q.options[0],
      q.options[1],
      q.options[2],
      q.options[3],
      q.correctAnswers.join(','),
      q.difficulty,
      q.explanation || ''
    ]);

    // If no questions exist, add sample questions
    const data = questionRows.length > 0 ? [header, ...questionRows] : [
      header,
      ['How many squares are on a standard chessboard?', '64', '32', '48', '72', '0', '1', 'A standard chessboard has 8 rows × 8 columns = 64 squares.'],
      ['Which pieces can move diagonally?', 'Bishop', 'Rook', 'Queen', 'Knight', '0,2', '3', 'Both the Bishop and Queen can move diagonally across the board.'],
      ['What is the maximum number of moves in the 50-move rule?', '50', '75', '100', '25', '0', '7', 'The 50-move rule states that a player can claim a draw if no pawn has moved and no capture has been made in the last 50 moves.']
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Auto-size columns for better readability
    const colWidths = [
      { wch: 50 }, // Question
      { wch: 20 }, // Option 1
      { wch: 20 }, // Option 2
      { wch: 20 }, // Option 3
      { wch: 20 }, // Option 4
      { wch: 15 }, // Correct Answers
      { wch: 12 }, // Difficulty
      { wch: 50 }  // Explanation
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    
    // Use descriptive filename with question count and timestamp
    const filename = questionRows.length > 0 
      ? `chess_quiz_${questionRows.length}_questions_${new Date().toISOString().split('T')[0]}.xlsx`
      : 'chess_quiz_template.xlsx';
    
    XLSX.writeFile(wb, filename);
  }

  // Analytics
  getQuestionCountByDifficulty(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    
    // Initialize counts for levels 1-9
    for (let i = 1; i <= 9; i++) {
      counts[`Level ${i}`] = 0;
    }
    
    this.questions.forEach(q => {
      const key = `Level ${q.difficulty}`;
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });
    
    return counts;
  }

  getRecentPerformance(): UserPerformance[] {
    return this.performance
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  clearAllData(): void {
    if (confirm('Are you sure you want to delete ALL questions? This cannot be undone!')) {
      this.quizService.clearAllQuestions();
      this.loadQuestions();
    }
  }

  clearPerformanceData(): void {
    if (confirm('Are you sure you want to delete all performance data?')) {
      this.quizService.clearPerformance();
      this.loadPerformance();
    }
  }

  exportQuestions(): void {
    const exportData = this.questions.map(q => ([
      q.question,
      ...q.options,
      q.correctAnswers.join(','), // Export as comma-separated string
      q.difficulty,
      q.explanation || ''
    ]));

    const header = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answers (0-3)', 'Difficulty (1-9)', 'Explanation'];
    const ws = XLSX.utils.aoa_to_sheet([header, ...exportData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    XLSX.writeFile(wb, `chess_quiz_questions_${Date.now()}.xlsx`);
  }

  getDifficultyColor(difficulty: number | string): string {
    const level = typeof difficulty === 'string' ? parseInt(difficulty.replace('Level ', '')) : difficulty;
    
    if (level <= 2) return '#10b981'; // Green - Very Easy
    if (level <= 4) return '#84cc16'; // Light Green - Easy
    if (level <= 6) return '#f59e0b'; // Orange - Medium
    if (level <= 8) return '#ef4444'; // Red - Hard
    return '#991b1b'; // Dark Red - Extremely Hard
  }
}
