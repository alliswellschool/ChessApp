import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import { PieceSelectorComponent } from '../shared/piece-selector/piece-selector.component';
import {
  PieceType,
  getPieceImage,
  getPieceSymbol,
  fileLabel,
  rankLabel
} from '../shared/chess.constants';
import { ProgressService } from '../services/progress.service';

type ShapeType = 'star' | 'circle' | 'diamond' | 'triangle' | 'heart' | 'square' | 'pentagon' | 'hexagon';

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
  imports: [CommonModule, ChessboardComponent, PieceSelectorComponent],
  templateUrl: './capture-the-shapes.html',
  styleUrls: ['./capture-the-shapes.css']
})
export class CaptureTheShapes {
  private progressService = inject(ProgressService);
  
  size = 8;
  
  currentBoardIndex = 0;
  currentPositionIndex = 0;
  shapes: ShapePosition[] = [];
  
  // Movement-based system
  activePiece: PlacedPiece | null = null; // Currently active piece on board
  moveCount = 0; // Total moves made in current puzzle
  moveHistory: Array<{row: number; col: number}> = []; // Track piece positions
  bestScores: Record<number, number> = {}; // Best scores per puzzle: puzzleId -> score
  
  showValidMoves = true;
  gameCompleted = false;
  
  // User progress data for tracking completed puzzles
  private userProgressData: any = null;
  
  // Piece filter
  selectedPieceFilter: PieceType | 'all' = 'all';
  availablePieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king'];

  // Board shape configurations
  private board1Shapes = [
    { row: 6, col: 0, shape: 'triangle' as ShapeType },
    { row: 4, col: 1, shape: 'diamond' as ShapeType },
    { row: 2, col: 2, shape: 'star' as ShapeType },
    { row: 1, col: 3, shape: 'circle' as ShapeType },
    { row: 5, col: 4, shape: 'square' as ShapeType },
    { row: 6, col: 5, shape: 'pentagon' as ShapeType },
    { row: 1, col: 6, shape: 'hexagon' as ShapeType },
    { row: 3, col: 7, shape: 'heart' as ShapeType },
  ];

  private board2Shapes = [
    { row: 3, col: 0, shape: 'triangle' as ShapeType },
    { row: 6, col: 1, shape: 'diamond' as ShapeType },
    { row: 1, col: 2, shape: 'star' as ShapeType },
    { row: 2, col: 3, shape: 'circle' as ShapeType },
    { row: 4, col: 4, shape: 'square' as ShapeType },
    { row: 1, col: 5, shape: 'pentagon' as ShapeType },
    { row: 6, col: 6, shape: 'hexagon' as ShapeType },
    { row: 5, col: 7, shape: 'heart' as ShapeType },
  ];

  private board3Shapes = [
    { row: 4, col: 0, shape: 'triangle' as ShapeType },
    { row: 1, col: 1, shape: 'star' as ShapeType },
    { row: 3, col: 2, shape: 'circle' as ShapeType },
    { row: 6, col: 3, shape: 'diamond' as ShapeType },
    { row: 1, col: 4, shape: 'pentagon' as ShapeType },
    { row: 4, col: 5, shape: 'square' as ShapeType },
    { row: 2, col: 6, shape: 'heart' as ShapeType },
    { row: 5, col: 7, shape: 'hexagon' as ShapeType },
  ];

