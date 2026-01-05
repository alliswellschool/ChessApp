import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChessCell {
  row: number;
  col: number;
  isLight: boolean;
  isDark: boolean;
  piece?: string;
  pieceImage?: string;
  dominated?: boolean;
  blocked?: boolean;
  hasPiece?: boolean;
  hasInvalidPiece?: boolean;
  customClasses?: string[];
  data?: any; // For passing custom data
}

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent {
  @Input() size: number = 8; // Board size (8x8, 6x6, etc.)
  @Input() cells: ChessCell[][] = []; // 2D array of cell data
  @Input() showCoordinates: boolean = true; // Show file/rank labels
  @Input() flipBoard: boolean = false; // Flip board orientation
  @Input() cellSize?: number; // Optional fixed cell size in px
  @Input() interactive: boolean = true; // Enable/disable cell clicks
  
  @Output() cellClick = new EventEmitter<{ row: number; col: number; cell: ChessCell }>();
  @Output() cellHover = new EventEmitter<{ row: number; col: number; cell: ChessCell }>();

  constructor() {}

  get boardSizeVar(): { [key: string]: string } {
    return {
      '--board-size': this.size.toString(),
      '--cell-size': this.cellSize ? `${this.cellSize}px` : '56px'
    };
  }

  get files(): string[] {
    const files = 'abcdefghijklmnopqrstuvwxyz'.split('').slice(0, this.size);
    return this.flipBoard ? files.reverse() : files;
  }

  get ranks(): number[] {
    const ranks = Array.from({ length: this.size }, (_, i) => this.size - i);
    return this.flipBoard ? ranks.reverse() : ranks;
  }

  fileLabel(col: number): string {
    return this.files[col];
  }

  rankLabel(row: number): string {
    return this.ranks[row].toString();
  }

  onCellClick(row: number, col: number): void {
    if (!this.interactive) return;
    
    const cell = this.cells[row]?.[col];
    if (cell && !cell.blocked) {
      this.cellClick.emit({ row, col, cell });
    }
  }

  onCellHover(row: number, col: number): void {
    if (!this.interactive) return;
    
    const cell = this.cells[row]?.[col];
    if (cell) {
      this.cellHover.emit({ row, col, cell });
    }
  }

  getCell(row: number, col: number): ChessCell {
    return this.cells[row]?.[col] || {
      row,
      col,
      isLight: (row + col) % 2 === 0,
      isDark: (row + col) % 2 !== 0
    };
  }

  getCellClasses(row: number, col: number): string[] {
    const cell = this.getCell(row, col);
    const classes: string[] = ['cell'];
    
    if (cell.isLight) classes.push('light');
    if (cell.isDark) classes.push('dark');
    if (cell.dominated) classes.push('dominated');
    if (cell.blocked) classes.push('blocked');
    if (cell.hasPiece) classes.push('has-piece');
    if (cell.hasInvalidPiece) classes.push('has-invalid-piece');
    if (cell.customClasses) classes.push(...cell.customClasses);
    
    return classes;
  }
}
