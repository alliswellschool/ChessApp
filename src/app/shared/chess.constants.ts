// Chess piece type definitions and constants
export type PieceType = 'queen' | 'rook' | 'bishop' | 'knight' | 'king' | 'pawn';

export interface PieceInfo {
  type: PieceType;
  symbol: string;
  image: string;
  name: string;
}

// Chess pieces with SVG images
export const CHESS_PIECES: Record<PieceType, PieceInfo> = {
  queen: { type: 'queen', symbol: '\u2655', image: '/pieces/alpha/wQ.svg', name: 'Queen' },
  rook: { type: 'rook', symbol: '\u2656', image: '/pieces/alpha/wR.svg', name: 'Rook' },
  bishop: { type: 'bishop', symbol: '\u2657', image: '/pieces/alpha/wB.svg', name: 'Bishop' },
  knight: { type: 'knight', symbol: '\u2658', image: '/pieces/alpha/wN.svg', name: 'Knight' },
  king: { type: 'king', symbol: '\u2654', image: '/pieces/alpha/wK.svg', name: 'King' },
  pawn: { type: 'pawn', symbol: '\u2659', image: '/pieces/alpha/wP.svg', name: 'Pawn' }
};

// Array of all piece types (for iteration)
export const ALL_PIECE_TYPES: PieceType[] = ['queen', 'rook', 'bishop', 'knight', 'king', 'pawn'];

// Helper function to get piece symbol (Unicode fallback)
export function getPieceSymbol(type: PieceType): string {
  return CHESS_PIECES[type].symbol;
}

// Helper function to get piece image path
export function getPieceImage(type: PieceType): string {
  return CHESS_PIECES[type].image;
}

// Helper function to get piece name (capitalized)
export function getPieceName(type: PieceType): string {
  return CHESS_PIECES[type].name;
}

// Helper function to get piece display name (plural form)
export function getPiecePluralName(type: PieceType): string {
  const plurals: Record<PieceType, string> = {
    queen: 'Queens',
    rook: 'Rooks',
    bishop: 'Bishops',
    knight: 'Knights',
    king: 'Kings',
    pawn: 'Pawns'
  };
  return plurals[type];
}

// Board coordinate helper functions
export function fileLabel(index: number): string {
  return String.fromCharCode(97 + index); // a-h
}

export function rankLabel(boardSize: number, row: number): number {
  return boardSize - row; // 8-1 for standard board
}

// Dominance optimal piece counts per board size
// Key: piece type, Value: array indexed by board size [4x4, 5x5, 6x6, 7x7, 8x8]
export const DOMINANCE_OPTIMAL_COUNTS: Record<PieceType, number[]> = {
  rook: [4, 5, 6, 7, 8],
  bishop: [4, 5, 6, 7, 8],
  knight: [4, 5, 8, 10, 12],
  queen: [2, 3, 3, 4, 5],
  king: [4, 4, 4, 9, 9],
  pawn: [8, 12, 18, 25, 28]
};

// Independence puzzle piece counts (8x8 board)
export const INDEPENDENCE_PIECE_COUNTS: Record<PieceType, number> = {
  pawn: 8,
  bishop: 2,
  knight: 2,
  rook: 2,
  queen: 1,
  king: 1
};
