'use strict';

const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/leaderboard.controller');

router.get('/3v3', LeaderboardController.get3v3);

module.exports = router;