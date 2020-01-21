const time = 7200000 //2h
// const time = 15000

const blizzard = require("../utils/blizzardApiHandler")

const setTimer = () => {
	setInterval(() => {
		console.log("getting data from interval")
		blizzard.refreshData()
	}, time)
}

module.exports = {
	setTimer
}