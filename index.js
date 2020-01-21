const express = require("express")
const app = express();
const helmet = require("helmet")
require('dotenv').config()
const config = require('config')
const blizzard = require('./utils/blizzardApiHandler')
const dbEmitter = require('./events/dbEvents')
const requestTimer = require("./timers/requestTimer")

dbEmitter.on('connected', () => {
	console.log("emited connected")
	blizzard.getData()
	requestTimer.setTimer();
})

dbConfig = config.get('mongo')
const db = require('./models/db')
db.connectDB(dbConfig)

app.use(helmet())
app.use(express.json())

require('./router.js')(app)
app.listen(3000, () => console.log("app listening at port 3000!"));