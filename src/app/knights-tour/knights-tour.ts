import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import { VictoryModalComponent, VictoryButton, VictoryStat } from '../shared/victory-modal/victory-modal.component';
import { ProgressService } from '../services/progress.service';

interface Square {
  visited: boolean;
  order: number;
}

@Component({
  selector: 'app-knights-tour',
  standalone: true,
  imports: [CommonModule, ChessboardComponent, VictoryModalComponent],
  templateUrl: './knights-tour.html',
  styleUrls: ['./knights-tour.css']
})
export class KnightsTour {
  private progressService = inject(ProgressService);
  
  size = 8;
  board: Square[][] = [];
  cells: ChessCell[][] = [];
  moveHistory: Array<{ row: number; col: number }> = [];
  knightPosition: { row: number; col: number } | null = null;
  moveCount = 0;
  gameStarted = false;
  showValidMoves = true; // Toggle for showing green highlights
  
  // Modal states
  showVictoryModal = false;
  showCompletionModal = false;

  // Knight moves: L-shape (2 squares in one direction, 1 in perpendicular)
  private readonly knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  constructor() {
    this.initializeBoard();
  }

  initializeBoard(): void {
    this.board = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({
        visited: false,
        order: 0
      }))
    );
    this.cells = Array.from({ length: this.size }, (_, row) =>
      Array.from({ length: this.size }, (_, col) => ({
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0,
        data: { visited: false, order: 0 }
      }))
    );
    this.knightPosition = null;
    this.moveHistory = [];
    this.moveCount = 0;
    this.gameStarted = false;
    this.updateCells();
  }

  fileLabel(index: number): string {
    return String.fromCharCode(97 + index); // a-h
  }

  rankLabel(row: number): number {
    return this.size - row; // 8-1
  }

  isLightSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }

  isValidMove(row: number, col: number): boolean {
    // Check bounds
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return false;
    }

    // If no knight placed yet, any square is valid
    if (!this.knightPosition) {
      return true;
    }

    // Check if it's a valid knight move (L-shape)
    const rowDiff = Math.abs(row - this.knightPosition.row);
    const colDiff = Math.abs(col - this.knightPosition.col);

    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  getValidMoves(): { row: number; col: number }[] {
    if (!this.knightPosition) {
      return [];
    }

    const validMoves: { row: number; col: number }[] = [];

    for (const [dr, dc] of this.knightMoves) {
      const newRow = this.knightPosition.row + dr;
      const newCol = this.knightPosition.col + dc;

      if (this.isValidMove(newRow, newCol)) {
        validMoves.push({ row: newRow, col: newCol });
      }
    }

    return validMoves;
  }

  isValidMoveSquare(row: number, col: number): boolean {
    if (!this.gameStarted) return false;
    return this.getValidMoves().some(move => move.row === row && move.col === col);
  }

  clickSquare(row: number, col: number): void {
    if (!this.isValidMove(row, col)) {
      return;
    }

    // Place knight and increment visit count
    this.knightPosition = { row, col };
    this.moveHistory.push({ row, col });
    this.moveCount = this.moveHistory.length;
    this.board[row][col].visited = true;
    // Increment order on each visit (allows multiple visits to same square)
    this.board[row][col].order = this.moveCount;
    this.gameStarted = true;
    this.updateCells();
    
    // Check for completion or victory
    if (this.isComplete) {
      // Track progress
      this.progressService.trackCompletion('knightsTour', {
        score: this.isPerfectTour ? 100 : 50,
        level: this.isPerfectTour ? 2 : 1
      });
      
      if (this.isPerfectTour) {
        this.showVictoryModal = true;
      } else {
        this.showCompletionModal = true;
      }
    }
  }

  /** Undo the last knight move (one step back) */
  undo(): void {
    if (this.moveHistory.length === 0) return;

    // Remove last move
    const last = this.moveHistory.pop()!;
    
    // Find if this square was visited before in the history
    const previousVisitIndex = this.moveHistory.findIndex(m => m.row === last.row && m.col === last.col);
    if (previousVisitIndex >= 0) {
      // Square was visited before, show that visit number
      this.board[last.row][last.col].order = previousVisitIndex + 1;
    } else {
      // Square never visited before, reset
      this.board[last.row][last.col].visited = false;
      this.board[last.row][last.col].order = 0;
    }

    // Decrement move count and set knightPosition to previous or null
    this.moveCount = this.moveHistory.length;
    const prev = this.moveHistory[this.moveHistory.length - 1] || null;
    this.knightPosition = prev ? { row: prev.row, col: prev.col } : null;

    this.gameStarted = this.moveCount > 0;
    this.updateCells();
  }

  onCellClick(event: { row: number; col: number; cell: ChessCell }): void {
    this.clickSquare(event.row, event.col);
  }

  updateCells(): void {
    const validMoves = this.getValidMoves();
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const square = this.board[row][col];
        const isKnight = this.knightPosition?.row === row && this.knightPosition?.col === col;
        const isValidMove = validMoves.some(m => m.row === row && m.col === col);
        
        this.cells[row][col] = {
          row,
          col,
          isLight: (row + col) % 2 === 0,
          isDark: (row + col) % 2 !== 0,
          pieceImage: isKnight ? '/pieces/alpha/wN.svg' : undefined,
          hasPiece: isKnight,
          customClasses: [
            square.visited ? 'visited' : '',
            isValidMove && this.showValidMoves ? 'valid-move' : ''
          ].filter(Boolean),
          data: {
            visited: square.visited
            // Removed order display
          }
        };
      }
    }
  }

  get isComplete(): boolean {
    // Count unique squares visited
    const uniqueSquares = new Set(this.moveHistory.map(m => `${m.row},${m.col}`));
    return uniqueSquares.size === this.size * this.size;
  }

  get squaresVisited(): number {
    // Count unique squares visited
    const uniqueSquares = new Set(this.moveHistory.map(m => `${m.row},${m.col}`));
    return uniqueSquares.size;
  }

  get totalSquares(): number {
    return this.size * this.size;
  }

  get hasValidMoves(): boolean {
    if (!this.knightPosition) return true;
    return this.getValidMoves().length > 0;
  }

  get isStuck(): boolean {
    return this.gameStarted && !this.isComplete && !this.hasValidMoves;
  }
  
  get isPerfectTour(): boolean {
    return this.isComplete && this.moveCount === this.totalSquares;
  }
  
  get victoryStats(): VictoryStat[] {
    return [
      { label: 'Squares Visited', value: `${this.squaresVisited} / ${this.totalSquares}` },
      { label: 'Total Moves', value: this.moveCount },
      { label: 'Status', value: this.isPerfectTour ? 'Perfect!' : 'Complete' }
    ];
  }
  
  get completionMessage(): string {
    return `You visited all ${this.totalSquares} squares in ${this.moveCount} moves! Try to complete it in exactly ${this.totalSquares} moves for a perfect tour.`;
  }
  
  get victoryButtons(): VictoryButton[] {
    return [
      { label: 'Try Again', action: 'reset', style: 'secondary' },
      { label: 'Continue', action: 'close', style: 'primary' }
    ];
  }
  
  get completionButtons(): VictoryButton[] {
    return [
      { label: 'Try Again', action: 'reset', style: 'primary' }
    ];
  }
  
  handleVictoryAction(action: string): void {
    if (action === 'reset') {
      this.reset();
    } else if (action === 'close') {
      this.showVictoryModal = false;
    }
  }
  
  handleCompletionAction(action: string): void {
    if (action === 'reset') {
      this.reset();
    }
  }
  
  reset(): void {
    this.initializeBoard();
    this.showVictoryModal = false;
    this.showCompletionModal = false;
  }}