  // Puzzle definitions - 48 total puzzles (3 boards x 16 variations per board)
  puzzles: PuzzleData[] = [
    // BOARD 1 - Rook puzzles (4)
    { id: 1, pieceType: 'rook', startSquare: 'a1', shapes: this.board1Shapes },
    { id: 2, pieceType: 'rook', startSquare: 'a8', shapes: this.board1Shapes },
    { id: 3, pieceType: 'rook', startSquare: 'h1', shapes: this.board1Shapes },
    { id: 4, pieceType: 'rook', startSquare: 'h8', shapes: this.board1Shapes },
    // BOARD 1 - Knight puzzles (4)
    { id: 5, pieceType: 'knight', startSquare: 'b1', shapes: this.board1Shapes },
    { id: 6, pieceType: 'knight', startSquare: 'b8', shapes: this.board1Shapes },
    { id: 7, pieceType: 'knight', startSquare: 'g1', shapes: this.board1Shapes },
    { id: 8, pieceType: 'knight', startSquare: 'g8', shapes: this.board1Shapes },
    // BOARD 1 - Bishop puzzles (4)
    { id: 9, pieceType: 'bishop', startSquare: 'c1', shapes: this.board1Shapes },
    { id: 10, pieceType: 'bishop', startSquare: 'c8', shapes: this.board1Shapes },
    { id: 11, pieceType: 'bishop', startSquare: 'f1', shapes: this.board1Shapes },
    { id: 12, pieceType: 'bishop', startSquare: 'f8', shapes: this.board1Shapes },
    // BOARD 1 - Queen puzzles (2)
    { id: 13, pieceType: 'queen', startSquare: 'd1', shapes: this.board1Shapes },
    { id: 14, pieceType: 'queen', startSquare: 'd8', shapes: this.board1Shapes },
    // BOARD 1 - King puzzles (2)
    { id: 15, pieceType: 'king', startSquare: 'e1', shapes: this.board1Shapes },
    { id: 16, pieceType: 'king', startSquare: 'e8', shapes: this.board1Shapes },

    // BOARD 2 - Rook puzzles (4)
    { id: 17, pieceType: 'rook', startSquare: 'a1', shapes: this.board2Shapes },
    { id: 18, pieceType: 'rook', startSquare: 'a8', shapes: this.board2Shapes },
    { id: 19, pieceType: 'rook', startSquare: 'h1', shapes: this.board2Shapes },
    { id: 20, pieceType: 'rook', startSquare: 'h8', shapes: this.board2Shapes },
    // BOARD 2 - Knight puzzles (4)
    { id: 21, pieceType: 'knight', startSquare: 'b1', shapes: this.board2Shapes },
    { id: 22, pieceType: 'knight', startSquare: 'b8', shapes: this.board2Shapes },
    { id: 23, pieceType: 'knight', startSquare: 'g1', shapes: this.board2Shapes },
    { id: 24, pieceType: 'knight', startSquare: 'g8', shapes: this.board2Shapes },
    // BOARD 2 - Bishop puzzles (4)
    { id: 25, pieceType: 'bishop', startSquare: 'c1', shapes: this.board2Shapes },
    { id: 26, pieceType: 'bishop', startSquare: 'c8', shapes: this.board2Shapes },
    { id: 27, pieceType: 'bishop', startSquare: 'f1', shapes: this.board2Shapes },
    { id: 28, pieceType: 'bishop', startSquare: 'f8', shapes: this.board2Shapes },
    // BOARD 2 - Queen puzzles (2)
    { id: 29, pieceType: 'queen', startSquare: 'd1', shapes: this.board2Shapes },
    { id: 30, pieceType: 'queen', startSquare: 'd8', shapes: this.board2Shapes },
    // BOARD 2 - King puzzles (2)
    { id: 31, pieceType: 'king', startSquare: 'e1', shapes: this.board2Shapes },
    { id: 32, pieceType: 'king', startSquare: 'e8', shapes: this.board2Shapes },

    // BOARD 3 - Rook puzzles (4)
    { id: 33, pieceType: 'rook', startSquare: 'a1', shapes: this.board3Shapes },
    { id: 34, pieceType: 'rook', startSquare: 'a8', shapes: this.board3Shapes },
    { id: 35, pieceType: 'rook', startSquare: 'h1', shapes: this.board3Shapes },
    { id: 36, pieceType: 'rook', startSquare: 'h8', shapes: this.board3Shapes },
    // BOARD 3 - Knight puzzles (4)
    { id: 37, pieceType: 'knight', startSquare: 'b1', shapes: this.board3Shapes },
    { id: 38, pieceType: 'knight', startSquare: 'b8', shapes: this.board3Shapes },
    { id: 39, pieceType: 'knight', startSquare: 'g1', shapes: this.board3Shapes },
    { id: 40, pieceType: 'knight', startSquare: 'g8', shapes: this.board3Shapes },
    // BOARD 3 - Bishop puzzles (4)
    { id: 41, pieceType: 'bishop', startSquare: 'c1', shapes: this.board3Shapes },
    { id: 42, pieceType: 'bishop', startSquare: 'c8', shapes: this.board3Shapes },
    { id: 43, pieceType: 'bishop', startSquare: 'f1', shapes: this.board3Shapes },
    { id: 44, pieceType: 'bishop', startSquare: 'f8', shapes: this.board3Shapes },
    // BOARD 3 - Queen puzzles (2)
    { id: 45, pieceType: 'queen', startSquare: 'd1', shapes: this.board3Shapes },
    { id: 46, pieceType: 'queen', startSquare: 'd8', shapes: this.board3Shapes },
    // BOARD 3 - King puzzles (2)
    { id: 47, pieceType: 'king', startSquare: 'e1', shapes: this.board3Shapes },
    { id: 48, pieceType: 'king', startSquare: 'e8', shapes: this.board3Shapes },
  ];

  get filteredPuzzles(): PuzzleData[] {
    // Get puzzles for current board only (16 per board: ids 1-16, 17-32, 33-48)
    const startId = this.currentBoardIndex * 16 + 1;
    const endId = startId + 16;
    const boardPuzzles = this.puzzles.filter(p => p.id >= startId && p.id < endId);
    
    // Filter by selected piece type
    if (this.selectedPieceFilter === 'all') {
      return boardPuzzles;
    }
    return boardPuzzles.filter(p => p.pieceType === this.selectedPieceFilter);
  }

