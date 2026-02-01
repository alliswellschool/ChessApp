import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-coordinates',
  standalone: true,
  imports: [CommonModule, ChessboardComponent],
  templateUrl: './coordinates.html',
  styleUrls: ['./coordinates.css']
})
export class Coordinates {
  private progressService = inject(ProgressService);
  
  size = 8;
  board: number[][] = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  cells: ChessCell[][] = [];

  // Game state
  target = '';
  lastClick: { r: number; c: number; correct: boolean } | null = null;
  score = 0;
  attempts = 0;

  constructor() {
    this.initializeCells();
    this.nextTarget();
  }

  initializeCells(): void {
    this.cells = Array.from({ length: this.size }, (_, row) =>
      Array.from({ length: this.size }, (_, col) => ({
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0
      }))
    );
  }

  fileLabel(index: number): string { return String.fromCharCode(97 + index); }
  rankLabel(row: number): number { return this.size - row; }

  toCoord(r: number, c: number): string {
    const file = String.fromCharCode(97 + c);
    const rank = this.size - r;
    return `${file}${rank}`;
  }

  randomTarget(): string {
    const r = Math.floor(Math.random() * this.size);
    const c = Math.floor(Math.random() * this.size);
    return this.toCoord(r, c);
  }

  nextTarget(): void {
    this.target = this.randomTarget();
  }

  reset(): void {
    this.score = 0;
    this.attempts = 0;
    this.lastClick = null;
    this.nextTarget();
  }

  clickSquare(r: number, c: number): void {
    const coord = this.toCoord(r, c);
    const correct = coord.toLowerCase() === this.target.toLowerCase();
    this.lastClick = { r, c, correct };
    
    this.attempts++;
    if (correct) {
      this.score++;
      // Track progress
      this.progressService.trackCompletion('coordinates', { score: this.score });
      this.nextTarget();
    }

    this.updateCells();

    // Clear the lastClick highlight after a short delay
    setTimeout(() => {
      this.lastClick = null;
      this.updateCells();
    }, 450);
  }

  onCellClick(event: { row: number; col: number; cell: ChessCell }): void {
    this.clickSquare(event.row, event.col);
  }

  updateCells(): void {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const isLastClick = this.lastClick?.r === row && this.lastClick?.c === col;
        this.cells[row][col] = {
          row,
          col,
          isLight: (row + col) % 2 === 0,
          isDark: (row + col) % 2 !== 0,
          customClasses: [
            isLastClick && this.lastClick?.correct ? 'hit-correct' : '',
            isLastClick && !this.lastClick?.correct ? 'hit-wrong' : ''
          ].filter(Boolean)
        };
      }
    }
  }
}
