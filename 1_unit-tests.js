const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  // Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', () => {
assert.equal(solver.validate('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'), true, '.validate() should return "true" in response to being provided a valid puzzle');
  });
  
  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
assert.equal(solver.validate('B2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').error, 'Invalid characters in puzzle', '.validate() should return the error "Invalid characters in puzzle" when given a puzzle string with invalid characters');
  });
  
  // Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
assert.equal(solver.validate('..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').error, 'Expected puzzle to be 81 characters long', '.validate() should return the error "Expected puzzle to be 81 characters long" when given a puzzle string with a length not equal to 81');
  });
  
  // Logic handles a valid row placement
  test('Logic handles a valid row placement', () => {
    assert.equal(solver.checkRowPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "G", "3", "7"
    ), true, '.chekRowPlacement() should return "true" if there is no conflict');
  });
  
  // Logic handles an invalid row placement
  test('Logic handles a valid row placement', () => {
    assert.equal(solver.checkRowPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "B", "5", "9"
    ), false, '.chekRowPlacement() should return "false" if there is a conflict');
  });
  
  // Logic handles a valid column placement
  test('Logic handles a valid column placement', () => {
    assert.equal(solver.checkColPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "B", "5", "7"
    ), true, '.chekColPlacement() should return "true" if there is no conflict');
  });
  
  // Logic handles an invalid column placement
  test('Logic handles a valid column placement', () => {
    assert.equal(solver.checkColPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "B", "5", "2"
    ), false, '.chekColPlacement() should return "false" if there is a conflict');
  });
  
  // Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.equal(solver.checkRegionPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "C", "1", "6"
    ), true, '.checkRegionPlacement() should return "true" if there is no conflict');
  });
  
  // Logic handles an invalid region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.equal(solver.checkRegionPlacement(
      "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      "C", "1", "2"
    ), false, '.checkRegionPlacement() should return "false" if there is a conflict');
  });
  
  // Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', () => {
assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651', '.solve() should return the correct puzzle solution to a valid puzzle');
  });
  
  // Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', () => {
assert.equal(solver.solve('44..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').error, 'Puzzle cannot be solved', '.solve() should return the error "Puzzle cannot be solved" when given a puzzle string that cannot be solved');
  });
  
  // Solver returns the expected solution for an incomplete puzzle
  test('Invalid puzzle strings fail the solver', () => {
assert.equal(solver.solve('..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').error, 'Expected puzzle to be 81 characters long', '.solve() should return the error "Expected puzzle to be 81 characters long" when given a puzzle string is incomplete');
  });
});
