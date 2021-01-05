const mongoose = require('mongoose');
const Game = require('../models/Game');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const api = 'http://localhost:5000';

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tennis API', () => {
    // test POST route
    describe('POST /api/game', () => {
        it('it should post a new game', (done) => {
            let newGame = {
                player1Score: 0,
                player2Score: 0,
                player1TennisScore: '0',
                player2TennisScore: '0',
                endGame: false,
            };
            chai.request(api)
                .post('/api/game')
                .send(newGame)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('player1Score').eql(0);
                    res.body.should.have.property('player2Score').eql(0);
                    res.body.should.have
                        .property('player1TennisScore')
                        .eql('0');
                    res.body.should.have
                        .property('player2TennisScore')
                        .eql('0');
                    res.body.should.have.property('endGame').eql(false);
                    done();
                });
        });
    });

    // test GET by id route
    describe('GET /api/game/:id', () => {
        it('it should GET a game by id', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 4,
                player1TennisScore: '40',
                player2TennisScore: 'Ad',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .get('/api/game/' + newGame.id)
                    .send(newGame)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(3);
                        res.body.should.have.property('player2Score').eql(4);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('40');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Ad');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should not GET a game with wrong id', (done) => {
            chai.request(api)
                .get('/api/game/' + '5ff4d37682a0a03e2038ea5f')
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be
                        .a('object')
                        .eql({ msg: 'Game not found' });
                    done();
                });
        });
    });

    // test the 2 PUT route

    // test DELETE route
    describe('DELETE /api/game/:id', () => {
        it('it should DELETE a game instance', (done) => {
            let newGame = new Game({
                player1Score: 2,
                player2Score: 4,
                player1TennisScore: '30',
                player2TennisScore: 'Winner',
                endGame: true,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .delete('/api/game/' + newGame.id)
                    .send(newGame)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be
                            .a('object')
                            .eql({ msg: 'Game Removed' });
                        done();
                    });
            });
        });
    });
});
