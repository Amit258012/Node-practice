const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const fs = require("fs");
const Tour = require("../../models/tourModel");

console.log(process.env.DATABASE);

// Connecting to MongoDB
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {})
	.then(() => {
		console.log("DB connection successful!");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
	});

// Read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// console.log(tours);

// Import data into db
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Data successfully loaded!");
		process.exit(); // don't use in development
	} catch (err) {
		console.error(err);
	}
};
// importData();

// Delete all data from db
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Data successfully deleted!");
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}

console.log(process.argv);
