import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import {
  PieceType,
  getPieceImage,
  getPieceSymbol,
  fileLabel,
  rankLabel
} from '../shared/chess.constants';

type ShapeType = 'star' | 'circle' | 'diamond' | 'triangle' | 'heart' | 'square';

interface ShapePosition {
  row: number;
  col: number;
  shape: ShapeType;
  captured: boolean;
}

interface PlacedPiece {
  row: number;
  col: number;
  type: PieceType;
}

interface PuzzleData {
  id: number;
  pieceType: PieceType;
  startSquare: string; // e.g., 'a1'
  shapes: Array<{ row: number; col: number; shape: ShapeType }>;
}

@Component({
  selector: 'app-capture-the-shapes',
  standalone: true,
  imports: [CommonModule, FormsModule, ChessboardComponent],
  templateUrl: './capture-the-shapes.html',
  styleUrls: ['./capture-the-shapes.css']
})
export class CaptureTheShapes {
  size = 8;
  
  currentPuzzleIndex = 0;
  shapes: ShapePosition[] = [];
  
  // Movement-based system
  activePiece: PlacedPiece | null = null; // Currently active piece on board
  moveCount = 0; // Total moves made in current puzzle
  moveHistory: Array<{row: number; col: number}> = []; // Track piece positions
  bestScores: Record<number, number> = {}; // Best scores per puzzle: puzzleId -> score
  
  showValidMoves = true;
  gameCompleted = false;
  
  // Piece filter
  selectedPieceFilter: PieceType | 'all' = 'all';
  availablePieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king'];

