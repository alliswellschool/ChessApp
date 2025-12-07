# Reusable Chessboard Component

A flexible, responsive chessboard component that can be used across the application for different chess-related features.

## Features

- ✅ Customizable board size (4x4, 6x6, 8x8, or any NxN)
- ✅ Show/hide coordinate labels (a-h, 1-8)
- ✅ Flip board orientation
- ✅ Custom cell states (dominated, blocked, has-piece)
- ✅ Responsive design with automatic scaling
- ✅ Click and hover event handling
- ✅ Support for piece images or Unicode symbols
- ✅ Fixed or responsive cell sizes
- ✅ Fully typed with TypeScript interfaces

## Installation

The component is located at: `src/app/shared/chessboard/chessboard.component.ts`

## Basic Usage

### 1. Import the component

```typescript
import { ChessboardComponent, ChessCell } from '@/shared/chessboard/chessboard.component';

@Component({
  imports: [ChessboardComponent, CommonModule],
  // ...
})
export class YourComponent {
  cells: ChessCell[][] = [];
}
```

### 2. Initialize the board

```typescript
ngOnInit() {
  this.initializeBoard();
}

initializeBoard() {
  this.cells = [];
  for (let row = 0; row < 8; row++) {
    this.cells[row] = [];
    for (let col = 0; col < 8; col++) {
      this.cells[row][col] = {
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0
      };
    }
  }
}
```

### 3. Use in template

```html
<app-chessboard
  [size]="8"
  [cells]="cells"
  [showCoordinates]="true"
  (cellClick)="onCellClick($event)">
</app-chessboard>
```

## API Reference

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `number` | `8` | Board dimensions (8 = 8x8 board) |
| `cells` | `ChessCell[][]` | `[]` | 2D array of cell data |
| `showCoordinates` | `boolean` | `true` | Show file/rank labels |
| `flipBoard` | `boolean` | `false` | Flip board orientation |
| `cellSize` | `number?` | `undefined` | Fixed cell size in pixels (overrides responsive sizing) |
| `interactive` | `boolean` | `true` | Enable/disable cell interactions |

### Outputs

| Event | Payload | Description |
|-------|---------|-------------|
| `cellClick` | `{ row, col, cell }` | Emitted when a cell is clicked |
| `cellHover` | `{ row, col, cell }` | Emitted when hovering over a cell |

### ChessCell Interface

```typescript
interface ChessCell {
  row: number;                // Row index (0-based)
  col: number;                // Column index (0-based)
  isLight: boolean;           // Is light square
  isDark: boolean;            // Is dark square
  piece?: string;             // Unicode piece symbol (♔, ♞, etc.)
  pieceImage?: string;        // URL to piece image
  dominated?: boolean;        // Highlight as dominated
  blocked?: boolean;          // Mark as blocked (shows X)
  hasPiece?: boolean;         // Has a piece (blue background)
  hasInvalidPiece?: boolean;  // Invalid piece placement (red)
  customClasses?: string[];   // Additional CSS classes
  data?: any;                 // Custom data storage
}
```

## Examples

### Example 1: Dominance Game

```typescript
// dominance.component.ts
import { ChessboardComponent, ChessCell } from '@/shared/chessboard/chessboard.component';

export class DominanceComponent {
  cells: ChessCell[][] = [];
  boardSize = 8;

  ngOnInit() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.cells = [];
    for (let row = 0; row < this.boardSize; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        this.cells[row][col] = {
          row,
          col,
          isLight: (row + col) % 2 === 0,
          isDark: (row + col) % 2 !== 0,
          dominated: false,
          blocked: false
        };
      }
    }
  }

  onCellClick(event: { row: number; col: number; cell: ChessCell }) {
    const { row, col } = event;
    
    if (this.selectedPiece && !this.cells[row][col].hasPiece) {
      this.placePiece(row, col, this.selectedPiece);
      this.updateDominatedSquares();
    }
  }

  placePiece(row: number, col: number, piece: string) {
    this.cells[row][col] = {
      ...this.cells[row][col],
      hasPiece: true,
      piece: piece,
      pieceImage: `/assets/pieces/${piece}.svg`
    };
  }

  markDominated(row: number, col: number) {
    if (this.cells[row]?.[col]) {
      this.cells[row][col].dominated = true;
    }
  }

  blockCell(row: number, col: number) {
    if (this.cells[row]?.[col]) {
      this.cells[row][col].blocked = true;
    }
  }
}
```

```html
<!-- dominance.component.html -->
<app-chessboard
  [size]="boardSize"
  [cells]="cells"
  [showCoordinates]="true"
  (cellClick)="onCellClick($event)">
</app-chessboard>
```

### Example 2: Knights Tour

