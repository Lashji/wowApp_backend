'use strict'

const IconList = require('../models/iconList')


module.exports = {
	async getSpecIcons(req, res) {
		const specIcons = await IconList.find({
			name: 'specIconList'
		})

		res.json(specIcons)
	},

	async getClassIcons(req, res) {
		const classIcons = await IconList.find({
			name: 'classIconList'
		})
		res.json(classIcons)
	}

}