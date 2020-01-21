'use strict';

const PlayerRouter = require("./routes/leaderboard")


module.exports = (app) => {
	app.use('/leaderboard', PlayerRouter)
}