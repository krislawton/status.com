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
		var minV = 0.4 * 5;
		var maxV = 0.8 * 5;
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