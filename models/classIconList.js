'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const classIconListSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	data: {
		type: [],
		required: true
	},

})


module.exports = new mongoose.model("ClassList", classIconListSchema)