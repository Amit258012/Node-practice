const mongoose = require("mongoose");
const dotEnv = require("dotenv");

process.on("uncaughtException", (err) => {
	console.log("uncaught exception, shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

dotEnv.config({ path: "./config.env" });
const app = require("./app");

// Connecting to MongoDB
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
	console.log("DB connection successful!");
});

// const testTour = new Tour({
// 	name: "The Advent",
// 	rating: 4,
// 	price: 997,
// });

// testTour
// 	.save()
// 	.then((doc) => {
// 		console.log(doc);
// 	})
// 	.catch((e) => console.log("Error:", e));

// Starting Server
const port = process.env.port || 8000;
const server = app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
process.on("unhandledRejection", (err) => {
	console.log(err.name, err.message);
	console.log("unhandler rejection, shutting down...");
	server.close(() => {
		process.exit(1);
	});
});
