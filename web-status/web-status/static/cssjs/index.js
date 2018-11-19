$(document).ready(() => {
	reportErrorToUser("0$00000000", "This is a test error.");

	socket.talk("regular", "hello", "kris", "tourny", "pad", (error, result) => {
		console.log("Socket did:");
		console.log(error);
		console.log(result);
	});
});