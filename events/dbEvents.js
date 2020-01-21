const EventEmitter = require('events')

class DbEmitter extends EventEmitter {}

const dbEmitter = new DbEmitter()

module.exports = dbEmitter