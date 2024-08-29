const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

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

const aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingAverage,price";
	req.query.fields = "name,price,ratingAvarage,summary,difficulty";
	next();
};

const getAllTours = async (req, res) => {
	try {
		const features = new APIFeatures(Tour.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const tours = await features.query;

		res.status(200).json({
			status: "success",
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};
//  Topic: Getting specific tour

const getTour = async (req, res) => {
	try {
		// Tour.findOne({ _id: req.params.id })
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}

	// const id = req.params.id * 1;
	// const tour = tours.find((el) => el.id === id);
	// res.status(200).json({
	// 	status: "success",
	// 	data: {
	// 		tour,
	// 	},
	// });
};

// Topic: Handle Post requests
const createTour = async (req, res) => {
	try {
		// const newTour = new Tour({});
		// newTour.save()
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: "Invaild data sent!",
		});
	}

	// const newId = tours[tours.length - 1].id + 1;
	// const newTour = Object.assign({ id: newId }, req.body);
	// tours.push(newTour);
	// fs.writeFile(
	// 	`${__dirname}/dev-data/data/tours-simple.json`,
	// 	JSON.stringify(tours),
	// 	(err) => {
	// 		res.status(201).json({
	// 			status: "success",
	// 			data: {
	// 				tour: newTour,
	// 			},
	// 		});
	// 	}
	// );
};

// Topic: Handle Patch requests (Update)
const updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error,
		});
	}

	// const id = req.params.id * 1;
	// const tour = tours.find((el) => el.id === id);
	// const updatedTour = req.body;
	// res.status(200).json({
	// 	status: "Success",
	// 	data: {
	// 		tour: { ...tour, ...updatedTour },
	// 	},
	// });
};

// Topic: Handle Delete requests
const deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: "Success",
			data: null,
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

const getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
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
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

const getMonthlyPlan = async (req, res) => {
	try {
		const year = req.params.year * 1;
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
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error,
		});
	}
};

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
};
