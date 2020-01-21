'use strict'

const build3v3Leaderboard = () => {
	return {}

}


module.exports = {
	get3v3(req, res) {
		const leaderboard = build3v3Leaderboard()
		res.json(leaderboard)
	}
}