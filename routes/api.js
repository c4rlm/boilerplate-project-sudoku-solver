'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
        
        // Validate puzzle string
        const validation = solver.validate(puzzle);
        if (validation !== true) {
            return res.json(validation);
        }
        
        // Validate coordinate
        if (!coordinate || coordinate.length !== 2 || !/^[A-I][1-9]$/.test(coordinate)) {
            return res.json({ error: 'Invalid coordinate' });
        }
        
        const row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0);
        const col = parseInt(coordinate[1], 10) - 1;
        
        // Validate value
        if (!value || !/^[1-9]$/.test(value)) {
            return res.json({ error: 'Invalid value' });
        }
        
        // Check placement
        const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
        const colValid = solver.checkColPlacement(puzzle, row, col, value);
        const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);
        
        if (!rowValid || !colValid || !regionValid) {
          let resInvalid = { valid: false,conflict: [] } 
          if (!rowValid){
            resInvalid.conflict.push("row")
          }
          if (!colValid){
            resInvalid.conflict.push("column")
          }
          if (!regionValid){
            resInvalid.conflict.push("region")
          }
          return res.json(resInvalid);
        }
        
        res.json({ valid: true });
    });
    
  app.route('/api/solve')
  .post((req, res) => {
    const { puzzle } = req.body;
     
    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }
    // Validate puzzle string
    const validation = solver.validate(puzzle);
    if (validation !== true) {
        return res.json(validation);
    }
    
    // Solve the puzzle
    const solution = solver.solvePuzzle(puzzle);
    res.json( solution );
  });
};
