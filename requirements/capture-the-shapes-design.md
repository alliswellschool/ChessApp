# Capture the Shapes - Design Documentation

## Current Implementation Overview

### How It Currently Works

1. **Puzzle Structure**
   - Each puzzle has predefined target shapes placed on specific board squares
   - Each shape has a type (star, circle, diamond, triangle, heart, square)
   - Each puzzle defines allowed starting positions for each piece type
   - Example: Rook can start on a1, h1, a8, h8 only

2. **Piece Placement**
   - User selects a piece type from the piece selector (rook, knight, bishop, queen, king)
   - Green highlights show valid starting squares for the selected piece
   - User clicks a valid starting square to place the piece
   - Clicking a placed piece removes it from the board

3. **Capture Mechanics**
   - When a piece is placed, the system calculates all squares it attacks
   - Any shape on an attacked square is marked as "captured"
   - Captured shapes turn green, uncaptured shapes remain orange
   - Shapes are captured based on standard chess piece movement:
     - **Rook**: Attacks all squares in same row/column
     - **Bishop**: Attacks all diagonal squares
     - **Queen**: Attacks rows, columns, and diagonals
     - **Knight**: Attacks L-shaped positions (2+1 squares)
     - **King**: Attacks all adjacent squares (1 square in any direction)

4. **Victory Condition**
   - Puzzle is complete when ALL shapes are captured
   - Progress shown: "X / Y shapes captured"
   - Victory modal appears when all shapes are captured
   - User can proceed to next puzzle or retry current puzzle

5. **UI Features**
   - Puzzle navigation (Previous/Next buttons)
   - Progress bar showing capture percentage
   - Starting positions table (shows allowed squares per piece)
   - Target shapes legend (shows shape locations and capture status)
   - Toggle to show/hide valid starting positions
   - Reset button to clear all placed pieces

6. **Data Structure**
   ```typescript
   // Puzzle definition
   {
     id: 1,
     shapes: [
       { row: 2, col: 1, shape: 'star' },
       { row: 4, col: 5, shape: 'diamond' }
     ],
     allowedStarts: {
       'rook': ['a1', 'h1', 'a8', 'h8'],
       'knight': ['b1', 'g1', 'b8', 'g8']
     }
   }
   
   // Placed pieces tracked as:
   { row: 0, col: 0, type: 'rook' }
   ```

## Current Limitations

1. **No piece limit** - Users can place unlimited pieces of any type
2. **No optimal solution tracking** - System doesn't know the intended solution
3. **All pieces available** - Every puzzle allows all 5 piece types
4. **Simple validation** - Only checks if all shapes are captured

---

## NEW REQUIREMENTS - Movement-Based Puzzle

### Core Concept
This is a **pathfinding/movement puzzle** where pieces move on the board to capture shapes, NOT a placement puzzle.

### How It Should Work

1. **Starting the Puzzle**
   - Each puzzle defines specific starting squares for each piece type
   - User selects which piece type to use (Rook, Knight, Bishop, Queen, King)
   - User places the selected piece on one of its allowed starting squares
   - Only ONE piece can be active on the board at a time (clarification needed)

2. **Movement & Capturing**
   - Once placed, the piece can MOVE according to chess rules
   - User clicks a valid square to move the piece there
   - Each movement = 1 move (increment move counter)
   - When piece moves to a square containing a shape, the shape is captured
   - OR: When piece attacks a square with a shape (clarification needed)
   - Captured shapes are removed/marked as captured

3. **Move Counter**
   - Track total number of moves made
   - Display current move count to user
   - Each piece movement increments the counter
   - Placing a new piece from start = ? moves (clarification needed)

4. **Bishop Color Restriction**
   - Bishops can only move on their starting color (light/dark squares)
   - Shapes on opposite color squares cannot be captured by that bishop
   - These shapes should be marked as "not capturable" or ignored for victory condition
   - May require using a different piece to capture them (clarification needed)

5. **Victory Condition**
   - All capturable shapes must be captured
   - System records the total number of moves taken
   - Store the minimum moves (best score) for each puzzle
   - Best score saved in localStorage per puzzle

6. **Multiple Pieces** (clarification needed)
   - Can user place multiple pieces simultaneously?
   - Can user switch between pieces?
   - Does placing a second piece count as moves?

7. **Valid Moves Display**
   - Show valid moves for the current piece (like Knight's Tour green squares)
   - Highlight squares where shapes can be captured
   - Show attack pattern of current piece

### Open Questions
1. Can multiple pieces be active on board simultaneously or one at a time?
2. Does piece capture by landing ON the shape square or by attacking it from distance?
3. Can pieces revisit previously visited squares?
4. Does placing a new piece count as a move?
5. For Bishop: Are opposite-color shapes auto-excluded from victory condition?
6. Should there be an "Undo" feature for moves?
7. Should optimal solution move count be shown as a target?

---

## Implementation Task List

### Phase 1: Core Movement System
- [ ] Remove current "placement only" logic
- [ ] Add piece movement validation (legal chess moves)
- [ ] Implement move counter (starts at 0)
- [ ] Track piece position on board
- [ ] Allow piece to move to valid squares only
- [ ] Update UI to show current move count

### Phase 2: Capture Mechanics
- [ ] Detect when piece moves to/attacks a shape square
- [ ] Mark shape as captured on valid move
- [ ] Update captured shapes list
- [ ] Visual feedback for captured shapes
- [ ] Remove or gray out captured shapes

### Phase 3: Bishop Color Logic
- [ ] Detect bishop starting square color (light/dark)
- [ ] Filter shapes by capturable color
- [ ] Mark opposite-color shapes as excluded
- [ ] Update victory condition to ignore excluded shapes
- [ ] Visual indicator for non-capturable shapes

### Phase 4: Victory & Scoring
- [ ] Check if all capturable shapes are captured
- [ ] Display victory modal with move count
- [ ] Store best score in localStorage
- [ ] Compare current score with best score
- [ ] Show "New Record!" if best score beaten
- [ ] Display best score on UI

### Phase 5: UI Enhancements
- [ ] Show valid moves (green highlights)
- [ ] Highlight capturable shape squares
- [ ] Add move counter display
- [ ] Add "Undo Move" button
- [ ] Add "Reset Puzzle" button
- [ ] Show best score per puzzle
- [ ] Piece movement animation

### Phase 6: Puzzle Data Updates
- [ ] Update puzzle definitions with proper starting positions
- [ ] Add optimal solution move counts (optional target)
- [ ] Create more puzzle variations
- [ ] Test each puzzle for solvability

