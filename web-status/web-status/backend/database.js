/*
 * This script is for direct access to the
 * database. Each exported variable matches to 
 * a database interaction (usually function or 
 * stored procedure)
 */

// Connect to DB
const enviroConfig = require("./../conf/environment.js");
const postgres = require("pg");
const dbPool = new postgres.Pool({
	host: enviroConfig.db.host,
	user: enviroConfig.db.user,
	pass: enviroConfig.db.pass,
	database: enviroConfig.db.database
});

class queryPool {
	constructor(queryString, callback) {
		dbPool.query(queryString, (error, result) => {
			if (error) {
				callback(error, result);
			} else {
				new resultObject("select", result, (tError, tResult) => {
					callback(tError, tResult);
				});
			}
		});
	}
}

class resultObject {
	constructor(type, originalResult, callback) {
		try {

			var newResult = {};

			if (type === "select") {
				newResult.rowCount = originalResult.rowCount;
				newResult.rows = originalResult.rows;
				newResult.fields = [];
				for (var i in originalResult.fields) {
					var f = { name: originalResult.fields[i].name };
					newResult.fields.push(f);
				}
			}

			callback(null, newResult);
		}
		catch (e) {
			callback(e, null);
		}

	}
}

// All methods that can be called
module.exports = {
	getServiceStatus: (callback) => {
		new queryPool("select * from spservicesgetstatus()", (error, result) => {
			callback(error, result);
		});
	}
};