class Environment {
	constructor(name) {
		this.name = name;
		this.port;
		this.useHttps;
		this.certificateLocation;
		this.db = {
			host: null,
			user: null,
			pass: null,
			database: "Status",
			port: 5432
		};
	}
}

var live = new Environment("production");
live.port = 443;
live.useHttps = true;
live.certificateLocation = null; // TO BE DECLARED

var dev = new Environment("development");
dev.port = 1339;
dev.useHttps = false;
dev.db.host = "192.168.1.211";
dev.db.user = "postgres";
dev.db.pass = "YcsBuVq21YJicBbm7ck2E6UxaVaVSeoU";

const using = dev;

module.exports = using;