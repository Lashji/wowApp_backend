'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const leaderboardSchema = new Schema({

	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	players: {
		type: [],
		requrired: true
	}
})


module.exports = new mongoose.model("Leaderboard", leaderboardSchema)