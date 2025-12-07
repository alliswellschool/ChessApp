/**
 * Victory messages for Game of Dominance
 * Customized messages for each piece type and board size combination
 */

import { PieceType } from './chess.constants';

type DominanceMessage = {
  optimal: string;
  suboptimal: string;
};

export const DOMINANCE_VICTORY_MESSAGES: Record<PieceType, Record<number, DominanceMessage>> = {
  queen: {
    4: {
      optimal: '🎉 Perfect! 2 queens can dominate a 4×4 board - the minimum possible!',
      suboptimal: '✓ All squares controlled! However, only 2 queens are needed for a 4×4 board.'
    },
    5: {
      optimal: '🎉 Excellent! 3 queens dominate a 5×5 board - the optimal solution!',
      suboptimal: '✓ All squares controlled! The optimal solution uses just 3 queens.'
    },
    6: {
      optimal: '🎉 Outstanding! 3 queens perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 3 queens for the optimal solution.'
    },
    7: {
      optimal: '🎉 Amazing! 4 queens control all squares on a 7×7 board - minimal coverage!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 4 queens.'
    },
    8: {
      optimal: '🎉 Brilliant! 5 queens dominate the entire 8×8 board - the classic solution!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 5 queens.'
    }
  },
  
  rook: {
    4: {
      optimal: '🎉 Perfect! 4 rooks dominate a 4×4 board - one per rank!',
      suboptimal: '✓ All squares controlled! The optimal solution needs 4 rooks.'
    },
    5: {
      optimal: '🎉 Excellent! 5 rooks cover all squares on a 5×5 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 5 rooks.'
    },
    6: {
      optimal: '🎉 Outstanding! 6 rooks perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 6 rooks.'
    },
    7: {
      optimal: '🎉 Amazing! 7 rooks control the entire 7×7 board!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 7 rooks.'
    },
    8: {
      optimal: '🎉 Brilliant! 8 rooks dominate the full 8×8 board - the classic pattern!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 8 rooks.'
    }
  },
  
  bishop: {
    4: {
      optimal: '🎉 Perfect! 4 bishops dominate a 4×4 board with diagonal power!',
      suboptimal: '✓ All squares controlled! The optimal solution needs 4 bishops.'
    },
    5: {
      optimal: '🎉 Excellent! 5 bishops cover all squares on a 5×5 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 5 bishops.'
    },
    6: {
      optimal: '🎉 Outstanding! 10 bishops perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 10 bishops.'
    },
    7: {
      optimal: '🎉 Amazing! 10 bishops control the entire 7×7 board with diagonal mastery!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 10 bishops.'
    },
    8: {
      optimal: '🎉 Brilliant! 14 bishops dominate the full 8×8 board - impressive diagonal coverage!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 14 bishops.'
    }
  },
  
  knight: {
    4: {
      optimal: '🎉 Perfect! 4 knights dominate a 4×4 board with L-shaped moves!',
      suboptimal: '✓ All squares controlled! The optimal solution needs 4 knights.'
    },
    5: {
      optimal: '🎉 Excellent! 5 knights cover all squares on a 5×5 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 5 knights.'
    },
    6: {
      optimal: '🎉 Outstanding! 8 knights perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 8 knights.'
    },
    7: {
      optimal: '🎉 Amazing! 10 knights control the entire 7×7 board!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 10 knights.'
    },
    8: {
      optimal: '🎉 Brilliant! 12 knights dominate the full 8×8 board - extraordinary coverage!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 12 knights.'
    }
  },
  
  king: {
    4: {
      optimal: '🎉 Perfect! 4 kings dominate a 4×4 board with royal presence!',
      suboptimal: '✓ All squares controlled! The optimal solution needs 4 kings.'
    },
    5: {
      optimal: '🎉 Excellent! 5 kings cover all squares on a 5×5 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 5 kings.'
    },
    6: {
      optimal: '🎉 Outstanding! 9 kings perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 9 kings.'
    },
    7: {
      optimal: '🎉 Amazing! 10 kings control the entire 7×7 board!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 10 kings.'
    },
    8: {
      optimal: '🎉 Brilliant! 9 kings dominate the full 8×8 board - royal dominance!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 9 kings.'
    }
  },
  
  pawn: {
    4: {
      optimal: '🎉 Perfect! 4 pawns dominate a 4×4 board!',
      suboptimal: '✓ All squares controlled! The optimal solution needs 4 pawns.'
    },
    5: {
      optimal: '🎉 Excellent! 5 pawns cover all squares on a 5×5 board!',
      suboptimal: '✓ All squares controlled! Try using exactly 5 pawns.'
    },
    6: {
      optimal: '🎉 Outstanding! 6 pawns perfectly dominate a 6×6 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 6 pawns.'
    },
    7: {
      optimal: '🎉 Amazing! 7 pawns control the entire 7×7 board!',
      suboptimal: '✓ All squares controlled! The minimal solution requires 7 pawns.'
    },
    8: {
      optimal: '🎉 Brilliant! 8 pawns dominate the full 8×8 board!',
      suboptimal: '✓ All squares controlled! The optimal solution uses 8 pawns.'
    }
  }
};

export function getDominanceVictoryMessage(
  piece: PieceType, 
  size: number, 
  isOptimal: boolean
): string {
  const messages = DOMINANCE_VICTORY_MESSAGES[piece]?.[size];
  if (!messages) {
    // Fallback message
    return isOptimal 
      ? '🎉 Perfect! Puzzle solved optimally!'
      : '✓ All squares controlled!';
  }
  return isOptimal ? messages.optimal : messages.suboptimal;
}
