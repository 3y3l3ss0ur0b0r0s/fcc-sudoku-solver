'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  /*
    All routing logic can go into /routes/api.js
  */
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      console.log("\n\nIn app.route('/api/check').post(): ");
      // solver. methods return json objects which can then be sent as responses in this .post() function
      // (If the object submitted to /api/check is missing puzzle, coordinate or value, the returned value will be { error: 'Required field(s) missing' })
      // make sure puzzle, coordinate, and value are provided--if not, return error response
      if(req.body.puzzle == undefined || req.body.coordinate == undefined || req.body.value == undefined) {
        console.log("puzzle, coordinate, and/or value missing: ");
        console.log(req.body.puzzle);
        console.log(req.body.coordinate);
        console.log(req.body.value);
        console.log("Returning error: { error: 'Required field(s) missing' }");
        res.send({ error: 'Required field(s) missing' });
        return;
      } else {
        console.log("Received puzzle, coordinate, and value. Moving on to validate puzzle string.");
      }
      // (Check a puzzle placement with invalid characters: POST request to /api/check)
      // validate puzzle string--if error received, return response
      let validationResult = solver.validate(req.body.puzzle);
      if (validationResult.error != null) {
        console.log("validationResult has an .error property. Sending validationResult object as response: ");
        console.log(validationResult);
        res.send(validationResult);
        return;
      } else {
        console.log("The provided puzzle string is valid: ");
        console.log(validationResult);
        console.log("Going to continue on to coordinate validation.");
      }
      let puzzle = req.body.puzzle;
      // (Check a puzzle placement with invalid placement coordinate: POST request to /api/check)
      // (If the coordinate submitted to api/check does not point to an existing grid cell, the returned value will be { error: 'Invalid coordinate'})
      // validate coordinates--if error received, return response
      let inputCoordinate = req.body.coordinate;
      if(typeof inputCoordinate == 'string' && inputCoordinate.length == 2) {
        console.log("req.body.coordinate is a string with length 2: " + inputCoordinate);
        // validate row
        if("ABCDEFGHIabcdefghi".includes(inputCoordinate[0])) {
          console.log("Row letter provided is valid: " + inputCoordinate[0]);
          // validate column (only iff row)
          if(parseInt(inputCoordinate[1]) != 0) {
            console.log("Column number provided is valid: " + inputCoordinate[1]);
            console.log("Input coordinate is valid: " + inputCoordinate);
          } else {
            console.log("Column provided is invalid: " + inputCoordinate[1]);
            console.log("Returning error: { error: 'Invalid coordinate'}");
            res.send({ error: 'Invalid coordinate'});
            return;
          }
        } else {
          console.log("Row letter provided is invalid: " + inputCoordinate[0]);
          console.log("Returning error: { error: 'Invalid coordinate'}");
          res.send({ error: 'Invalid coordinate'});
          return;
        }
      } else {
        console.log("req.body.coordinate is not a string with length 2: " + inputCoordinate);
        console.log("Returning error: { error: 'Invalid coordinate'}");
        res.send({ error: 'Invalid coordinate'});
      }
      // set row and col to use later (convert row just in case)
      let row = inputCoordinate[0].toUpperCase();
      let col = inputCoordinate[1];
      // (Check a puzzle placement with invalid placement value: POST request to /api/check)
      // (If the value submitted to /api/check is not a number between 1 and 9, the returned value will be { error: 'Invalid value' })
      // validate value--if error received, return response
      let value = req.body.value;
      if(/[^\d^\.]/.test(value) == true || value < 1 || value > 9) {
        console.log("req.body.value is not between 1 and 9 (inclusive): " + value);
        console.log("Returning error: { error: 'Invalid value' }");
        res.send({ error: 'Invalid value' });
        return;
      } else {
        console.log("req.body.value is between 1 and 9 (inclusive): " + value);
        console.log("Movng on to check row, column, and region.")
      }
      
      // Since we made it through the error returns, we should have a valid object to create
      let response = {
        valid: true
      };
      console.log("response: ");
      console.log(response);

      // Check row, column, and region
      console.log("Checking validity of value placement.");
      let isValidRow = solver.checkRowPlacement(puzzle, row, col, value);
      let isValidCol = solver.checkColPlacement(puzzle, row, col, value);
      let isValidReg = solver.checkRegionPlacement(puzzle, row, col, value);
      // if no conflict with row, set .valid to true--else, set .valid to false
      if(!isValidRow || !isValidCol || !isValidReg) {
        response.conflict = [];
        response.valid = false;
        // if conflict with row, col, or region, create .conflict array and push to the array--else, leave it alone
        console.log("Pushing conflicts to conflict array.");
        if(!isValidRow) {
          response.conflict.push("row");
        }
        if(!isValidCol) {
          response.conflict.push("column");
        }
        if(!isValidReg) {
          response.conflict.push("region");
        }
      }

      // check if value is already in that coordinate
      // calculate index of coordinate in puzzle and find current value
      let rowIndex = "ABCDEFGHI".indexOf(row);
      console.log("rowIndex: " + rowIndex);
      let colIndex = col-1;
      console.log("colIndex: " + colIndex);
      let valIndex = (rowIndex * 9 )+ colIndex;
      console.log("valIndex: " + valIndex);
      let valAtIndex = puzzle[valIndex];
      console.log("valAtIndex: " + valAtIndex);

      if(value == valAtIndex && response.valid == false) {
        console.log("The value " + value + " is already at the coordinate and there are no other conflicts. Seeting response.valid to true and moving on to return { valid: true }.")
        response.valid = true;
        delete response.conflict;
      } else if(valAtIndex != '.') {
        console.log("There is already a value at the coordinate. response.valid should remain false.");
      }

      // Send response object
      console.log("app.route('/api/check').post() response: ")
      console.log(response);
      res.send(response);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      console.log("\n\nIn app.route('/api/solve').post(): ");
      // first, validate puzzle string--if error received, return response
      if(req.body.puzzle == undefined) {
        res.send({ error: 'Required field missing' });
        return;
      }
      let validationResult = solver.validate(req.body.puzzle);
      if (validationResult.hasOwnProperty('error')) {
        console.log("validationResult has an .error property. Sending validationResult object as response: ");
        console.log(validationResult);
        res.send(validationResult);
        return;
      } else {
        console.log("The provided puzzle string is valid: ");
        console.log(validationResult);
        console.log("Going to continue on to pass the puzzleString to .solve function.");
      }
      
      // call .solve and get the return
      let solveResult = solver.solve(req.body.puzzle);
      // check for "unsolvable" error: { error: 'Puzzle cannot be solved' }
      if (solveResult.hasOwnProperty('error')) {
        console.log("solveResult has an .error property. Sending solveResult as a response: ");
        console.log(solveResult);
        res.send(solveResult);
        return;
      }

      // Send the returned response object
      console.log("solveResult has no .error property. Sending solveResult as a response: ");
      console.log(solveResult);
      res.send(solveResult);
    });
};
