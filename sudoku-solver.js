class SudokuSolver {

  /*
    All puzzle logic can go into /controllers/sudoku-solver.js
      The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.
      The check functions should be validating against the current state of the board.
      The solve function should handle solving any given valid puzzle string, not just the test inputs and solutions. You are expected to write out the logic to solve this.
  */
  
  validate(puzzleString) {
    console.log("\nIn validate().");
    // (Check a puzzle placement with invalid characters: POST request to /api/check)
    // (If the puzzle submitted to /api/check contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' })
    if(typeof puzzleString == 'string' && puzzleString.match(/[^\d^\.]/) == null) {
      console.log("puzzleString has no invalid characters: " + puzzleString);
    } else {
      console.log("puzzleString has invalid characters: " + puzzleString);
      console.log(puzzleString.match(/[^\d^\.]/));
      console.log("Returning error: { error: 'Invalid characters in puzzle' }");
      return { error: 'Invalid characters in puzzle' };
    }
    // (Check a puzzle placement with incorrect length: POST request to /api/check)
    // (If the puzzle submitted to /api/check is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' })
    if(typeof puzzleString == 'string' && puzzleString.length == 81) {
      console.log("puzzleString has a length of 81: " + puzzleString.length);
    } else {
      console.log("puzzleString does not have a length of 81: " + puzzleString.length);
      console.log("Returning error: { error: 'Expected puzzle to be 81 characters long' }");
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    // return true if no error returned
    console.log("puzzleString did not fail any tests. Returning true.");
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    console.log("\nIn checkRowPlacement().");
    
    // get proper row letter for row index
    const rowLetters = {
      'A': 0,
      'B': 1,
      'C': 2,
      'D': 3,
      'E': 4,
      'F': 5,
      'G': 6,
      'H': 7,
      'I': 8
    };
    
    // split puzzleString into rows
    let rowsArray = puzzleString.match(/.{9}/g);
    console.log(rowsArray);
    
    // choose the right row to check, and see if it already has the value provided
    console.log("rowLetters[row] (row index): " + rowLetters[row]);
    console.log("Row " + row + ": " + rowsArray[rowLetters[row]]);
    if(!rowsArray[rowLetters[row]].includes(value)) {
      console.log("Passed checkRowPlacement: Row " + row + " does not have " + value + ".");
      return true;
    }
    
    // if we did not we didn't return true in the previous conditional, then it follows that it's appropriate to return false
    console.log("Failed checkRowPlacement: Row " + row + " already has " + value + ".");
    return false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    console.log("\nIn checkColPlacement().");
    
    // get actual index of column
    let startIndex = column-1;
    
    // create array from column values to examine
    let colArray = [...puzzleString].filter((number, index) => {
      return (startIndex - index) % 9 == 0;
    });
    console.log("colArray: ");
    console.log(colArray);
    
    // evaluate whether the column already has the specified value
    if(!colArray.includes(value)) {
      console.log("Passed checkColPlacement: Column " + column + " does not have " + value + ".");
      return true;
    }
    
   // if we did not we didn't return true in the previous conditional, then it follows that it's appropriate to return false
    console.log("Failed checkColPlacement: Column " + column + " already has " + value + ".");
    return false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    console.log("\nIn checkRegionPlacement().");
    
    let regionValues = '';
    
    // get columns so we know how much / where to grab from the row strings (created later)
    let colIndex = column-1;
    let startCol;
    if(colIndex < 3) {
      console.log("colIndex is less than 3, so we want to look at the first third of each rowGroup.");
      startCol = 0;
    } else if(colIndex < 6) {
      console.log("colIndex is less than 6 (and at least 3), so we want to look at the second third of each rowGroup.");
      startCol = 3;
    } else if(colIndex < 9) {
      console.log("colIndex is less than 9 (and at least 6), so we want to look at the last third of each rowGroup.");
      startCol = 6;
    }
    console.log("startCol: " + startCol);
    
    // get the rows we need to look at
    let rowGroups = ['ABC','DEF','GHI'];
    let rowsArray;
    console.log("rowsArray: ");
    console.log(rowsArray);
    if(rowGroups[0].includes(row)) {
      console.log("rowGroup for row " + row + " is " + rowGroups[0] + ".");
      rowsArray = puzzleString.match(/.{9}/g).slice(0,3);
    } else if(rowGroups[1].includes(row)) {
      console.log("rowGroup for row " + row + " is " + rowGroups[1] + ".");
      rowsArray = puzzleString.match(/.{9}/g).slice(3,6);
    } else if(rowGroups[2].includes(row)) {
      console.log("rowGroup for row " + row + " is " + rowGroups[2] + ".");
      rowsArray = puzzleString.match(/.{9}/g).slice(6,9);
    }
    console.log("rowsArray: ");
    console.log(rowsArray);

    // take only the parts of rowsArray we need to regionValues
    rowsArray.map((theRow) => {
        regionValues += theRow.substr(startCol,3);
    });

    // evaluate whether the region already has the specified value
    if(!regionValues.includes(value)) {
      console.log("Passed checkRegionPlacement: Region does not have " + value + ".");
      return true;
    }

    // if we did not we didn't return true in the previous conditional, then it follows that it's appropriate to return false
    console.log("Failed checkRegionPlacement: Region already has " + value + ".");
    return false;
  }

  solve(puzzleString) {
    console.log("\nIn solve().");
    let puzzleValidation = this.validate(puzzleString);
    
    // (If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' })
    // check if puzzleString is valid
    if(puzzleValidation === true) {
      console.log(".solve() sees that puzzleString is valid.");
    } else {
      console.log("puzzleValidation has an .error property. Returning error: " + puzzleValidation);
      return puzzleValidation;
    }

// ***************************************************************************
    // SOLUTION DETERMINATION:

    console.log("\nAttempting to solve.");

    while(puzzleString.includes('.')) {
      // get array version of puzzleString so we can do array operations
      // get rows array
      let puzzleRows = puzzleString.match(/.{9}/g);
      //console.log("puzzleRows: ");
      //console.log(puzzleRows);
      // get columns array
      let columnsString = '';
      for(let i=0; i<9; i++) {
        //console.log("Getting column " + (i+1) + " (index " + i + ") array.");
        puzzleRows.map((row) => {
          columnsString += row[i];
        });
      }
      let puzzleColumns = columnsString.match(/.{9}/g);
      //console.log("puzzleColumns: ");
      //console.log(puzzleColumns);
      // get regions array
      let regionsString = '';
      // each region is x, x+1, x+2, x+9, x+10, x+11, x+18, x+19, x+20 where x is 0 or a multiple of 3 (that is not a multiple of 9 or 18)
      // i is a constant to add to the index depending in the row of the region
      // j is the starting index of the region (x)
// n is the number added to x to get the indices of the region
      for(let i=0; i<=54; i+=27) {
        let nValues = [0,1,2,9,10,11,18,19,20];
        for(let j=0; j<9; j+=3) {
            nValues.map((n) => {
              regionsString+=puzzleString[i+j+n];
            });
        } // end for-j (start index iteration)
      } // end for-i (constant for region row iteration)
      let puzzleRegions = regionsString.match(/.{9}/g);
      //console.log("puzzleRegions: ");
      //console.log(puzzleRegions);
  
      // iterate through indices and look at arrays puzzleRows, puzzleColumns, and puzzleRegions as appropriate
        // For i (index) of puzzleString, we will need puzzleRows[0], puzzleColumns[0], and puzzleRegion[0]
        // For each i
          // row++ when a multiple of 9 is reached
          // col++ until it resets at a multiple of 9
          // region switches at i = 0,3,6,27,30,36,54,57, or 67
      //console.log("Iterating through each cell to see candidate values.");
      let possibleNumbers = ['1','2','3','4','5','6','7','8','9'];
      let regionSwitches = [0,3,6,27,30,36,54,57,67];
      let rowIndex = 0;
      let colIndex = 0;
      let regIndex = 0;
      for(let i=0; i<81; i++) {
        if(i % 9 == 0) {
          // reset colIndex when i is a multiple of 9
          colIndex = 0;
          // increment rowIndex when i is a multiple of 9 that is not 0
          if(i != 0) { rowIndex++; }
        }
        
        // check for region switches and switch appropriately
          // pattern (switch at each multiple of 3):
            // 0,1,2, 0,1,2, 0,1,2, 3,4,5, 3,4,5, 3,4,5, 6,7,8, 6,7,8, 6,7,8
        if(i != 0 && (i % 9 != 0 || i % 27 == 0) && i % 3 == 0) {
          // move to the next region (either just to the right or to the next row)
          regIndex++;
        } else if(i != 0 && i % 27 != 0 && i % 9 == 0) {
          // move to back to the left (e.g., when done with the 3rd region's 1st row and you need to move back to the 1st region to go to its 2nd row)
          regIndex -= 2;
        }   
  
        if(puzzleString[i] == '.') {
          //console.log("\tCell: " + i);
          //console.log("\t\t(rowIndex: " + rowIndex + ")\t\t(colIndex: " + colIndex + ")\t\tregIndex: " + regIndex + ")");
          //console.log("\t\t(row: " + puzzleRows[rowIndex] + ")\t(col: " + puzzleColumns[colIndex] + ")\t(reg: " + puzzleRegions[regIndex] + ")");
          
          let comparisonSet = new Set(puzzleRows[rowIndex].concat(puzzleColumns[colIndex]).concat(puzzleRegions[regIndex]));
          // remove "." from comparisonSet
          comparisonSet.delete('.');
          //console.log("comparisonSet for finding possible values at cell " + i + ": ");
          //console.log(comparisonSet);
          let candidates = possibleNumbers.filter((n) => {
            return comparisonSet.has(n) == false;
          });
          //console.log("The possible value can be digit 1-9 that is not in the comparisonSet (the 'candidates' array): ");
          console.log(candidates);
          if(candidates.length == 1) {
            //console.log("Since there is only one possible value for this cell, let's place it.");
            //console.log("Before placing: " + puzzleString);
            let firstPart = puzzleString.substr(0,i);
            let lastPart = puzzleString.substr(i+1);
            puzzleString = firstPart + candidates[0] + lastPart;
            console.log("After placing: " + puzzleString);
            // get out of the for-loop so we can restart with the new puzzleString value
            //console.log("Getting out of the for-loop to restart with the new puzzleString value.")
            break;
          }
          // If there are no possible numbers for a cell, then return an error
          if(candidates.length == 0) {
            console.log("There are no possible numbers for cell " + i + ". Returning error: { error: 'Puzzle cannot be solved' }");
            return { error: 'Puzzle cannot be solved' };
          }
        } else {
          //console.log("There is already a value at cell " + i + ".");
        }
        // increment col at each i increment (but reset it at multiples of 9 (at the beginning for the loop))
        colIndex++;
      }
    } // end while-loop (checking if '.' characters remain)
// ***************************************************************************
    // return solution
    console.log("solution: " + puzzleString);
    return { solution : puzzleString };
  }
}

module.exports = SudokuSolver;

