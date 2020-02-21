class MediaHandler {

	constructor(request) {
		this.doRequest = request
		this.init()
		this.classIcons = []
		this.specIcons = []
	}

	init() {
		this.fetchClassIcons()
		this.fetchSpecIcons()
	}

	fetchSpecIcons() {


	}

	async fetchClassIcons() {
		console.log("fetching classIcons")
		let icons = []
		for (let i = 1; i <= 12; i++) {
			let url = `https://us.api.blizzard.com/data/wow/media/playable-class/${i}?namespace=static-us&locale=en_US`
			this.doRequest(url)
				.then(res => {
					console.log("res", res.data)
					icons.push(res.data)
				})
		}

		// Promise.all(icons)
		// .then(res => console.log("resss", res))
		// console.log("classIcons", this.classIcons)

	}
}


module.exports = MediaHandler