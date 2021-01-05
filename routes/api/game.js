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

// convert points to tennis score
function convert(point) {
    if (point === 0) return '0';
    if (point === 1) return '15';
    if (point === 2) return '30';
    if (point === 3) return '40';
}

// display to comply with Tennis rules
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

// @route   PUT api/game/player1Scored/:id
// @desc    Player 1 increment score by one and update overall tennis score
// @access  Public
router.put('/player1Scored/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (game.endGame === false) {
            game.player1Score = game.player1Score + 1;

            const setTennisScore = rules(game.player1Score, game.player2Score);
            game.player1TennisScore = setTennisScore[0];
            game.player2TennisScore = setTennisScore[1];
            game.endGame = setTennisScore[2];

            await game.save();

            res.json(game);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/game/player2scored/:id
// @desc    Player 2 increment score by one and update overall tennis score
// @access  Public
router.put('/player2scored/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (game.endGame === false) {
            game.player2Score = game.player2Score + 1;

            const setTennisScore = rules(game.player1Score, game.player2Score);
            game.player1TennisScore = setTennisScore[0];
            game.player2TennisScore = setTennisScore[1];
            game.endGame = setTennisScore[2];

            await game.save();

            res.json(game);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
