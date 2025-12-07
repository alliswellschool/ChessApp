import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import {
  PieceType,
  ALL_PIECE_TYPES,
  getPieceImage,
  getPieceSymbol,
  fileLabel,
  rankLabel,
  INDEPENDENCE_PIECE_COUNTS
} from '../shared/chess.constants';

type Piece = PieceType | '';

interface BoardCell {
  piece: Piece;
  valid: boolean;
}

@Component({
  selector: 'app-game-of-independence',
  standalone: true,
  imports: [CommonModule, ChessboardComponent],
  templateUrl: './game-of-independence.html',
  styleUrls: ['./game-of-independence.css']
})
export class GameOfIndependence {
  // Modes: single (choose a piece type and board size) or team (place all required pieces)
  mode: 'single' | 'team' = 'single';
  selected: PieceType = 'queen';

  size = 8;
  readonly availableSizes = [4, 5, 6, 7, 8];

  // board state
  board: BoardCell[][] = [];

  // counts for team mode
  requiredCounts: Record<Piece, number> = { ...INDEPENDENCE_PIECE_COUNTS, '': 0 };
  placedCounts: Record<Piece, number> = { pawn: 0, bishop: 0, knight: 0, rook: 0, queen: 0, king: 0, '': 0 };
  validCounts: Record<Piece, number> = { pawn: 0, bishop: 0, knight: 0, rook: 0, queen: 0, king: 0, '': 0 };

  // UI helpers
  pieces = ALL_PIECE_TYPES;
  highlightPath = false;

  constructor() {
    this.resetBoard();
  }

  setMode(m: 'single' | 'team') {
    this.mode = m;
    if (m === 'team') {
      this.size = 8;
    }
    this.resetBoard();
  }

  setSize(n: number) {
    if (n >= 4 && n <= 8) {
      this.size = n;
      this.resetBoard();
    }
  }

  getPieceSymbol(p: Piece) { return p ? getPieceSymbol(p as PieceType) : ''; }
  getPieceImage(p: Piece) { return p ? getPieceImage(p as PieceType) : ''; }
  fileLabel(i: number) { return fileLabel(i); }
  rankLabel(r: number) { return rankLabel(this.size, r); }

  resetBoard() {
    this.board = Array.from({ length: this.size }, () => 
      Array.from({ length: this.size }, () => ({ piece: '', valid: true }))
    );
    for (const k of Object.keys(this.placedCounts) as Piece[]) {
      this.placedCounts[k] = 0;
      this.validCounts[k] = 0;
    }
  }

  // compute attacked squares based on piece and board size
  attacksFrom(piece: Piece, row: number, col: number): Array<[number, number]> {
    const out: Array<[number, number]> = [];
    if (!piece) return out;
    if (piece === 'pawn') {
      if (row - 1 >= 0 && col - 1 >= 0) out.push([row - 1, col - 1]);
      if (row - 1 >= 0 && col + 1 < this.size) out.push([row - 1, col + 1]);
      return out;
    }
    if (piece === 'knight') {
      const moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
      ];
      for (const [dr, dc] of moves) out.push([row + dr, col + dc]);
      return out;
    }
    if (piece === 'king') {
      const moves = [
        [1, 0], [0, 1], [-1, 0], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
      ];
      for (const [dr, dc] of moves) out.push([row + dr, col + dc]);
      return out;
    }

