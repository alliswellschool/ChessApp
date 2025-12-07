import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceType, PieceInfo } from '../chess.constants';

export interface PieceCount {
  current: number;
  required: number;
}

@Component({
  selector: 'app-piece-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piece-selector.component.html',
  styleUrls: ['./piece-selector.component.css']
})
export class PieceSelectorComponent {
  @Input() pieces: PieceInfo[] = [];
  @Input() selectedPiece: PieceType = 'queen';
  @Input() showCounts: boolean = false;
  @Input() pieceCounts?: Map<PieceType, PieceCount>;
  @Output() pieceSelected = new EventEmitter<PieceType>();

  onPieceClick(type: PieceType): void {
    this.pieceSelected.emit(type);
  }

  getPieceCount(type: PieceType): PieceCount | null {
    if (!this.showCounts || !this.pieceCounts) return null;
    return this.pieceCounts.get(type) || null;
  }
}
