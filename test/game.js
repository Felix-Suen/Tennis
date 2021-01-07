process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Game = require('../models/Game');

// using mocha and chai for testing
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
        it('it should not DELETE a game with wrong id', (done) => {
            chai.request(api)
                .delete('/api/game' + '5ff681101c0eda4ce06c7079')
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    // test PUT route of player 1 and player 2
    describe('PUT /api/game/:id/:player_id', () => {
        // player 1 PUT route
        it('it should increment player1Score by 1 and player1TennisScore to 15 at the start', (done) => {
            let newGame = new Game({
                player1Score: 0,
                player2Score: 0,
                player1TennisScore: '0',
                player2TennisScore: '0',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(1);
                        res.body.should.have.property('player2Score').eql(0);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('15');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('0');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 2 and player1TennisScore to 30 next', (done) => {
            let newGame = new Game({
                player1Score: 1,
                player2Score: 0,
                player1TennisScore: '15',
                player2TennisScore: '0',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(2);
                        res.body.should.have.property('player2Score').eql(0);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('30');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('0');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 3 and player1TennisScore to 40 next', (done) => {
            let newGame = new Game({
                player1Score: 2,
                player2Score: 0,
                player1TennisScore: '30',
                player2TennisScore: '0',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(3);
                        res.body.should.have.property('player2Score').eql(0);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('40');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('0');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 4 and player1TennisScore to "Winner" and end game', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 0,
                player1TennisScore: '40',
                player2TennisScore: '0',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(4);
                        res.body.should.have.property('player2Score').eql(0);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Winner');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('0');
                        res.body.should.have.property('endGame').eql(true);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 3 and player1TennisScore to "Deuce" when tied at 40', (done) => {
            let newGame = new Game({
                player1Score: 2,
                player2Score: 3,
                player1TennisScore: '30',
                player2TennisScore: '40',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(3);
                        res.body.should.have.property('player2Score').eql(3);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Deuce');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Deuce');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 4 and player1TennisScore to "Ad" after Deuce', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 3,
                player1TennisScore: '40',
                player2TennisScore: '40',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(4);
                        res.body.should.have.property('player2Score').eql(3);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Ad');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('40');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 4 and player1TennisScore to "Deuce" after player2 Ad', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 4,
                player1TennisScore: '40',
                player2TennisScore: 'Ad',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(4);
                        res.body.should.have.property('player2Score').eql(4);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Deuce');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Deuce');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player1Score to 5 and player1TennisScore to "Winner" and end game', (done) => {
            let newGame = new Game({
                player1Score: 4,
                player2Score: 3,
                player1TennisScore: 'Ad',
                player2TennisScore: '40',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/1')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(5);
                        res.body.should.have.property('player2Score').eql(3);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Winner');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('40');
                        res.body.should.have.property('endGame').eql(true);
                        done();
                    });
            });
        });
        // player 2 PUT route
        it('it should increment player2Score by 1 and player2TennisScore to 15 at the start', (done) => {
            let newGame = new Game({
                player1Score: 0,
                player2Score: 0,
                player1TennisScore: '0',
                player2TennisScore: '0',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/2')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(0);
                        res.body.should.have.property('player2Score').eql(1);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('0');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('15');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player2Score to 4 and player2TennisScore to "Winner" and end game', (done) => {
            let newGame = new Game({
                player1Score: 0,
                player2Score: 3,
                player1TennisScore: '0',
                player2TennisScore: '40',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/2')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(0);
                        res.body.should.have.property('player2Score').eql(4);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('0');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Winner');
                        res.body.should.have.property('endGame').eql(true);
                        done();
                    });
            });
        });
        it('it should increment player2Score to 3 and player2TennisScore to "Deuce" when tied at 40', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 2,
                player1TennisScore: '40',
                player2TennisScore: '30',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/2')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(3);
                        res.body.should.have.property('player2Score').eql(3);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('Deuce');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Deuce');
                        res.body.should.have.property('endGame').eql(false);
                        done();
                    });
            });
        });
        it('it should increment player2Score to 4 and player2TennisScore to "Ad" after Deuce', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 3,
                player1TennisScore: '40',
                player2TennisScore: '40',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/2')
                    .send()
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
        it('it should increment player2Score to 5 and player2TennisScore to "Winner" and end game', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 4,
                player1TennisScore: '40',
                player2TennisScore: 'Ad',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/2')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('_id').eql(newGame.id);
                        res.body.should.have.property('player1Score').eql(3);
                        res.body.should.have.property('player2Score').eql(5);
                        res.body.should.have
                            .property('player1TennisScore')
                            .eql('40');
                        res.body.should.have
                            .property('player2TennisScore')
                            .eql('Winner');
                        res.body.should.have.property('endGame').eql(true);
                        done();
                    });
            });
        });
        it('it should not update the game with invalid game id', (done) => {
            chai.request(api)
                .put('/api/game/' + '5ff681101c0eda4ce06c7079' + '/2')
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be
                        .a('object')
                        .eql({ msg: 'Game not found' });
                    done();
                });
        });
        it('it should not update the game with invalid player id', (done) => {
            let newGame = new Game({
                player1Score: 3,
                player2Score: 4,
                player1TennisScore: '40',
                player2TennisScore: 'Ad',
                endGame: false,
            });
            newGame.save((err, newGame) => {
                chai.request(api)
                    .put('/api/game/' + newGame.id + '/3')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be
                            .a('object')
                            .eql({ msg: 'Invalid player id' });
                        done();
                    });
            });
        });
    });
});

// delete all the test entries from the test database
after(function (done) {
    console.log('Clearing test database');
    mongoose.connection.db.dropDatabase(done);
});
