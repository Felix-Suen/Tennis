const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    player1Score: {
        type: Number,
        required : true
    },
    player2Score: {
        type: Number,
        required : true
    },
    player1TennisScore: {
        type: String,
        required : true
    },
    player2TennisScore: {
        type: String,
        required : true
    },
    endGame: {
        type: Boolean,
        required : true
    }
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;