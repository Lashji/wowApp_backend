'use strict'
require('dotenv').config();
const axios = require('axios')
let token;
const Leaderboard = require("../models/leaderboard")

const initAPI = async () => {
	console.log("initing api")
	let response = await getToken()
	token = response.data.access_token

	let ladderResponse = await getPVPLeaderBoard(token)
	let pvpleaderboard = ladderResponse.data

	let leaderboard = new Leaderboard({
		name: pvpleaderboard.name,
		type: pvpleaderboard.bracket.type,
		players: pvpleaderboard.entries
	})

	console.log("leaderboard", pvpleaderboard)

	await leaderboard.save()
}


const getData = () => {
	console.log("requesting data")


}

const refreshData = () => {

	console.log("refreshing data")

}



const getToken = () => {
	return axios.get(`https://eu.battle.net/oauth/token`, {
		auth: {
			username: process.env.CLIENT_ID,
			password: process.env.CLIENT_SECRET,
		},
		params: {
			grant_type: 'client_credentials',
		}
	}).then(response => response || console.log("res", response))
}


async function doCharRequest(
	region,
	realm,
	characterName,
	token
) {
	let href =
		"https://" +
		region +
		".api.blizzard.com/wow/character/" +
		realm +
		"/" +
		characterName

	return axios
		.get(href, {
			headers: {
				Authorization: "Bearer " + token.access_token
			}
		})
		.then(response => response.data)
		.catch(error => error);
}


async function getPVPLeaderBoard(token) {
	let href = "https://eu.api.blizzard.com/data/wow/pvp-season/27/pvp-leaderboard/3v3?namespace=dynamic-eu&locale=en_US"
	console.log(token)
	return await axios.get(href, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
		.then(res => {
			return res;
		})
}




module.exports = {
	getData,
	refreshData,
	token,
	initAPI
}