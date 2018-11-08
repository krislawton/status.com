'use strict';
/* ================= */
/* SETTING UP SERVER */
/* ================= */
// Contains things like whether to use HTTPS, what port to use.
const enviroConfig = require("./conf/environment.js");

// Express
require("marko/node-require");
const express = require("express");
const app = express();

// Run server - runs HTTPS or HTTP based on /conf/environment.js
console.log('Server in "' + enviroConfig.name + '" mode is being instantiated on port ' + enviroConfig.port + '...');
var server;
if (!enviroConfig.usesHttps) {
	server = app.listen(enviroConfig.port, (err) => {
		if (err) {
			return console.log("Sum ting wong", err);
		}
		console.log("Success");
	});
} else {
	const https = require("https");
	const fs = require("fs");
	const key = fs.readFileSync(enviroConfig.certificateLocation + "privkey.pem");
	const cert = fs.readFileSync(enviroConfig.certificateLocation + "cert.pem");
	const ca = fs.readFileSync(enviroConfig.certificateLocation + "chain.pem");
	const serverOptions = {
		key: key,
		cert: cert,
		ca: ca
	};
	server = https.createServer(serverOptions, app).listen(enviroConfig.port, (err) => {
		if (err) {
			return console.log("Sum ting wong", err);
		}
		console.log("Success");
	});
}

// Modules
const websockets = require("socket.io");

const markoExpress = require("marko/express");
app.use(markoExpress());

//const model = require("./backend/model.js");
//setTimeout(function () {
//	var r = model.getServiceStatus((error, result) => {
//		console.log(error);
//		console.log(result);
//	});
//}, 5000);

/* =================== */
/* NAVIGATING TO PAGES */
/* =================== */
// Most stuff here is done by /backend/get.js
var serverGet = require("./backend/get.js");
app.get("*", (request, result) => {
	// Returns whether or not to use marko and any further details
	var instructions = serverGet(request);

	// Set HTML status code
	result.status(instructions.htmlStatus);

	if (instructions.resultType === "marko") {
		// Return marko page
		result.marko(instructions.markoObject);

	} else if (instructions.resultType === "sendFile") {
		// Send a file
		result.sendFile(instructions.sendFileFile, instructions.sendFileOptions);
		
	} else {
		// Instructions unclear: Just send the logo
		result.sendFile("LogoWhite.png", { root: __dirname + "/static/" });

	}
});