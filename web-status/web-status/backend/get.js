/*
 * This script is for when the server receives 
 * get requests. As a module it returns
 * instructions for the server: Either send
 * a file from this directory or send tell the
 * marko engine to render a page.
 */

// Object where key is URL and value is a string of the directory of the marko page
var markoPages = {
	"/": "/pages/index.marko"
};

// Object where key is URL and value is the marko page itself
var markoObjects = {};
for (var i in markoPages) {
	markoObjects[i] = require("./.." + markoPages[i]);
}

// Each URL mapped to a file/directory combo
var filesToSend = {
	"/c/common.css": { file: "common.css", directory: "/static/cssjs/" },
	"/c/common.js": { file: "common.js", directory: "/static/cssjs/" },
	"/c/FiraSans-Regular.ttf": { file: "FiraSans-Regular.ttf", directory: "/static/" },
	"/c/jquery-3.2.1.min.js": { file: "jquery-3.2.1.min.js", directory: "/static/" },
	"/c/logo_white.png": { file: "logo_white.png", directory: "/static/" },
	"/c/websocket.js": { file: "socket.io.js", directory: "/node_modules/socket.io-client/dist/" },
	"/c/index.js": { file: "index.js", directory: "/static/cssjs" },
	"/c/index.css": { file: "index.css", directory: "/static/cssjs" }
};

// Sends instructions back to server.js as to whether to use marko or send a file
module.exports = (request) => {

	var conglomerated = {
		htmlStatus: null,
		resultType: null,
		markoObject: null,
		sendFileFile: null,
		sendFileOptions: { root: null }
	};

	if (typeof markoPages[request.path] !== "undefined") {
		conglomerated.htmlStatus = 200;
		conglomerated.resultType = "marko";

		conglomerated.markoObject = markoObjects[request.path];

	} else if (typeof filesToSend[request.path] !== "undefined") {
		conglomerated.htmlStatus = 200;
		conglomerated.resultType = "sendFile";

		var fs = filesToSend[request.path];
		conglomerated.sendFileFile = fs.file;
		conglomerated.sendFileOptions.root = __dirname + "/.." + fs.directory;

	} else {
		conglomerated.htmlStatus = 404;
		conglomerated.resultType = "marko";

		conglomerated.markoObject = markoObjects["/"];

		// 404 CURRENTLY SENDS HOMEPAGE!
		// Todo a proper 404 page
	}

	return conglomerated;
};