  // Puzzle definitions - each starting position is a separate puzzle
  puzzles: PuzzleData[] = [
    // Set 1 - Rook puzzles
    {
      id: 1,
      pieceType: 'rook',
      startSquare: 'a1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 2,
      pieceType: 'rook',
      startSquare: 'h1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 3,
      pieceType: 'rook',
      startSquare: 'a8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 4,
      pieceType: 'rook',
      startSquare: 'h8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    // Set 1 - Knight puzzles
    {
      id: 5,
      pieceType: 'knight',
      startSquare: 'b1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 6,
      pieceType: 'knight',
      startSquare: 'g1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 7,
      pieceType: 'knight',
      startSquare: 'b8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 8,
      pieceType: 'knight',
      startSquare: 'g8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    // Set 1 - Bishop puzzles
    {
      id: 9,
      pieceType: 'bishop',
      startSquare: 'c1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 10,
      pieceType: 'bishop',
      startSquare: 'f1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 11,
      pieceType: 'bishop',
      startSquare: 'c8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 12,
      pieceType: 'bishop',
      startSquare: 'f8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    // Set 1 - Queen puzzles
    {
      id: 13,
      pieceType: 'queen',
      startSquare: 'd1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 14,
      pieceType: 'queen',
      startSquare: 'd8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    // Set 1 - King puzzles
    {
      id: 15,
      pieceType: 'king',
      startSquare: 'e1',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    {
      id: 16,
      pieceType: 'king',
      startSquare: 'e8',
      shapes: [
        { row: 2, col: 1, shape: 'star' },
        { row: 2, col: 3, shape: 'circle' },
        { row: 4, col: 5, shape: 'diamond' },
        { row: 5, col: 2, shape: 'triangle' },
        { row: 6, col: 6, shape: 'heart' },
      ]
    },
    // Set 2 - Rook puzzles
    {
      id: 17,
      pieceType: 'rook',
      startSquare: 'a1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    {
      id: 18,
      pieceType: 'rook',
      startSquare: 'h1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    // Set 2 - Knight puzzles
    {
      id: 19,
      pieceType: 'knight',
      startSquare: 'b1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    {
      id: 20,
      pieceType: 'knight',
      startSquare: 'g1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    {
      id: 21,
      pieceType: 'knight',
      startSquare: 'c8',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    // Set 2 - Bishop puzzles
    {
      id: 22,
      pieceType: 'bishop',
      startSquare: 'c1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    {
      id: 23,
      pieceType: 'bishop',
      startSquare: 'f8',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    // Set 2 - Queen puzzles
    {
      id: 24,
      pieceType: 'queen',
      startSquare: 'd1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    // Set 2 - King puzzles
    {
      id: 25,
      pieceType: 'king',
      startSquare: 'e1',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    },
    {
      id: 26,
      pieceType: 'king',
      startSquare: 'e8',
      shapes: [
        { row: 1, col: 2, shape: 'circle' },
        { row: 3, col: 4, shape: 'star' },
        { row: 3, col: 6, shape: 'diamond' },
        { row: 5, col: 1, shape: 'square' },
        { row: 5, col: 5, shape: 'heart' },
        { row: 6, col: 3, shape: 'triangle' },
      ]
    }
  ];

  get filteredPuzzles(): PuzzleData[] {
    if (this.selectedPieceFilter === 'all') {
      return this.puzzles;
    }
    return this.puzzles.filter(p => p.pieceType === this.selectedPieceFilter);
  }

  get currentPuzzle(): PuzzleData {
    return this.filteredPuzzles[this.currentPuzzleIndex];
  }

  get capturedCount(): number {
    return this.shapes.filter(s => s.captured).length;
  }

  get totalShapes(): number {
    return this.shapes.length;
  }

  get progressPercentage(): number {
    return this.totalShapes > 0 ? (this.capturedCount / this.totalShapes) * 100 : 0;
  }

  constructor() {
    this.loadPuzzle(this.currentPuzzleIndex);
  }

  loadPuzzle(index: number) {
    const puzzle = this.filteredPuzzles[index];
    this.shapes = puzzle.shapes.map(s => ({ ...s, captured: false }));
    this.gameCompleted = false;
    this.currentPuzzleIndex = index;
    this.loadBestScores();
    
    // Auto-place piece at starting position
    const startPos = this.parseSquareName(puzzle.startSquare);
    this.activePiece = { row: startPos.row, col: startPos.col, type: puzzle.pieceType };
    this.moveCount = 0;
    this.moveHistory = [{ row: startPos.row, col: startPos.col }];
    this.captureShapeAtPosition(startPos.row, startPos.col);
  }

  parseSquareName(square: string): { row: number; col: number } {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square[1]) - 1;
    return { row: this.size - 1 - rank, col: file };
  }

  onPieceFilterChange(pieceType: PieceType | 'all') {
    this.selectedPieceFilter = pieceType;
    this.currentPuzzleIndex = 0;
    this.loadPuzzle(0);
  }



  onCellClicked(row: number, col: number) {
    if (this.gameCompleted) return;

    // Piece is already on board - try to move it
    if (this.activePiece && this.isValidMove(row, col)) {
      this.movePiece(row, col);
      this.checkVictory();
    }
  }

  captureShapeAtPosition(row: number, col: number) {
    // Check if there's a shape at this position and capture it
    const shape = this.getShapeAtPosition(row, col);
    if (shape && !shape.captured) {
      shape.captured = true;
    }
  }

  movePiece(row: number, col: number) {
    if (!this.activePiece) return;
    
    // Move the piece
    this.activePiece.row = row;
    this.activePiece.col = col;
    this.moveCount++;
    this.moveHistory.push({ row, col });
    
    // Capture shape if present
    this.captureShapeAtPosition(row, col);
  }

  isValidMove(row: number, col: number): boolean {
    if (!this.activePiece) return false;
    
    const validMoves = this.getValidMoves();
    return validMoves.some(move => move.row === row && move.col === col);
  }

  getValidMoves(): Array<{ row: number; col: number }> {
    if (!this.activePiece) return [];
    
    return this.getAttackedSquares(this.activePiece.row, this.activePiece.col, this.activePiece.type);
  }

  loadBestScores() {
    const saved = localStorage.getItem('capture-shapes-best-scores');
    if (saved) {
      this.bestScores = JSON.parse(saved);
    }
  }

  saveBestScore() {
    if (!this.activePiece) return;
    
    const puzzleId = this.currentPuzzle.id;
    const currentBest = this.bestScores[puzzleId];
    
    if (!currentBest || this.moveCount < currentBest) {
      this.bestScores[puzzleId] = this.moveCount;
      localStorage.setItem('capture-shapes-best-scores', JSON.stringify(this.bestScores));
    }
  }

  getBestScore(): number | null {
    return this.bestScores[this.currentPuzzle.id] || null;
  }



  getAttackedSquares(row: number, col: number, type: PieceType): Array<{ row: number; col: number }> {
    const attacked: Array<{ row: number; col: number }> = [];

    switch (type) {
      case 'rook':
        // Horizontal and vertical
        for (let c = 0; c < this.size; c++) {
          if (c !== col) attacked.push({ row, col: c });
        }
        for (let r = 0; r < this.size; r++) {
          if (r !== row) attacked.push({ row: r, col });
        }
        break;

      case 'bishop':
        // Diagonals
        for (let i = 1; i < this.size; i++) {
          if (row + i < this.size && col + i < this.size) attacked.push({ row: row + i, col: col + i });
          if (row + i < this.size && col - i >= 0) attacked.push({ row: row + i, col: col - i });
          if (row - i >= 0 && col + i < this.size) attacked.push({ row: row - i, col: col + i });
          if (row - i >= 0 && col - i >= 0) attacked.push({ row: row - i, col: col - i });
        }
        break;

      case 'queen':
        // Combination of rook and bishop
        attacked.push(...this.getAttackedSquares(row, col, 'rook'));
        attacked.push(...this.getAttackedSquares(row, col, 'bishop'));
        break;

      case 'knight':
        // L-shaped moves
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightMoves.forEach(([dr, dc]) => {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
            attacked.push({ row: newRow, col: newCol });
          }
        });
        break;

      case 'king':
        // One square in any direction
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
              attacked.push({ row: newRow, col: newCol });
            }
          }
        }
        break;
    }

    return attacked;
  }

  checkVictory() {
    if (this.capturedCount === this.totalShapes) {
      this.gameCompleted = true;
      this.saveBestScore();
    }
  }

  isValidStartingPosition(row: number, col: number): boolean {
    const squareName = `${fileLabel(col)}${rankLabel(this.size, row)}`;
    return squareName === this.currentPuzzle.startSquare;
  }

  getShapeAtPosition(row: number, col: number): ShapePosition | undefined {
    return this.shapes.find(s => s.row === row && s.col === col);
  }

  getPieceAtPosition(row: number, col: number): PlacedPiece | undefined {
    if (this.activePiece && this.activePiece.row === row && this.activePiece.col === col) {
      return this.activePiece;
    }
    return undefined;
  }

  get cells(): ChessCell[][] {
    const cells: ChessCell[][] = [];
    const validMoves = this.showValidMoves && this.activePiece ? this.getValidMoves() : [];
    
    for (let row = 0; row < this.size; row++) {
      const rowCells: ChessCell[] = [];
      for (let col = 0; col < this.size; col++) {
        const shape = this.getShapeAtPosition(row, col);
        const piece = this.getPieceAtPosition(row, col);
        const isValidStart = !this.activePiece && this.isValidStartingPosition(row, col);
        const isValidMove = validMoves.some(m => m.row === row && m.col === col);
        
        const customClasses: string[] = [];
        if (isValidStart && !piece) {
          customClasses.push('valid-start');
        }
        if (isValidMove) {
          customClasses.push('valid-move');
        }
        if (shape) {
          customClasses.push('has-shape');
          customClasses.push(shape.captured ? 'captured' : 'uncaptured');
        }

        rowCells.push({
          row,
          col,
          isLight: (row + col) % 2 === 0,
          isDark: (row + col) % 2 !== 0,
          piece: '',
          pieceImage: piece ? getPieceImage(piece.type) : '',
          customClasses,
          data: { label: shape ? this.getShapeSymbol(shape.shape) : '' }
        });
      }
      cells.push(rowCells);
    }
    
    return cells;
  }

  getShapeSymbol(shape: ShapeType): string {
    const symbols: Record<ShapeType, string> = {
      'star': '★',
      'circle': '●',
      'diamond': '◆',
      'triangle': '▲',
      'heart': '♥',
      'square': '■'
    };
    return symbols[shape] || '';
  }

  reset() {
    this.loadPuzzle(this.currentPuzzleIndex);
  }

  undoMove() {
    if (this.moveHistory.length <= 1 || !this.activePiece) return;
    
    // Remove last move
    this.moveHistory.pop();
    this.moveCount = Math.max(0, this.moveCount - 1);
    
    // Move piece back to previous position
    if (this.moveHistory.length > 0) {
      const prevPos = this.moveHistory[this.moveHistory.length - 1];
      this.activePiece.row = prevPos.row;
      this.activePiece.col = prevPos.col;
    }
    
    // Recalculate captured shapes
    this.recalculateCapturedShapes();
  }

  recalculateCapturedShapes() {
    // Reset all shapes
    this.shapes.forEach(s => s.captured = false);
    
    // Replay move history to recapture shapes
    this.moveHistory.forEach(pos => {
      this.captureShapeAtPosition(pos.row, pos.col);
    });
  }

  nextPuzzle() {
    if (this.currentPuzzleIndex < this.filteredPuzzles.length - 1) {
      this.loadPuzzle(this.currentPuzzleIndex + 1);
    } else {
      this.loadPuzzle(0); // Loop back to first puzzle
    }
  }

  previousPuzzle() {
    if (this.currentPuzzleIndex > 0) {
      this.loadPuzzle(this.currentPuzzleIndex - 1);
    } else {
      this.loadPuzzle(this.puzzles.length - 1); // Loop to last puzzle
    }
  }

  fileLabel(i: number) { return fileLabel(i); }
  rankLabel(r: number) { return rankLabel(this.size, r); }
  getPieceSymbol(p: PieceType) { return getPieceSymbol(p); }
}
