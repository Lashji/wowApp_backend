const Leaderboard = require("../models/leaderboard");
const axios = require("axios");
const BASE_URL_EU = "https://eu.api.blizzard.com/";
const DataHandler = require("./datahandler")
let NAMESPACE = "profile-eu";
let LOCALE = "en_US";


class LeaderboardHandler {

	constructor(request) {
		this.doRequest = request
		this.init()
	}

	async init() {

		let url =
			"https://eu.api.blizzard.com/data/wow/pvp-season/29/pvp-leaderboard/3v3?namespace=dynamic-eu&locale=en_US";

		try {
			let ladderResponse = await this.doRequest(url);
			let pvpleaderboard = ladderResponse.data;

			let leaderboard = new Leaderboard({
				name: pvpleaderboard.name,
				type: pvpleaderboard.bracket.type,
				players: pvpleaderboard.entries.slice(0, 20)
			});

			const players = this.playersToArray(leaderboard);

			Promise.all(players).then(res =>
				Leaderboard.findOneAndUpdate({
					name: leaderboard.name
				}, {
					players: res
				}, {
					new: true,
					upsert: true
				})
			);
		} catch (err) {
			console.error("error when requesting ladder", err)
		}
	}

	async getSummary(data) {
		let slug = data.character.realm.slug;
		let charName = data.character.name.toLowerCase();
		let url =
			BASE_URL_EU +
			`profile/wow/character/${slug}/${charName}?namespace=${NAMESPACE}&locale=${LOCALE}`;
		return this.doRequest(url);
	};

	playersToArray(leaderboard) {
		let players = [];
		for (let i in leaderboard.players) {
			players.push(this.buildPlayer(leaderboard.players[i]));
		}

		return players;
	};


	async buildPlayer(i) {
		let player = i;
		const summary = await this.getSummary(i);
		if (!summary) {
			console.log("no summary ")
			return player;
		}

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

		const urls = [];
		urls.push(pvp_summary, media, specializations, equipment, appearance);

		const keys = ["pvp", "media", "spec", "items", "appearance"];
		player = {
			...player,
			name,
			gender,
			faction,
			race,
			character_class
		};

		console.log("requests");
		for (let i in urls) {
			console.log("doing requests");
			let response = await this.doRequest(urls[i].href);
			player[keys[i]] = response.data;
		}

		const datahandler = new DataHandler(player)

		// setTimeout(() => {
		//   console.log("timeout");
		// }, 500); //0.5sec timeout for not spamming too many requests


		return datahandler.cleanedData();
	};

	// async doRequest(url, log = false,) {
	// 	return axios
	// 		.get(url, {
	// 			headers: {
	// 				Authorization: "Bearer " + this.token
	// 			}
	// 		})
	// 		.then(res => (log ? console.log(res) : "" || res))
	// 		.catch(err => console.log("err: ", err));
	// };

}


module.exports = LeaderboardHandler