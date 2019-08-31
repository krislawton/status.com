'use strict';

$(document).ready(() => {
	// Debug: Test error
	// reportErrorToUser("0$00000000", "This is a test error.");

	// Debug: Test socket
	//socket.talk("hi", "hello", "kris", "tourny", "pad", (error, result) => {
	//	console.log("Socket did:");
	//	console.log(error);
	//	console.log(result);
	//});

	// Debug: Generate some random areas and populate them
	var areas = debugGenerateAreas();

	console.log(areas);

	// Iterate through areas returned and render on page
	// atr = area to render
	for (var atr = 0; atr < areas.length; atr++) {
		// Area element
		var elArea = document.createElement("div");
		elArea.className = "area";
		// Title
		var elTitle = document.createElement("div");
		elTitle.className = "title";
		elTitle.innerText = areas[atr].areaName;
		elArea.appendChild(elTitle);
		// Status
		var elStatus = document.createElement("div");
		elStatus.className = "status";
		elStatus.style.color = issueTypes[areas[atr].mostSevere].textColor;
		elStatus.innerText = issueTypes[areas[atr].mostSevere].displayText;
		elArea.appendChild(elStatus);
		// Bar container
		var elBarCont = document.createElement("div");
		elBarCont.className = "bar-container";
		// Each bar
		for (var bar in areas[atr].bars) {
			var thisBar = areas[atr].bars[bar];
			var elThisBar = document.createElement("div");

			// Top half - severity
			var elBarTop = document.createElement("div");
			elBarTop.className = "bar-top";
			elBarTop.style.backgroundColor = issueTypes[thisBar.mostSevere].barColor;
			elThisBar.appendChild(elBarTop);
			// Bottom half - uptime
			var elBarBottom = document.createElement("div");
			elBarBottom.className = "bar-bottom";
			// 39, 86%, 53
			var uptimeHue = Math.round(thisBar.uptime * 39);
			var uptimeSaturation = thisBar.uptime === 1 ? 0 : 86;
			var uptimeLightness = thisBar.uptime === 1 ? 80 : Math.round(30 + thisBar.uptime * 23);
			elBarBottom.style.backgroundColor = "hsl(" + uptimeHue + ", " + uptimeSaturation + "%, " + uptimeLightness + "%)";
			elThisBar.appendChild(elBarBottom);

			// Tooltip contents
			var elBarTt = document.createElement("div");
			elBarTt.className = "tooltip";
			elBarTt.innerHTML = "Uptime: " + (Math.round(thisBar.uptime * 10000) / 100) + "% <br/> " + issueTypes[thisBar.mostSevere].displayText;
			elThisBar.appendChild(elBarTt);

			elBarCont.appendChild(elThisBar);
		}
		elArea.appendChild(elBarCont);

		// Append to page
		document.getElementById("areas").appendChild(elArea);

		considerBarWidth();
	}
	
});

// Consider the width of the bars relative to the page
function considerBarWidth() {
	var widthToWorkWith = $('.bar-container').width();
	var maximumBars = Math.floor((widthToWorkWith - 14) / 9);
	if (maximumBars > 90) {
		var widthAvailableForBarsContents = widthToWorkWith - (88 * 4) - (2 * 2); // margins gone
		var widthOfEachBar = widthAvailableForBarsContents / 90;
		$('.bar-container .bar-top, .bar-container .bar-bottom').width(widthOfEachBar);
	}
}

// Debug: This element will hopefully eventually be filled from the db
var issueTypes = {
	"dfbe": {
		barColor: " hsl(120,  50%,  50%)",
		textColor: "hsl(120,  50%,  50%)",
		displayText: "No issues",
		className: "it-noissues"
	},
	"d8d9": {
		barColor:" hsl(240,   50%,  50%)",
		textColor: "hsl(240,  50%,  50%)",
		displayText: "Maintenance",
		className: "it-maint"
	},
	"136f": {
		barColor: " hsl( 39,  86%,  53%)",
		textColor: "hsl( 39,  86%,  53%)",
		displayText: "Incident",
		className: "it-inci"
	},
	"6df5": {
		barColor: " hsl(  0,  0%,   20%)",
		textColor: "hsl(  0,  0%,   20%)",
		displayText: "Taken offline",
		className: "it-offline"
	},
	"482e": {
		barColor: " hsl(  0,  50%,  50%)",
		textColor: "hsl(  0,  50%,  50%)",
		displayText: "Outage",
		className: "it-outage"
	}
};

// Debug: Generate some random areas for the page to use until we're using accurate data
function debugGenerateAreas() {
	var areasToGenerate = 4 + Math.ceil(Math.random() * 10);

	var areas = [];

	// Loop through areas to generate
	for (var a = 0; a < areasToGenerate; a++) {
		var mostSevere = debugRandomSeverityId();
		var areaContent = { areaName: "Area " + a, mostSevere: mostSevere, "bars": [] };

		// Loop through days to generate
		for (var d = 0; d < 90; d++) {
			var daySeverity = debugRandomSeverityId();
			var dayUptime = daySeverity === "dfbe" ? 1 : 1 - Math.pow(Math.random(), 1.2);
			var day = { dayLabel: "Day " + d, mostSevere: daySeverity, uptime: dayUptime };
			areaContent.bars.push(day);
		}

		areas.push(areaContent);
	}

	return areas;
}
// Debug: Get a random severity ID (usually no issue)
function debugRandomSeverityId() {
	var issueTypeIds = ["dfbe", "d8d9", "136f", "6df5", "482e"];
	var selected = "";

	if (Math.random() < 0.98) {
		selected = "dfbe";
	} else {
		selected = issueTypeIds[Math.floor(Math.random() * 5)];
	}

	return selected;
}