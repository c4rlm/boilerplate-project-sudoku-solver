class SudokuSolver {
  validate(puzzleString) {
      // Check if the puzzle string is 81 characters long
      if (puzzleString.length !== 81) {
          return { error: 'Expected puzzle to be 81 characters long' };
      }
      
      // Check if the puzzle string contains only valid characters (1-9 or .)
      if (!/^[1-9.]*$/.test(puzzleString)) {
          return { error: 'Invalid characters in puzzle' };
      }
      
      return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
      const puzzle = this.stringToGrid(puzzleString);
      
      // Check if the value is already in the row
      if (puzzle[row].includes(value) && puzzle[row][column] !== value) {
          return false;
      }
      
      return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
      const puzzle = this.stringToGrid(puzzleString);
      
      // Check if the value is already in the column
      for (let i = 0; i < 9; i++) {
          if (puzzle[i][column] === value && puzzle[row][column] !== value) {
              return false;
          }
      }
      
      return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
      const puzzle = this.stringToGrid(puzzleString);
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(column / 3) * 3;
      
      // Check if the value is already in the 3x3 region
      for (let i = startRow; i < startRow + 3; i++) {
          for (let j = startCol; j < startCol + 3; j++) {
              if (puzzle[i][j] === value && puzzle[row][column] !== value) {
                  return false;
              }
          }
      }
      
      return true;
  }

  solvePuzzle(puzzleString) {
      const puzzle = this.stringToGrid(puzzleString);
      
      if (!this.solve(puzzle)) {
          return { error: 'Puzzle cannot be solved' };
      }
       let solution = this.gridToString(puzzle);

      return {solution};
  }

  solve(puzzle) {
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              if (puzzle[row][col] === '.') {
                  for (let num = 1; num <= 9; num++) {
                      const numStr = num.toString();
                      if (this.isSafe(puzzle, row, col, numStr)) {
                          puzzle[row][col] = numStr;
                          if (this.solve(puzzle)) {
                              return true;
                          }
                          puzzle[row][col] = '.';
                      }
                  }
                  return false;
              }
          }
      }
      return true;
  }

  isSafe(puzzle, row, col, num) {
      return (
          this.isSafeRow(puzzle, row, num) &&
          this.isSafeCol(puzzle, col, num) &&
          this.isSafeRegion(puzzle, row - (row % 3), col - (col % 3), num)
      );
  }

  isSafeRow(puzzle, row, num) {
      for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] === num) {
              return false;
          }
      }
      return true;
  }

  isSafeCol(puzzle, col, num) {
      for (let row = 0; row < 9; row++) {
          if (puzzle[row][col] === num) {
              return false;
          }
      }
      return true;
  }

  isSafeRegion(puzzle, startRow, startCol, num) {
      for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
              if (puzzle[row + startRow][col + startCol] === num) {
                  return false;
              }
          }
      }
      return true;
  }

  stringToGrid(puzzleString) {
      const puzzle = [];
      let index = 0;
      
      for (let i = 0; i < 9; i++) {
          const row = [];
          for (let j = 0; j < 9; j++) {
              row.push(puzzleString[index]);
              index++;
          }
          puzzle.push(row);
      }
      
      return puzzle;
  }

  gridToString(puzzle) {
      let puzzleString = '';
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              puzzleString += puzzle[i][j];
          }
      }
      return puzzleString;
  }
}

module.exports = SudokuSolver;