```typescript
// knights-tour.component.ts
export class KnightsTourComponent {
  cells: ChessCell[][] = [];
  knightPosition = { row: 0, col: 0 };
  moveHistory: Array<{ row: number; col: number }> = [];

  ngOnInit() {
    this.initializeBoard();
    this.placeKnight(0, 0);
  }

  initializeBoard() {
    this.cells = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0,
        data: { visited: false, moveNumber: null }
      }))
    );
  }

  placeKnight(row: number, col: number) {
    this.cells[row][col] = {
      ...this.cells[row][col],
      piece: '♞',
      hasPiece: true,
      data: {
        visited: true,
        moveNumber: this.moveHistory.length + 1
      }
    };
    this.knightPosition = { row, col };
    this.moveHistory.push({ row, col });
  }

  onCellClick(event: { row: number; col: number }) {
    const { row, col } = event;
    if (this.isValidKnightMove(row, col)) {
      this.moveKnight(row, col);
    }
  }

  isValidKnightMove(row: number, col: number): boolean {
    const rowDiff = Math.abs(row - this.knightPosition.row);
    const colDiff = Math.abs(col - this.knightPosition.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  moveKnight(row: number, col: number) {
    // Clear old position
    this.cells[this.knightPosition.row][this.knightPosition.col].piece = undefined;
    this.cells[this.knightPosition.row][this.knightPosition.col].hasPiece = false;
    
    // Place at new position
    this.placeKnight(row, col);
  }
}
```

```html
<!-- knights-tour.component.html -->
<app-chessboard
  [size]="8"
  [cells]="cells"
  [showCoordinates]="true"
  (cellClick)="onCellClick($event)">
</app-chessboard>
```

### Example 3: Mini Board (6x6) with Fixed Size

```typescript
export class MiniBoardComponent {
  cells: ChessCell[][] = [];

  ngOnInit() {
    // Initialize 6x6 board
    this.cells = Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 6 }, (_, col) => ({
        row,
        col,
        isLight: (row + col) % 2 === 0,
        isDark: (row + col) % 2 !== 0
      }))
    );
  }
}
```

```html
<app-chessboard
  [size]="6"
  [cells]="cells"
  [cellSize]="60"
  [showCoordinates]="false">
</app-chessboard>
```

### Example 4: Flipped Board for Black's Perspective

```html
<app-chessboard
  [size]="8"
  [cells]="cells"
  [flipBoard]="true"
  [showCoordinates]="true"
  (cellClick)="onCellClick($event)">
</app-chessboard>
```

## Styling

### Custom Cell Classes

You can add custom CSS classes to cells:

```typescript
this.cells[3][4] = {
  row: 3,
  col: 4,
  isLight: true,
  isDark: false,
  customClasses: ['highlighted', 'possible-move']
};
```

Then define the styles in your component CSS:

```css
::ng-deep .cell.highlighted {
  background: rgba(76, 175, 80, 0.3) !important;
}

::ng-deep .cell.possible-move::after {
  content: '•';
  position: absolute;
  font-size: 2em;
  color: rgba(0, 0, 0, 0.3);
}
```

### Override Cell Size

Use CSS variables or the `cellSize` input:

```html
<!-- Via input -->
<app-chessboard [cellSize]="70"></app-chessboard>

<!-- Via CSS -->
<app-chessboard style="--cell-size: 70px"></app-chessboard>
```

## Best Practices

1. **Initialize cells array properly**: Always create a full 2D array matching your board size
2. **Use immutability**: When updating cells, create new objects to trigger change detection:
   ```typescript
   this.cells[row][col] = { ...this.cells[row][col], dominated: true };
   ```
3. **Store game state separately**: Use `data` property for game-specific information
4. **Handle responsive design**: Let the component handle sizing, or use `cellSize` for fixed layouts
5. **Accessibility**: The component uses semantic HTML, but add ARIA labels if needed

## Migration Guide

### From Old Dominance Board to Chessboard Component

**Before:**
```html
<div class="board-wrapper">
  <div class="chessboard">
    <div class="board-row" *ngFor="let r of ranks">
      <div class="cell" [class.light]="..." [class.dark]="...">
      </div>
    </div>
  </div>
</div>
```

**After:**
```html
<app-chessboard
  [size]="boardSize"
  [cells]="cells"
  (cellClick)="onCellClick($event)">
</app-chessboard>
```

## Troubleshooting

### Cells not updating
- Ensure you're creating new cell objects when updating:
  ```typescript
  this.cells = [...this.cells]; // Trigger change detection
  ```

### Coordinates not showing
- Check that `showCoordinates` is set to `true`
- Verify board size is correct

### Click events not firing
- Ensure `interactive` input is `true` (default)
- Check that cells don't have `blocked: true`

## Future Enhancements

- [ ] Drag-and-drop piece movement
- [ ] Animation support for piece movements
- [ ] Theme customization (different color schemes)
- [ ] Chess notation display on cells
- [ ] Highlight last move
- [ ] Arrow drawing for analysis
