const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });

const app = require("./app");

// Connecting to MongoDB
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connection successful!");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
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
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
