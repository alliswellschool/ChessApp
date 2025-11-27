# Excel Import Format for Chess Quiz Questions

## Required Columns

Your Excel file must have the following columns in this exact order:

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| A | Question | The question text | "How many squares are on a standard chessboard?" |
| B | Option 1 | First answer option | "64" |
| C | Option 2 | Second answer option | "32" |
| D | Option 3 | Third answer option | "48" |
| E | Option 4 | Fourth answer option | "72" |
| F | Correct Answers | Index(es) of correct option(s) (0-3, comma-separated) | "0" or "0,2" for multiple |
| G | Difficulty | Difficulty level (1-9 scale) | 1 (Very Easy) to 9 (Extremely Hard) |
| H | Explanation | Optional explanation | "A standard chessboard has 8 rows × 8 columns = 64 squares." |

## Difficulty Scale

The new difficulty system uses a **1-9 numeric scale** for more granular difficulty control:

- **Level 1-2**: Very Easy - Basic chess rules and fundamental concepts
- **Level 3-4**: Easy - Simple tactics and beginner strategies
- **Level 5-6**: Medium - Intermediate tactics and game understanding
- **Level 7-8**: Hard - Advanced tactics and positional understanding
- **Level 9**: Extremely Hard - Expert-level concepts and complex scenarios

## Multiple Correct Answers (NEW!)

Questions can now have **multiple correct answers**. Use comma-separated indices in Column F:
- Single answer: `0` (Option 1 is correct)
- Multiple answers: `0,2` (Options 1 and 3 are both correct)
- Multiple answers: `1,2,3` (Options 2, 3, and 4 are all correct)

**Note**: Do not include spaces after commas. Use `0,2` not `0, 2`

## Important Notes

1. **Header Row**: The first row should contain column headers (the import will skip this row)
2. **Correct Answers Format**: 
   - 0 = Option 1
   - 1 = Option 2
   - 2 = Option 3
   - 3 = Option 4
   - For multiple answers: `0,2` or `1,3` (comma-separated, no spaces)
3. **Difficulty Values**: Must be a number from **1 to 9**
   - Legacy text values ("easy", "medium", "hard") are converted to 1, 5, 9 respectively
4. **Explanation**: This column is optional but recommended for better learning

## Example Template

Download the template from the Admin Panel Import tab or create your own following this format:

```
Question | Option 1 | Option 2 | Option 3 | Option 4 | Correct Answers | Difficulty | Explanation
How many squares are on a standard chessboard? | 64 | 32 | 48 | 72 | 0 | 1 | A standard chessboard has 8 rows × 8 columns = 64 squares.
Which pieces can move diagonally? | Bishop | Rook | Queen | Knight | 0,2 | 3 | Both the Bishop and Queen can move diagonally across the board.
What is the maximum number of moves in the 50-move rule? | 50 | 75 | 100 | 25 | 0 | 7 | The 50-move rule states that a player can claim a draw if no pawn has moved and no capture has been made in the last 50 moves.
```

## Steps to Import

1. Go to Admin Panel → Import tab
2. Click "Download Template" to get a pre-formatted Excel file
3. Fill in your questions following the format
4. Save your Excel file (.xlsx or .xls format)
5. Click "Choose File" and select your Excel file
6. Click "Import Questions"
7. Check for success message or error details

## Tips

- Keep questions clear and concise
- Ensure all four options are filled
- Double-check the correct answer indices (0-3)
- Use the 1-9 difficulty scale appropriately for your audience
- For multiple correct answers, separate indices with commas (no spaces)
- Add explanations to help users learn from their mistakes
- Test with a small batch first (2-3 questions)
- Review imported questions in the Questions tab
- Level 1-3 for beginners, 4-6 for intermediate, 7-9 for advanced players

## Troubleshooting

**"No valid questions found"**: 
- Check that all required columns have data
- Verify correct answer indices are 0-3
- Ensure question and options are not empty
- Check that difficulty is between 1-9

**Multiple answers not working**:
- Ensure no spaces after commas (use `0,2` not `0, 2`)
- Verify all indices are within range 0-3
- Format cell as text if Excel converts to number

**Questions not importing correctly**:
- Save file as .xlsx format (not .xls or .csv)
- Remove any special characters that might cause issues
- Check that there are no merged cells
- Ensure difficulty is a number, not text
