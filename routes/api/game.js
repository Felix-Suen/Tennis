const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   POST api/game
// @desc    Create a new tennis game
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newGame = new Game({
            player1Score: 0,
            player2Score: 0,
            player1TennisScore: '0',
            player2TennisScore: '0',
            endGame: false,
        });
        const game = await newGame.save();

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/game/:id
// @desc    Get game by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/game/:id
// @desc    delete a game by ID
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        await game.remove();
        res.json({ msg: 'Game Removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// function that converts points to tennis score
function convert(point) {
    if (point === 0) return '0';
    if (point === 1) return '15';
    if (point === 2) return '30';
    if (point === 3) return '40';
}

// function that displays to comply with Tennis rules
function rules(player1, player2) {
    // when both scores are 40
    if (player1 >= 3 && player2 >= 3 && player1 === player2) {
        return ['Deuce', 'Deuce', false];
    }
    // when scores are both under 40
    else if (player1 <= 3 && player2 <= 3) {
        return [convert(player1), convert(player2), false];
    }
    // when one player wins and another is still under 40
    else if (player1 > 3 && player2 < 3) {
        return ['Winner', convert(player2), true];
    } else if (player2 > 3 && player1 < 3) {
        return [convert(player1), 'Winner', true];
    } else {
        // when both players are above 40
        if (player1 > player2 && player1 - player2 < 2) {
            return ['Ad', '40', false];
        } else if (player1 < player2 && player2 - player1 < 2) {
            return ['40', 'Ad', false];
        } else if (player1 > player2 && player1 - player2 === 2) {
            return ['Winner', '40', true];
        } else {
            return ['40', 'Winner', true];
        }
    }
}

// @route   PUT api/game/:id/:player_id
// @desc    Player 1 or 2 increment score by one and update overall tennis score
// @access  Public
router.put('/:id/:player_id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        // increment score of player 1
        if (game.endGame === false && req.params.player_id === '1') {
            game.player1Score = game.player1Score + 1;

            // calls the rules function to set tennis score
            const setTennisScore = rules(game.player1Score, game.player2Score);
            game.player1TennisScore = setTennisScore[0];
            game.player2TennisScore = setTennisScore[1];
            game.endGame = setTennisScore[2];

            await game.save();

            res.json(game);
        }
        // increment score of player 2
        else if (game.endGame === false && req.params.player_id === '2') {
            game.player2Score = game.player2Score + 1;

            const setTennisScore = rules(game.player1Score, game.player2Score);
            game.player1TennisScore = setTennisScore[0];
            game.player2TennisScore = setTennisScore[1];
            game.endGame = setTennisScore[2];

            await game.save();

            res.json(game);
        }
        // wrong game ID or player ID
        else {
            return res.status(404).json({ msg: 'Invalid url' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
