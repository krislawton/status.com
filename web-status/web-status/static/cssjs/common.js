// Background animation
$(document).ready(() => {
	$('#bg-animation').attr('height', $('#page-body').outerHeight()).attr('width', $(window).width());

	//function initanim() {
	//	window.requestAnimationFrame(drawanim);
	//}

	var triangles = [];

	function drawanim() {
		var cheight = $('#bg-animation').height(),
			cwidth = $('#bg-animation').width();

		var ctx = document.getElementById("bg-animation").getContext("2d");

		ctx.globalCompositeOperation = "destination-over";
		ctx.clearRect(0, 0, cwidth, cheight);

		var targett = 100;
		for (var t = triangles.length; triangles.length < targett; t++) {
			var firstFew = triangles.length < targett - 1;
			triangles.push(new newTriangle(firstFew));
		}

		for (i = 0; i < triangles.length; i++) {
			var tr = triangles[i];
			tr.p1.x += tr.v + tr.p1.vx;
			tr.p2.x += tr.v + tr.p2.vx;
			tr.p3.x += tr.v + tr.p3.vx;
			tr.p1.y += tr.p1.vy;
			tr.p2.y += tr.p2.vy;
			tr.p3.y += tr.p3.vy;

			tr.o += tr.ov;
			if (tr.o > 1) {
				tr.ov = 0;
				tr.o = 1;
			}
			if (tr.o < 0) {
				tr.ov = 0;
				tr.o = 0;
			}

			var hslString = tr.hue + ", " + tr.sat + "%, " + tr.lig + "%";
			ctx.fillStyle = "hsla(" + hslString + ", "+ tr.o * 0.4 +")";
			ctx.strokeStyle = "hsla(" + hslString + ", " + tr.o * 0.6 + ")";
			ctx.lineWidth = 3;

			ctx.beginPath();
			ctx.moveTo(Math.round(tr.p1.x * 2) / 2, Math.round(tr.p1.y * 2) / 2);
			ctx.lineTo(Math.round(tr.p2.x * 2) / 2, Math.round(tr.p2.y * 2) / 2);
			ctx.lineTo(Math.round(tr.p3.x * 2) / 2, Math.round(tr.p3.y * 2) / 2);
			ctx.lineTo(Math.round(tr.p1.x * 2) / 2, Math.round(tr.p1.y * 2) / 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

			if (tr.p1.x > cwidth) {
				tr.ov = - (0.001 + Math.random() * 0.009);
			}
			if (tr.o <= 0) {
				triangles.splice(i, 1);
			}
		}
	}
	
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	(function loop() {
		drawanim();
		requestAnimFrame(loop);
	})();

	function newTriangle(firstFew) {
		// var maxSize = 800;
		var maxTV = 0.1;

		var startX = firstFew ? Math.random() * $(window).innerWidth() - 500 : 0 - Math.random() * 500;

		var sizeMultiplier = 0.2 + Math.random() * 0.8;
		var minV = 0.4 * 3;
		var maxV = 0.8 * 3;
		var coordVelocityFactor = 0.5;

		var baseAngle = Math.random() * 360;
		var c2Angle = baseAngle - 25 + Math.random() * 30;
		var c3Angle = baseAngle + 25 + Math.random() * 30;
		var c2Distance = 1000 * sizeMultiplier;
		var c3Distance = c2Distance * 0.75 + c2Distance * 0.5 * Math.random();

		var c2Adj = Math.cos(c2Angle * Math.PI / 180) * c2Distance;
		var c3Adj = Math.cos(c3Angle * Math.PI / 180) * c3Distance;
		var c2Opp = Math.sin(c2Angle * Math.PI / 180) * c2Distance;
		var c3Opp = Math.sin(c3Angle * Math.PI / 180) * c3Distance;

		var ry = Math.random() * $('#bg-animation').height();
		this.p1 = {
			x: 0 + startX, y: 0 + ry,
			vx: 0 - maxTV + Math.random() * maxTV * 2,
			vy: 0 - maxTV + Math.random() * maxTV * 2
		};
		this.p2 = {
			x: c2Adj + startX,
			y: c2Opp + ry,
			vx: 0 - maxTV + Math.random() * maxTV * 2 * coordVelocityFactor * sizeMultiplier,
			vy: 0 - maxTV + Math.random() * maxTV * 2 * coordVelocityFactor * sizeMultiplier
		};
		this.p3 = {
			x: c3Adj + startX,
			y: c3Opp + ry,
			vx: 0 - maxTV + Math.random() * maxTV * 2 * coordVelocityFactor * sizeMultiplier,
			vy: 0 - maxTV + Math.random() * maxTV * 2 * coordVelocityFactor * sizeMultiplier
		};
		this.v = minV + Math.random() * (maxV - minV);
		this.o = 0;
		this.ov = 0.001 + Math.random() * 0.009;

		var saturated = Math.random() < 0.4;
		var bright = Math.random() < 0.0;
		//this.hue = Math.round(bright ? Math.random() * 360 : 176 + Math.random() + 60);
		this.hue = 216;
		this.sat = Math.round(bright || saturated ? 50 + Math.random() * 50 : 25 + Math.random() * 10);
		this.lig = Math.round(bright || saturated ? 30 + Math.random() * 40 : 29 + Math.random() * 20);
	}

});

/* =========== */
/* Web sockets */
/* =========== */
// Initial connection and tracking disconnections
var socket = io();
var socketIsConnected = false;
socket.on("connect", () => {
	socketIsConnected = true;
});
socket.on("reconnect", () => {
	reportErrorToUser("0$00000102", "The page has reconnected its asyncronous connection to the server.");
	socketIsConnected = true;
});
socket.on("connect_error", (e) => {
	if (socketIsConnected) {
		reportErrorToUser("0$00000101", "The page lost its asyncronous connection to the server. Either the server is having problems or your internet is.");
		socketIsConnected = false;
	}
});

// Custom socket request functions
/**
 * Does a socket.emit with error and pageload handling
 * @param {string} type The type of talk we're doing. Choose from
 * regular
 * pageload-dependent
 * @param {string} say What you want to talk to the server about. This should correspond to something the server can do something with.
 * @param {any} args Argument(s) to pass to the emit along with the say.
 * @param {function} callback Standard callback (format is '(error, result)')
 */
socket.talk = function () {
	// Dynamic arguments
	var type = arguments[0];
	var say = arguments[1];

	var cbIndex = arguments.length - 1;
	var callback = arguments[cbIndex];

	var args = [];
	args.push(say);
	for (var i = 2; i < arguments.length - 1; i++) {
		args.push(arguments[i]);
	}
	args.push((error, result) => {
		callback(error, result);
	});

	// Check type is valid first
	var validTypes = ["regular", "pageload-dependent"];
	if (validTypes.indexOf(type) === -1) {
		reportErrorToUser("0$00000103", 'A bad asynchronous request was attempted: Type "' + type + '" does not exist.');
		callback(true, null);
		return;
	}

	// If it's valid, do the emit
	//socket.emit.apply(null, args);
	// Test replacement for emitting to server
	try {
		demoEmit.apply(null, args);
	} catch (e) {
		reportErrorToUser("0$00000104", "The asynchronous request went bad. Are the arguments correct?");
		callback(true, null);
	}
};

function demoEmit(say, arg1, arg2, arg3, callback) {
	var passBack = {
		title: "This is an example of a passed back object",
		arguments: [arg1, arg2, arg3],
		say: say
	};
	callback(null, passBack);
}

/* =============== */
/* Error reporting */
/* =============== */
var errors = [];
class Error {
	constructor() {
		this.timestamp = new Date();
		this.code;
		this.message;
		this.resolved = false;
	}
}
function addErrorToLog(code, message) {
	var e = new Error;
	e.code = code;
	e.message = message;
	errors.push(e);
}

/**
 * Starting point for an error occurring
 * @param {number} code The error code in hexatridecimal (base36).
 * In the format 0$00ppccee where 0 and $ are literal, p is page, c is category, e is error.
 * p00 is general, p01 is server.
 * c00 is unspecified, c01 is socket.
 * e00 is reserved for general
 * @param {string} message The text to be shown.
 */
function reportErrorToUser(code, message) {
	// Send to console
	console.error(code + ": " + message);

	// Create error in log
	addErrorToLog(code, message);

	// Create HTML object for error
	var objContainer = document.createElement("div");
	objContainer.className = "error";
	objContainer.style.display = "none";
	objContainer.dataset.code = code;

	var objInner = document.createElement("div");
	objInner.className = "inner";

	var objText = document.createElement("span");
	objText.textContent = "Error: " + message + " (code " + code + ")";

	var objClose = document.createElement("button");
	objClose.textContent = "X";
	objClose.className = "button close";

	// Link HTML together
	objInner.appendChild(objText);
	objInner.appendChild(objClose);
	objContainer.appendChild(objInner);

	// Put error object on page and animate
	$('#error-space').prepend(objContainer);
	$(objContainer).slideDown(150);
}

// When error closes are clicked, remove them from the page with a little animation
$(document).on("click", '#error-space .close', function () {
	var errorToClose = $(this).parents('.error');
	$(errorToClose).slideUp(150, () => {
		$(errorToClose).remove();
	});
});

///* =========== */
///* Log viewing */
///* =========== */
//$(document).on("click", '#show-log', () => {
//	// Clear the log space
//	$('#log-space').html("");


//});