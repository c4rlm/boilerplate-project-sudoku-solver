const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const { expect } = chai;

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.validate(puzzle), true);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5a.';
        assert.equal(solver.validate(puzzle).error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5';
        assert.equal(solver.validate(puzzle).error, 'Expected puzzle to be 81 characters long');
    });

    test('Logic handles a valid row placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkRowPlacement(puzzle, 0, 1, '3'), true);
    });

    test('Logic handles an invalid row placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkRowPlacement(puzzle, 0, 1, '5'), false);
    });

    test('Logic handles a valid column placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkColPlacement(puzzle, 0, 1, '1'), true);
    });

    test('Logic handles an invalid column placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkColPlacement(puzzle, 0, 1, '8'), false);
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkRegionPlacement(puzzle, 0, 1, '3'), true);
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5..';
        assert.equal(solver.checkRegionPlacement(puzzle, 0, 1, '2'), false);
    });

    test('Valid puzzle strings pass the solver', () => {
        const puzzle = '135762984946381257728459613694517832812936475357824196289143765571698324463275849';
        const solution = '135762984946381257728459613694517832812936475357824196289143765571698324463275849';
        assert.equal(solver.solvePuzzle(puzzle).solution, solution);
        
    });

    test('Invalid puzzle strings fail the solver', () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9.1...2.8....3..9...5.73..2..1.4....8.2.3674.3....5a.';
        assert.equal(solver.solvePuzzle(puzzle).error, 'Puzzle cannot be solved');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const puzzle = '82.14675346.137892173859426251684379986723541347591268718965234594372618632418957';
        const solution = '829146753465137892173859426251684379986723541347591268718965234594372618632418957';
        assert.equal(solver.solvePuzzle(puzzle).solution, solution);
    });
});
