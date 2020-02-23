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
	}

	async init() {


		this.fetchClassIcons()
		this.fetchSpecIcons()
	}

	async fetchSpecIcons() {

		const indexUrl = "https://us.api.blizzard.com/data/wow/playable-specialization/index?namespace=static-us"
		const indexRes = await this.doRequest(indexUrl)
		const specs = indexRes.character_specializations

		for (let i in specs) {
			let {
				id,
				name,
				key
			} = specs[i]
			let mediaUrl = `https://us.api.blizzard.com/data/wow/media/playable-specialization/${id}?namespace=static-us`
			let mediaResponse = await this.doRequest(mediaUrl)
			console.log("media response: ", mediaResponse)
			console.log('name', name)
			const imgUrl = mediaResponse.assets[0].value
			console.log('imgurl', imgUrl)
			this.saveImage(`specIcons/${name}.jpg`, imgUrl)
		}

		// const ids = indexRes.character_specializations.map(i => i.id)
	}

	async fetchClassIcons() {
		console.log("fetching classIcons")
		const indexUrl = "https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us"
		const res = await this.doRequest(indexUrl)
		const classes = res.classes
		console.log('classes: ', res)
		for (let i = 0; i < classes.length; i++) {
			const url = `https://us.api.blizzard.com/data/wow/media/playable-class/${classes[i].id}?namespace=static-us`
			const response = await this.doRequest(url)
			console.log("class response", response)
			const iconUrl = response.assets[0].value
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