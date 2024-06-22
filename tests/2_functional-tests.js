const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    const validPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const unsolvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const incompletePuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    describe('Solve a puzzle', function () {
        test('Solve a puzzle with valid puzzle string', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: unsolvedPuzzle })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.solution, solvedPuzzle);
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '76923541885149637243217895617456928339584276162871354928365719451692483794738162X' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '123' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '111111111111111111111111111111111111111111111111111111111111111111111111111111111' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    describe('Check a puzzle placement', function () {
        test('Check a puzzle placement with all fields', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: '6' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.valid, true);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: incompletePuzzle, coordinate: 'A4', value: '7' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.deepStrictEqual(res.body, { valid: false, conflict: ['column'] });
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: incompletePuzzle, coordinate: 'A2', value: '2' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.deepStrictEqual(res.body, { valid: false, conflict: ['column', 'region'] });
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.deepStrictEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: 'X' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Invalid value');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: '12' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Invalid value');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'K2', value: '1' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle, coordinate: 'A2', value: '10' })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.strictEqual(res.body.error, 'Invalid value');
                    done();
                });
        });
    });
});

