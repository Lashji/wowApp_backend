'use strict'
require('dotenv').config();
const axios = require('axios')
let token;
const Leaderboard = require("../models/leaderboard")
const BASE_URL_EU = "https://eu.api.blizzard.com/"
let NAMESPACE = "profile-eu"
let LOCALE = "en_US"



const initAPI = async () => {
	console.log("initing api")
	let response = await getToken()
	token = response.data.access_token

	let ladderResponse = await getPVPLeaderBoard(token)
	let pvpleaderboard = ladderResponse.data

	let leaderboard = new Leaderboard({
		name: pvpleaderboard.name,
		type: pvpleaderboard.bracket.type,
		players: pvpleaderboard.entries.slice(0, 1)
	})

	const players = await leaderboard.players.map(async (i) => {
		return await buildPlayer(i)
	})

	console.log("players", players)
	await Leaderboard.findOneAndUpdate({
		name: leaderboard.name
	}, {
		players: players
	}, {
		new: true,
		upsert: true
	})

}

const buildPlayer = async (i) => {
	let player = i
	const summary = await getSummary(i)
	if (!summary) return player

	const {
		name,
		gender,
		faction,
		race,
		character_class,
		pvp_summary,
		media,
		specializations,
		equipment,
		appearance
	} = summary.data;

	const urls = []
	urls.push(pvp_summary, media, specializations, equipment, appearance)
	const keys = ["pvp", "media", "spec", "items", "appearance"]
	player = {
		...player,
		name,
		gender,
		faction,
		race,
		character_class
	}

	for (let i in urls) {
		let response = await doRequest(urls[i].href)
		player[keys[i]] = response.data
	}
	// console.log("player", player)
	setTimeout(() => {
		console.log("timeout")
	}, 1000) //0.5sec timeout for not spamming too many requests
	return player
}

const getSummary = async (data) => {
	let slug = data.character.realm.slug
	let charName = data.character.name.toLowerCase()
	let url = BASE_URL_EU + `profile/wow/character/${slug}/${charName}?namespace=${NAMESPACE}&locale=${LOCALE}`
	return doRequest(url)
}

const doRequest = async (url, log = false) => {
	return axios.get(url, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => log ? console.log(res) : "" || res)
		.catch(err => console.log("err: ", err))
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


// async function doCharRequest(
// 	region,
// 	realm,
// 	characterName,
// 	token
// ) {
// 	let href =
// 		"https://" +
// 		region +
// 		".api.blizzard.com/wow/character/" +
// 		realm +
// 		"/" +
// 		characterName

// 	return axios
// 		.get(href, {
// 			headers: {
// 				Authorization: "Bearer " + token.access_token
// 			}
// 		})
// 		.then(response => response.data)
// 		.catch(error => error);
// }


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