    const directions: Array<[number, number]> = [];
    if (piece === 'rook' || piece === 'queen') directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    if (piece === 'bishop' || piece === 'queen') directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);

    for (const [dr, dc] of directions) {
      let nr = row + dr;
      let nc = col + dc;
      while (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        out.push([nr, nc]);
        if (this.board[nr][nc].piece) break;
        nr += dr; nc += dc;
      }
    }
    return out;
  }

  // Determine threatened squares by current board
  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const p = this.board[r][c].piece;
        if (!p) continue;
        const attacks = this.attacksFrom(p, r, c);
        for (const [ar, ac] of attacks) {
          if (ar >= 0 && ar < this.size && ac >= 0 && ac < this.size) threatened[ar][ac] = true;
        }
      }
    }
    // Do not mark occupied squares as threatened (visual choice)
    for (let r = 0; r < this.size; r++) for (let c = 0; c < this.size; c++) if (this.board[r][c].piece) threatened[r][c] = false;
    return threatened;
  }

  // Required pieces for single-piece modes (mirror per-piece components)
  getRequiredForPiece(piece: Piece, size: number): number {
    if (!piece) return Math.floor((size * size) / 2);
    switch (piece) {
      case 'queen': return size;
      case 'rook': return size;
      case 'bishop': return size * 2 - 2;
      case 'knight':
        switch (size) { case 4: return 8; case 5: return 13; case 6: return 18; case 7: return 25; case 8: return 32; default: return Math.floor((size * size) / 2); }
      case 'pawn':
        switch (size) { case 4: return 8; case 5: return 15; case 6: return 18; case 7: return 28; case 8: return 32; default: return Math.floor((size * size) / 2); }
      case 'king':
        switch (size) { case 4: return 4; case 5: return 9; case 6: return 9; case 7: return 16; case 8: return 16; default: return size * 2; }
      default: return Math.floor((size * size) / 2);
    }
  }

  get requiredPieces(): number {
    if (this.mode === 'team') return 0;
    return this.getRequiredForPiece(this.selected, this.size);
  }

  get isSolvedSingle(): boolean {
    if (this.mode !== 'single') return false;
    const placed = this.placedCounts[this.selected] ?? 0;
    const valid = this.validCounts[this.selected] ?? 0;
    return placed === this.requiredPieces && valid === this.requiredPieces;
  }

  canPlace(row: number, col: number, piece: Piece): boolean {
    if (this.board[row][col].piece) return false;
    const threatened = this.threatenedSquares;
    if (threatened[row][col]) return false;
    const attacks = this.attacksFrom(piece, row, col);
    for (const [ar, ac] of attacks) {
      if (ar >= 0 && ar < this.size && ac >= 0 && ac < this.size) {
        if (this.board[ar][ac].piece) return false;
      }
    }
    return true;
  }

  placeOrRemove(row: number, col: number): void {
    const existing = this.board[row][col].piece;
    if (existing) {
      this.board[row][col] = { piece: '', valid: true };
      this.placedCounts[existing]--;
      this.recalculateValidPieces();
      return;
    }

    const toPlace: Piece = this.mode === 'team' ? this.selected : this.selected;
    const valid = this.canPlace(row, col, toPlace);
    this.board[row][col] = { piece: toPlace, valid };
    this.placedCounts[toPlace]++;
    this.recalculateValidPieces();
  }

  recalculateValidPieces(): void {
    for (const k of Object.keys(this.validCounts) as Piece[]) this.validCounts[k] = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = this.board[r][c];
        if (cell.piece) {
          const isValid = this.isPieceValid(r, c);
          cell.valid = isValid;
          if (isValid) this.validCounts[cell.piece]++;
        }
      }
    }
  }

  isPieceValid(row: number, col: number): boolean {
    const cell = this.board[row][col];
    const current = cell.piece;
    if (!current) return true;
    this.board[row][col] = { piece: '', valid: true };
    const valid = this.canPlace(row, col, current);
    this.board[row][col] = { piece: current, valid: cell.valid };
    return valid;
  }

  get isSolved(): boolean {
    if (this.mode !== 'team') return false;
    for (const p of ['pawn','bishop','knight','rook','queen','king'] as Piece[]) {
      if (this.placedCounts[p] !== this.requiredCounts[p]) return false;
      if (this.validCounts[p] !== this.requiredCounts[p]) return false;
    }
    return true;
  }

  // Map internal board to ChessCell[][] for shared chessboard rendering
  get cells(): ChessCell[][] {
    const threatened = this.threatenedSquares;
    return this.board.map((row, r) => row.map((cell, c) => ({
      row: r,
      col: c,
      isLight: (r + c) % 2 === 0,
      isDark: (r + c) % 2 !== 0,
      // Use alpha SVG images only to avoid double-rendering of symbol + image
      piece: '',
      pieceImage: cell.piece ? this.getPieceImage(cell.piece) : undefined,
      hasPiece: !!cell.piece,
      hasInvalidPiece: cell.piece ? !cell.valid : false,
      customClasses: cell.valid ? [] : ['has-invalid-piece'],
      dominated: this.highlightPath && threatened[r][c] && !cell.piece,
      blocked: this.highlightPath && threatened[r][c] && !cell.piece,
      data: {}
    })));
  }
}
