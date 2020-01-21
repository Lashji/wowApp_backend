'use strict';

const mongoose = require('mongoose');
const dbEmitter = require("../events/dbEvents")

function connectDB(dbConfig) {
	console.log("connecting db")
	mongoose
		.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
		.then(() => {
			mongoose.connection.on('error', (err) => {
				console.log("Error when connecting: ", err)
				return
			});

			mongoose.connection.on('reconnectFailed', handleCriticalError);
			console.log("db Connected event")
			dbEmitter.emit("connected")
		})
		.catch(handleCriticalError);
}

function handleCriticalError(err) {
	console.warn("err: ", err);
	throw err;
}

function disconnectDB() {
	console.log("disconnecting db")
	mongoose.disconnect();
}


module.exports = {
	connectDB,
	disconnectDB
};