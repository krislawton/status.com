const db = require("./database.js");

module.exports = {
	getServiceStatus: (callback) => {
		db.getServiceStatus((error, result) => {
			callback(error, result);
		});
	}
};