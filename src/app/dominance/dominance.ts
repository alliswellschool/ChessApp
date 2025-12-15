import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PieceType, 
  PieceInfo, 
  CHESS_PIECES, 
  ALL_PIECE_TYPES, 
  getPieceSymbol,
  getPieceImage,
  fileLabel,
  rankLabel,
  DOMINANCE_OPTIMAL_COUNTS
} from '../shared/chess.constants';
import { ChessboardComponent, ChessCell } from '../shared/chessboard/chessboard.component';
import { getDominanceVictoryMessage } from '../shared/dominance-messages';
import { PieceSelectorComponent, PieceCount } from '../shared/piece-selector/piece-selector.component';
import { VictoryModalComponent, VictoryButton, VictoryStat } from '../shared/victory-modal/victory-modal.component';

type Team = 'white' | 'black';
interface TeamPiece { type: PieceType; team: Team }

@Component({
  selector: 'app-dominance',
  standalone: true,
  imports: [CommonModule, FormsModule, ChessboardComponent, PieceSelectorComponent, VictoryModalComponent],
  templateUrl: './dominance.html',
  styleUrls: ['./dominance.css']
})
export class Dominance {
  // Game of Dominance - Minimum pieces to dominate entire board
  // Goal: Use the minimum number of pieces to dominate all squares
  
  // Modes: single-piece dominance challenge OR Team Dominance (8 powers)
  mode: 'single' | 'team' = 'single';

  size = 8;
  board: (PieceType | '')[][] = [];
  cells: ChessCell[][] = []; // For ChessboardComponent
  selectedPiece: PieceType = 'queen';
  highlightDominated = true;
  availableSizes = [4, 5, 6, 7, 8];
  showVictoryModal = false;
  showFullCoverageModal = false;

  // Team Dominance exact set (8 powers, no pawns): K×1, Q×1, R×2, B×2, N×2
  private readonly teamInventory: Record<PieceType, number> = {
    king: 1,
    queen: 1,
    rook: 2,
    bishop: 2,
    knight: 2,
    pawn: 0
  };
  private readonly teamTotalPieces = 8;

  get availablePieces(): PieceInfo[] {
    const types = this.mode === 'team'
      ? (['king','queen','rook','bishop','knight'] as PieceType[]) // no pawns in team mode
      : ALL_PIECE_TYPES;
    return types.map(t => CHESS_PIECES[t]);
  }

  get pieceCountsMap(): Map<PieceType, PieceCount> {
    const map = new Map<PieceType, PieceCount>();
    this.availablePieces.forEach(piece => {
      map.set(piece.type, {
        current: this.getPieceCount(piece.type),
        required: this.getRequiredPieces(piece.type)
      });
    });
    return map;
  }

  fileLabel(index: number): string { return fileLabel(index); }
  rankLabel(row: number): number { return rankLabel(this.size, row); }
  
  getPieceCount(type: PieceType): number {
    return this.pieceCounts[type];
  }
  
  pieceCounts: Record<PieceType, number> = {
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    king: 0,
    pawn: 0
  };
  
  // Team mode removed; keeping single-player only
  
  // Exact number of pieces required for each board size from constants
  private requiredPiecesData = DOMINANCE_OPTIMAL_COUNTS;
  
  constructor() {
    this.initializeBoard();
  }
  
  initializeBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.cells = Array.from({ length: this.size }, (_, row) =>
      Array.from({ length: this.size }, (_, col) => ({
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0
      }))
    );
    this.resetCounts();
    this.updateCells();
  }
  
  // Team board removed
  
  resetCounts(): void {
    this.pieceCounts = {
      queen: 0,
      rook: 0,
      bishop: 0,
      knight: 0,
      king: 0,
      pawn: 0
    };
  }
  
  // Team counts removed
  
  changeSize(newSize: number): void {
    // In Team mode, board is fixed to 8x8
    if (this.mode === 'team') {
      this.size = 8;
      return;
    }
    this.size = newSize;
    this.initializeBoard();
  }

  setMode(mode: 'single' | 'team'): void {
    if (this.mode === mode) return;
    this.mode = mode;
    // Team mode requires 8x8 and resets board and counts
    if (this.mode === 'team') {
      this.size = 8;
      // Ensure selected piece is valid (no pawns in team mode)
      if (this.selectedPiece === 'pawn') {
        this.selectedPiece = 'queen';
      }
    }
    this.resetBoard(this.selectedPiece);
  }
  
  getRequiredPieces(type: PieceType): number {
    if (this.mode === 'team') {
      // Exact requirement for victory in Team mode
      return this.teamInventory[type] || 0;
    }
    const sizeIndex = this.availableSizes.indexOf(this.size);
    return this.requiredPiecesData[type]?.[sizeIndex] || 0;
  }
  
  getTotalPieces(): number {
    return Object.values(this.pieceCounts).reduce((sum, count) => sum + count, 0);
  }
  
  selectPiece(type: PieceType): void {
    if (this.selectedPiece === type) return;
    this.selectedPiece = type;
    // In Single mode, switching piece resets the challenge board to keep one-piece-type constraint
    if (this.mode === 'single') {
      this.resetBoard(type);
    }
  }
  
  // Team mode controls removed
  
  canPlacePiece(row: number, col: number): boolean {
    // Can place only on empty squares
    if (this.board[row][col]) return false;
    // Both modes: unlimited placement (team mode forbids pawns via availablePieces)
    return true;
  }
  
  placeOrRemovePiece(row: number, col: number): void {
    // Prevent placing new pieces after 100% coverage is achieved
    if (this.dominationPercentage === 100 && !this.board[row][col]) {
      return;
    }
    
    if (this.board[row][col]) {
      // Remove piece
      const pieceType = this.board[row][col];
      this.board[row][col] = '';
      this.pieceCounts[pieceType]--;
      this.showVictoryModal = false;
      this.showFullCoverageModal = false;
    } else if (this.selectedPiece && this.canPlacePiece(row, col)) {
      // Place piece
      this.board[row][col] = this.selectedPiece;
      this.pieceCounts[this.selectedPiece]++;
    }
    this.updateCells();
    
    // Check for victory or full coverage after placing
    if (this.dominationPercentage === 100) {
      if (this.hasWon) {
        this.showVictoryModal = true;
      } else {
        this.showFullCoverageModal = true;
      }
    }
  }

  onCellClick(event: { row: number; col: number; cell: ChessCell }): void {
    this.placeOrRemovePiece(event.row, event.col);
  }

  updateCells(): void {
    const dominated = this.dominatedSquares;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.board[row][col];
        this.cells[row][col] = {
          row,
          col,
          isLight: (row + col) % 2 === 0,
          isDark: (row + col) % 2 !== 0,
          pieceImage: piece ? this.getPieceImage(piece) : undefined,
          // Only mark empty squares as dominated visually. If a piece
          // occupies the square we avoid the overlay so the piece image
          // remains clear and not dulled by the pseudo-element overlay.
          dominated: this.highlightDominated && dominated.has(`${row},${col}`) && !piece,
          hasPiece: !!piece,
          blocked: false
        };
      }
    }
  }
  
  resetBoard(selectedType: PieceType = this.selectedPiece): void {
    this.initializeBoard();
    this.selectedPiece = selectedType;
    this.showVictoryModal = false;
    this.showFullCoverageModal = false;
  }
  
  get victoryStats(): VictoryStat[] {
    return [
      { label: 'Total Pieces', value: this.getTotalPieces() },
      { label: 'Squares Dominated', value: `${this.dominationCount} / ${this.size * this.size}` },
      { label: 'Coverage', value: `${this.dominationPercentage}%` }
    ];
  }
  
  get victoryButtons(): VictoryButton[] {
    return [
      { label: 'Try Again', action: 'try-again', style: 'secondary' },
      { label: 'Continue', action: 'close', style: 'primary' }
    ];
  }
  
  get fullCoverageButtons(): VictoryButton[] {
    return [
      { label: 'Try Again', action: 'try-again', style: 'primary' }
    ];
  }
  
  get fullCoverageMessage(): string {
    const required = this.getRequiredPieces(this.selectedPiece);
    const current = this.pieceCounts[this.selectedPiece];
    if (current > required) {
      return `You've dominated all squares, but used ${current} ${this.selectedPiece}(s). Try using only ${required} to win!`;
    } else {
      return `You've dominated all squares with ${current} ${this.selectedPiece}(s), but ${required} are required for this board size.`;
    }
  }
  
  handleVictoryAction(action: string): void {
    if (action === 'try-again') {
      this.resetBoard();
    } else if (action === 'close') {
      this.showVictoryModal = false;
    }
  }
  
  handleFullCoverageAction(action: string): void {
    if (action === 'try-again') {
      this.resetBoard();
    }
  }
  
  // Team mode actions removed
  
  getPieceSymbol(type: PieceType | ''): string {
    if (!type) return '';
    return getPieceSymbol(type);
  }

  getPieceImage(type: PieceType | ''): string {
    if (!type) return '';
    return getPieceImage(type);
  }
  
  // Team helpers removed
  
  get dominatedSquares(): Set<string> {
    const dominated = new Set<string>();
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.board[row][col];
        if (piece) {
          dominated.add(`${row},${col}`);
          const attacks = this.getAttackedSquares(row, col, piece);
          attacks.forEach(key => dominated.add(key));
        }
      }
    }
    return dominated;
  }
  
  isDominated(row: number, col: number): boolean {
    return this.dominatedSquares.has(`${row},${col}`);
  }
  
  get dominationCount(): number {
    return this.dominatedSquares.size;
  }
  
  get dominationPercentage(): number {
    const totalSquares = this.size * this.size;
    return Math.round((this.dominationCount / totalSquares) * 100);
  }
  
  get hasWon(): boolean {
    // Must dominate all squares first
    if (this.dominationPercentage !== 100) return false;

    if (this.mode === 'team') {
      // Victory only when exact 8 powers are placed with correct counts on 8x8
      const exactCounts =
        this.size === 8 &&
        this.pieceCounts.pawn === 0 &&
        this.pieceCounts.king === this.teamInventory.king &&
        this.pieceCounts.queen === this.teamInventory.queen &&
        this.pieceCounts.rook === this.teamInventory.rook &&
        this.pieceCounts.bishop === this.teamInventory.bishop &&
        this.pieceCounts.knight === this.teamInventory.knight &&
        this.getTotalPieces() === this.teamTotalPieces;
      return exactCounts;
    }

    // Single mode: require that player used no more pieces of the selected type
    // than the minimal expected count for that piece. This prevents showing a
    // victory when the board is dominated but the player used more pieces
    // than the optimal solution requires.
    const required = this.getRequiredPieces(this.selectedPiece);
    return this.pieceCounts[this.selectedPiece] <= required;
  }
  
  get isOptimal(): boolean {
    if (this.mode === 'team') return this.hasWon; // Team mode: optimal equals satisfying exact set
    if (!this.hasWon) return false;
    // Single-mode: optimal if used the minimal count for the selected piece type
    return this.pieceCounts[this.selectedPiece] === this.getRequiredPieces(this.selectedPiece);
  }
  
  getRookAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    
    // Right
    for (let c = col + 1; c < this.size; c++) {
      attacks.push(`${row},${c}`);
      if (this.board[row][c]) break; // Blocked by piece
    }
    
    // Left
    for (let c = col - 1; c >= 0; c--) {
      attacks.push(`${row},${c}`);
      if (this.board[row][c]) break;
    }
    
    // Down
    for (let r = row + 1; r < this.size; r++) {
      attacks.push(`${r},${col}`);
      if (this.board[r][col]) break;
    }
    
    // Up
    for (let r = row - 1; r >= 0; r--) {
      attacks.push(`${r},${col}`);
      if (this.board[r][col]) break;
    }
    
    return attacks;
  }
  
  // Team attack helpers removed
  
  getBishopAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    
    // Down-right diagonal
    for (let i = 1; row + i < this.size && col + i < this.size; i++) {
      attacks.push(`${row + i},${col + i}`);
      if (this.board[row + i][col + i]) break;
    }
    
    // Down-left diagonal
    for (let i = 1; row + i < this.size && col - i >= 0; i++) {
      attacks.push(`${row + i},${col - i}`);
      if (this.board[row + i][col - i]) break;
    }
    
    // Up-right diagonal
    for (let i = 1; row - i >= 0 && col + i < this.size; i++) {
      attacks.push(`${row - i},${col + i}`);
      if (this.board[row - i][col + i]) break;
    }
    
    // Up-left diagonal
    for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
      attacks.push(`${row - i},${col - i}`);
      if (this.board[row - i][col - i]) break;
    }
    
    return attacks;
  }
  
  
  getKnightAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    const moves = [
      [2, 1], [1, 2], [-1, 2], [-2, 1],
      [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];
    
    for (const [dr, dc] of moves) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        attacks.push(`${nr},${nc}`);
      }
    }
    
    return attacks;
  }
  
  
  getKingAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        attacks.push(`${nr},${nc}`);
      }
    }
    
    return attacks;
  }
  
  
  getPawnAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    // Pawns attack diagonally forward (assuming white pawns moving up)
    if (row > 0) {
      if (col > 0) attacks.push(`${row - 1},${col - 1}`);
      if (col < this.size - 1) attacks.push(`${row - 1},${col + 1}`);
    }
    return attacks;
  }
  
  
  getVictoryMessage(): string {
    if (this.mode === 'team') {
      return '🎉 Team Dominance solved! All squares controlled with the 8 powers.';
    }
    return getDominanceVictoryMessage(this.selectedPiece, this.size, this.isOptimal);
  }
  
  closeVictoryModal(): void {
    this.showVictoryModal = false;
  }

  selectNextPiece(): void {
    const currentPieces = this.availablePieces;
    const currentIndex = currentPieces.findIndex(p => p.type === this.selectedPiece);
    const nextIndex = (currentIndex + 1) % currentPieces.length;
    const nextPiece = currentPieces[nextIndex].type;
    this.resetBoard(nextPiece);
    this.closeVictoryModal();
  }
  
  getAttackedSquares(row: number, col: number, piece: PieceType): string[] {
    switch (piece) {
      case 'queen':
        return [...this.getRookAttacks(row, col), ...this.getBishopAttacks(row, col)];
      case 'rook':
        return this.getRookAttacks(row, col);
      case 'bishop':
        return this.getBishopAttacks(row, col);
      case 'knight':
        return this.getKnightAttacks(row, col);
      case 'king':
        return this.getKingAttacks(row, col);
      case 'pawn':
        return this.getPawnAttacks(row, col);
      default:
        return [];
    }
  }
  
  // Team attack dispatcher removed
}

