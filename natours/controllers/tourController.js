const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// const checkId = (req, res, next) => {
// 	const id = req.params.id * 1;
// 	const tour = tours.find((el) => el.id === id);

// 	if (!tour) {
// 		return res.status(404).json({ status: "fail", message: "Invalid Id" });
// 	}
// 	next();
// };

// Create Checkbody middleware
// const checkBody = (req, res, next) => {
// 	if (!(req.body && req.body.name && req.body.price)) {
// 		return res.status(400).json({ error: "Missing Name or Price" });
// 	}
// 	next();
// };

// Chapter: Route Handlers

// Topic: Handle Get requests

exports.aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingAverage,price";
	req.query.fields = "name,price,ratingAvarage,summary,difficulty";
	next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
	exports.stats = await Tour.aggregate([
		{
			$match: { ratingAvarage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: "$difficulty",
				num: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingAvarage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: -1 }, //1 for asc and -1 for desc
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	exports.year = req.params.year * 1;
	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates", //spread the arr into single value
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numTourStarts: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: { month: "$_id" },
		},
		{
			$project: {
				_id: 0, // don't show id
			},
		},
		{
			$sort: { numTourStarts: -1 },
		},
		{
			$limit: 12,
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			plan,
		},
	});
});
