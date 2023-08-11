const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response is the correct solution
        assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651', 'Response should have a .solution property equal to the solution string ("827549163531672894649831527496157382218396475753284916962415738185763249374928651")');
        done();
      });
  });
  
  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test('Solve a puzzle with missing puzzle string', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: null
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Required field missing'
        assert.equal(res.body.error, 'Required field missing', 'Response should have an .error property equal to "Required field missing"');
        done();
      });
  });
  
  // Solve a puzzle with invalid characters: POST request to /api/solve
  test('Solve a puzzle with invalid characters', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: "82..4..6...06..89...9B315.749.157.............53..4...96.415..81..7632..3...28.51"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        //  make sure response has an .error property equal to 'Invalid characters in puzzle'
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'Response should have an .error property equal to "Invalid characters in puzzle"');
        done();
      });
  });
  
  // Solve a puzzle with incorrect length: POST request to /api/solve
  test('Solve a puzzle with incorrect length', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: "82...4...6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        //  make sure response has an .error property equal to: 'Expected puzzle to be 81 characters long'
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'The response should have an .error property equal to "Expected puzzle to be 81 characters long"');
        done();
      });
  });
  
  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test('Solve a puzzle that cannot be solved', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: "88..44.66..16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Puzzle cannot be solved'
        assert.equal(res.body.error, 'Puzzle cannot be solved', 'The response should have an .error property equal to "Puzzle cannot be solved"');
        done();
      });
  });
  
  // Check a puzzle placement with all fields: POST request to /api/check
  test('Check a puzzle placement with all fields', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "A3",
        value: "7"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has a .valid property equal to true
        assert.equal(res.body.valid, true, 'The response should have a .valid property equal to true');
        done();
      });
  });
  
  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test('Check a puzzle placement with single placement conflict', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "A3",
        value: "4"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has a .conflict array property with length 1
        assert.property(res.body, 'conflict', 'Response should have a .conflict property');
        assert.isArray(res.body.conflict, 'The .conflict property should be an array');
        assert.equal(res.body.conflict.length, 1, 'The .conflict property should have a single element');
        // make sure the response's single .conflict element is the correct one
        assert.equal(res.body.conflict[0], "row", 'The .conflict property\'s single element should be "row"');
        done();
      });
  });
  
  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test('Check a puzzle placement with multiple placement conflicts', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "D7",
        value: "5"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has a .conflict array property with length 2
        assert.property(res.body, 'conflict', 'Response should have a .conflict property');
        assert.isArray(res.body.conflict, 'The .conflict property should be an array');
        assert.equal(res.body.conflict.length, 2, 'The .conflict property should have 2 elements');
        // make sure the response's .conflict element contains "row" and "column"
        assert.include(res.body.conflict, "row", 'The .conflict property should include "row"');
        assert.include(res.body.conflict, "column", 'The .conflict property should include "column"');
        done();
      });
  });
  
  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test('Check a puzzle placement with all placement conflicts', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "B6",
        value: "1"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has a .conflict array property with length 3
        assert.property(res.body, 'conflict', 'Response should have a .conflict property');
        assert.isArray(res.body.conflict, 'The .conflict property should be an array');
        assert.equal(res.body.conflict.length, 3, 'The .conflict property should have 3 elements');
        // make sure the response's .conflict element contains all 3 conflict type strings
        assert.include(res.body.conflict, "row", 'The .conflict property should include "row"');
        assert.include(res.body.conflict, "column", 'The .conflict property should include "column"');
        assert.include(res.body.conflict, "region", 'The .conflict property should include "region"');
        done();
      });
  });
  
  // Check a puzzle placement with missing required fields: POST request to /api/check
  test('Check a puzzle placement with missing required fields', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: null,
        value: null
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Required field(s) missing'
        assert.equal(res.body.error, 'Required field(s) missing', 'The response should have an .error property equal to "Required field(s) missing"');
        done();
      });
  });
  
  // Check a puzzle placement with invalid characters: POST request to /api/check
  test('Check a puzzle placement with invalid characters', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "B2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "A3",
        value: "7"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Invalid characters in puzzle'
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'The response should have an .error property equal to "Invalid characters in puzzle"');
        done();
      });
  });
  
  // Check a puzzle placement with incorrect length: POST request to /api/check
  test('Check a puzzle placement with incorrect length', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157...........53..4...96.415..81..7632..3...28.51",
        coordinate: "A3",
        value: "7"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Expected puzzle to be 81 characters long'
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'The response should have an .error property equal to "Expected puzzle to be 81 characters long"');
        done();
      });
  });
  
  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test('Check a puzzle placement with invalid placement coordinate', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "V1",
        value: "1"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Invalid coordinate'
        assert.equal(res.body.error, 'Invalid coordinate', 'The response should have an .error property equal to "Invalid coordinate"');
        done();
      });
  });
  
  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test('Check a puzzle placement with invalid placement value', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        coordinate: "A3",
        value: "0"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // make sure response has an .error property equal to 'Invalid value'
        assert.equal(res.body.error, 'Invalid value', 'The response should have an .error property equal to "Invalid value"');
        done();
      });
  });
});

