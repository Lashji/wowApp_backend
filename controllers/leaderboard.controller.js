'use strict'

const Leaderboard = require('../models/leaderboard')


module.exports = {
	async get3v3(req, res) {
		const leaderboard = await Leaderboard.find()
		res.json(leaderboard)
	}
}