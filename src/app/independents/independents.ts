import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EightQueens } from '../independence-components/eight-queens/eight-queens';
import { Bishops } from '../independence-components/bishops/bishops';
import { Knights } from '../independence-components/knights/knights';
import { Rooks } from '../independence-components/rooks/rooks';
import { Kings } from '../independence-components/kings/kings';
import { Pawns } from '../independence-components/pawns/pawns';
import { AllPieces } from '../independence-components/all-pieces/all-pieces';

type ModeKey = 'queens' | 'bishops' | 'knights' | 'rooks' | 'kings' | 'pawns' | 'all';

@Component({
  selector: 'app-independents',
  standalone: true,
  imports: [CommonModule, FormsModule, EightQueens, Bishops, Knights, Rooks, Kings, Pawns, AllPieces],
  templateUrl: './independents.html',
  styleUrls: ['./independents.css']
})


export class Independents {
  @ViewChild('allPiecesComponent') allPiecesComponent?: AllPieces;
  
  mode: 'single' | 'team' = 'single';
  selected: ModeKey = 'queens';

  // shared board size for individual puzzle modes (4..8)
  size = 8;
  readonly availableSizes = [4,5,6,7,8];

  setSize(n: number){ if (n>=4 && n<=8) this.size = n; }

  setMode(m: 'single' | 'team') {
    this.mode = m;
    if (m === 'team') {
      this.selected = 'all';
      this.size = 8;
    } else {
      this.selected = 'queens';
    }
  }

  readonly modes: Array<{ key: ModeKey, label: string }> = [
    { key: 'queens', label: 'Queens' },
    { key: 'bishops', label: 'Bishops' },
    { key: 'knights', label: 'Knights' },
    { key: 'rooks', label: 'Rooks' },
    { key: 'kings', label: 'Kings' },
    { key: 'pawns', label: 'Pawns' },
    { key: 'all', label: 'All' }
  ];

  modeSymbols: Record<ModeKey, string> = {
    queens: '\u2655',
    bishops: '\u2657',
    knights: '\u2658',
    rooks: '\u2656',
    kings: '\u2654',
    pawns: '\u2659',
    all: '\u263A'
  };

  modeImages: Record<ModeKey, string> = {
    queens: '/pieces/alpha/wQ.svg',
    bishops: '/pieces/alpha/wB.svg',
    knights: '/pieces/alpha/wN.svg',
    rooks: '/pieces/alpha/wR.svg',
    kings: '/pieces/alpha/wK.svg',
    pawns: '/pieces/alpha/wP.svg',
    all: '/pieces/alpha/wK.svg' // Using King for "all pieces" mode
  };

  getSymbol(k: ModeKey): string {
    return this.modeSymbols[k] ?? '';
  }

  getImage(k: ModeKey): string {
    return this.modeImages[k] ?? '';
  }
}
