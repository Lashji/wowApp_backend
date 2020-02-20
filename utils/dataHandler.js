class DataHandler {

	constructor(data) {
		this.rawData = data
		this.data = {}
	}


	cleanedData() {
		console.log("returning data", this.data)
		this.addGeneralInfo()
		this.addPvpInfo()
		this.addSpecInfo()
		return this.data
	}


	addGeneralInfo() {
		const {
			character,
			faction,
			rank,
			rating,
			season_match_statistics,
			gender,
			race,
			character_class,
		} = this.rawData

		this.data.general = {
			name: character.name,
			id: character.id,
			realm: character.realm.slug,
			faction: faction.type,
			rank,
			rating,
			season_match_statistics,
			gender: gender.type,
			race,
			class: character_class,
		}
	}
	addPvpInfo() {
		const {
			pvp
		} = this.rawData
		this.data.pvp = {
			honorLevel: pvp.honor_level,
			hk: pvp.honorable_kills
		}
	}


	addSpecInfo() {
		const {
			specializations,
			active_specialization
		} = this.rawData.spec
		this.data.specializations = {
			active: {
				name: active_specialization.name.en_US,
				id: active_specialization.id
			},
			specializations
		}
	}

	addMedia() {
		const {
			media
		} = this.rawData
		this.data.media = {
			avatar: media.avatar_url,
			bust: media.bust_url,
			render: media.render_url,
		}
	}

	addItemInfo() {
		const {
			items
		} = this.rawData
		this.data.items = {
			items: items.equipped_items
		}
	}

	addAppearanceInfo() {
		const {
			appearance
		} = this.rawData

		this.data.appearance = {

		}
	}
}


module.exports = DataHandler