'use strict';

const PlayerRouter = require("./routes/leaderboard")
const MediaRouter = require('./routes/media')

module.exports = (app) => {
	app.use('/leaderboard', PlayerRouter)
	app.use('/media', MediaRouter)
}