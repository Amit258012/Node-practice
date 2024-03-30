const Tour = require("../models/tourModel");

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

const getAllTours = async (req, res) => {
	try {
		const tours = await Tour.find();
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

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
};
