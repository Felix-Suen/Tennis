const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    player1Score: {
        type: Number
    },
    player2Score: {
        type: Number
    },
})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;