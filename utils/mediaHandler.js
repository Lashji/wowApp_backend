const fs = require('fs')
const https = require('https')
const path = require('path')
const axios = require('axios')
const ClassList = require('../models/classIconList')
class MediaHandler {

	constructor(request) {
		this.doRequest = request
		this.init()
		this.classIcons = []
		this.specIcons = []
		this.index = []
	}

	init() {
		this.fetchClassIcons()
		this.fetchSpecIcons()
	}

	fetchSpecIcons() {


	}

	async fetchClassIcons() {
		console.log("fetching classIcons")
		await this.getIndex()
		let classes = this.index.classes

		for (let i = 0; i < classes.length; i++) {
			let url = `https://us.api.blizzard.com/data/wow/media/playable-class/${classes[i].id}?namespace=static-us&locale=en_US`
			let response = await this.doRequest(url)
			let iconUrl = response.data.assets[0].value
			this.classIcons.push(`${classes[i].name}.jpg`)
			this.saveImage(`classIcons/${classes[i].name}.jpg`, iconUrl)
		}


		let updated = await ClassList.findOneAndUpdate({
			name: 'classIconList'
		}, {
			data: this.classIcons
		}, {
			new: true,
			upsert: true
		})
		console.log("updated", updated)
	}

	async getIndex() {
		const url = "https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us&locale=en_US"
		let res = await this.doRequest(url)
		this.index = res.data
	}


	// async saveImage(path, url) {
	// 	try {
	// 		let fullPath = `${__dirname}/../public/images/${path}`
	// 		https.get(url, (res) => {
	// 			res.pipe(fs.createWriteStream(fullPath))
	// 		})

	// 	} catch (err) {
	// 		console.log("error when trying to save file", err)
	// 	}
	// }

	async saveImage(path, url) {
		let fullPath = `${__dirname}/../public/images/${path}`

		const writer = fs.createWriteStream(fullPath)

		const response = await axios({
			url,
			method: 'get',
			responseType: 'stream'
		})

		response.data.pipe(writer)

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve)
			writer.on('error', reject)
		})
	}
}


module.exports = MediaHandler