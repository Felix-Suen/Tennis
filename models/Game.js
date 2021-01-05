const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    player1Score: {
        type: Number
    },
    player2Score: {
        type: Number
    },
    player1TennisScore: {
        type: String
    },
    player2TennisScore: {
        type: String
    },
    endGame: {
        type: Boolean
    }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;