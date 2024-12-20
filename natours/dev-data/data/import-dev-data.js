const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const fs = require("fs");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// console.log(tours);

// Import data into db
const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, { validateBeforeSave: false });
		await Review.create(reviews);
		console.log("Data successfully Imported!");
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
		await User.deleteMany();
		await Review.deleteMany();
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
