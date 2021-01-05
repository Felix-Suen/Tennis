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
            player2Score: 0
        });
        const game = await newGame.save();

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

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
})

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
})

// @route   PUT api/game/player1Scored/:id
// @desc    Player 1 update score by one
// @access  Public
router.put('/player1Scored/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        game.player1Score = game.player1Score + 1;

        await game.save();

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/game/player2scored/:id
// @desc    Player 2 update score by one
// @access  Public
router.put('/player2scored/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        game.player2Score = game.player2Score + 1;

        await game.save();

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;