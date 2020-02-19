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
	blizzard.initAPI()
	requestTimer.setTimer();
})

dbConfig = config.get('mongo')
const db = require('./models/db')
db.connectDB(dbConfig)

app.use(helmet())
app.use(express.json())


app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", '*')
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})


require('./router.js')(app)
app.listen(3000, () => console.log("app listening at port 3000!"));