  get maxPositions(): number {
    if (this.selectedPieceFilter === 'all') return 16;
    // Rook, Knight, Bishop: 4 positions each
    // Queen, King: 2 positions each
    if (this.selectedPieceFilter === 'queen' || this.selectedPieceFilter === 'king') {
      return 2;
    }
    return 4;
  }

  get currentPuzzle(): PuzzleData {
    return this.filteredPuzzles[this.currentPositionIndex];
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
    this.loadPuzzle();
    this.loadProgressData();
  }
  
  async loadProgressData(): Promise<void> {
    try {
      this.userProgressData = await this.progressService.getPuzzleProgress('captureTheShapes');
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  }
  
  isCompletedBoard(boardIndex: number): boolean {
    if (!this.userProgressData?.completedPuzzles) {
      return false;
    }
    
    const completedPuzzleIds = this.userProgressData.completedPuzzles as number[];
    const startId = boardIndex * 16 + 1;
    const endId = startId + 16;
    
    // Check if at least one puzzle is completed in this board
    return completedPuzzleIds.some(id => id >= startId && id < endId);
  }

  loadPuzzle() {
    const puzzle = this.currentPuzzle;
    this.shapes = puzzle.shapes.map(s => ({ ...s, captured: false }));
    this.gameCompleted = false;
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
    this.currentPositionIndex = 0; // Reset to first position when piece filter changes
    this.loadPuzzle();
  }

  onPieceSelected(pieceType: PieceType): void {
    this.onPieceFilterChange(pieceType);
  }

  get availablePieceInfo() {
    return this.availablePieces.map(type => ({
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      symbol: getPieceSymbol(type),
      image: getPieceImage(type)
    }));
  }

  get completedPieces(): Set<PieceType> {
    const completed = new Set<PieceType>();
    
    if (!this.userProgressData?.completedPuzzles) {
      return completed;
    }
    
    const completedPuzzleIds = this.userProgressData.completedPuzzles as number[];
    
    // Check if all puzzles for each piece are completed (4 positions per piece type, 3 boards)
    // Rook: ids 1-4, 17-20, 33-36 (12 puzzles total)
    // Knight: ids 5-8, 21-24, 37-40
    // Bishop: ids 9-12, 25-28, 41-44
    // Queen: ids 13-14, 29-30, 45-46 (6 puzzles total)
    // King: ids 15-16, 31-32, 47-48 (6 puzzles total)
    
    const pieceRanges: Record<PieceType, number[][]> = {
      rook: [[1, 4], [17, 20], [33, 36]],
      knight: [[5, 8], [21, 24], [37, 40]],
      bishop: [[9, 12], [25, 28], [41, 44]],
      queen: [[13, 14], [29, 30], [45, 46]],
      king: [[15, 16], [31, 32], [47, 48]],
      pawn: [] // Pawn not used in Capture the Shapes
    };
    
    this.availablePieces.forEach(piece => {
      const ranges = pieceRanges[piece];
      let allCompleted = true;
      
      for (const [start, end] of ranges) {
        let rangeComplete = false;
        for (let id = start; id <= end; id++) {
          if (completedPuzzleIds.includes(id)) {
            rangeComplete = true;
            break;
          }
        }
        if (!rangeComplete) {
          allCompleted = false;
          break;
        }
      }
      
      if (allCompleted) {
        completed.add(piece);
      }
    });
    
    return completed;
  }

  get currentSelectedPieceType(): PieceType {
    return this.selectedPieceFilter === 'all' ? 'queen' : this.selectedPieceFilter;
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
      // Track progress - lower moveCount is better, so invert for score
      const score = Math.max(100 - this.moveCount, 10); // Higher score for fewer moves
      this.progressService.trackCompletion('captureTheShapes', {
        score: score,
        puzzleId: this.currentPuzzle.id
      });
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
          customClasses.push(`shape-${shape.shape}`);
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
      'square': '■',
      'pentagon': '⬠',
      'hexagon': '⬡'
    };
    return symbols[shape] || '';
  }

  reset() {
    this.loadPuzzle();
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

  nextBoard() {
    if (this.currentBoardIndex < 2) {
      this.currentBoardIndex++;
      this.currentPositionIndex = 0;
      this.loadPuzzle();
    }
  }

  previousBoard() {
    if (this.currentBoardIndex > 0) {
      this.currentBoardIndex--;
      this.currentPositionIndex = 0;
      this.loadPuzzle();
    }
  }

  nextPosition() {
    if (this.currentPositionIndex < this.filteredPuzzles.length - 1) {
      this.currentPositionIndex++;
      this.loadPuzzle();
    }
  }

  previousPosition() {
    if (this.currentPositionIndex > 0) {
      this.currentPositionIndex--;
      this.loadPuzzle();
    }
  }

  fileLabel(i: number) { return fileLabel(i); }
  rankLabel(r: number) { return rankLabel(this.size, r); }
  getPieceSymbol(p: PieceType) { return getPieceSymbol(p); }
}
