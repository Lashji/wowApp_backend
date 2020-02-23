const fs = require('fs')
const https = require('https')
const path = require('path')
const axios = require('axios')
const IconList = require('../models/iconList')
class MediaHandler {

	constructor(request) {
		this.doRequest = request
		// this.refreshImages()
		this.classIcons = []
		this.specIcons = []
	}

	async refreshImages() {
		this.fetchClassIcons()
		this.fetchSpecIcons()
	}

	async fetchSpecIcons() {

		const indexUrl = "https://us.api.blizzard.com/data/wow/playable-specialization/index?namespace=static-us"
		const indexRes = await this.doRequest(indexUrl)
		const specs = indexRes.character_specializations
		const specIcons = []
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
			specIcons.push(`${specs[i].name.toLowerCase()}.jpg`)
			this.saveImage(`specIcons/${name.toLowerCase()}.jpg`, imgUrl)
			setTimeout(() => {
				console.log('timeout .5sec in fetchSpecIcons')
			}, 500)
		}


		this.saveListToDB(specIcons, "specIconList")

	}

	async fetchClassIcons() {
		console.log("fetching classIcons")
		const indexUrl = "https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us"
		const res = await this.doRequest(indexUrl)
		const classes = res.classes
		const classIcons = []
		console.log('classes: ', res)
		for (let i = 0; i < classes.length; i++) {
			const url = `https://us.api.blizzard.com/data/wow/media/playable-class/${classes[i].id}?namespace=static-us`
			const response = await this.doRequest(url)
			console.log("class response", response)
			const iconUrl = response.assets[0].value
			classIcons.push(`${classes[i].name}.jpg`.toLowerCase())
			this.saveImage(`classIcons/${classes[i].name}.jpg`.toLowerCase(), iconUrl)
		}

		this.saveListToDB(classIcons, "classIconList")
	}

	async saveListToDB(data, name) {

		let updated = await IconList.findOneAndUpdate({
			name: name
		}, {
			data: data
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