const fs = require("fs");

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkId = (req, res, next, val) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);

	if (!tour) {
		return res.status(404).json({ status: "fail", message: "Invalid Id" });
	}
	next();
};

// Create Checkbody middleware
const checkBody = (req, res, next) => {
	if (!(req.body && req.body.name && req.body.price)) {
		return res.status(400).json({ error: "Missing Name or Price" });
	}
	next();
};

// Chapter: Route Handlers

// Topic: Handle Get requests

const getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
};
//  Topic: Getting specific tour

const getTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
};

// Topic: Handle Post requests
const createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);

	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(201).json({
				status: "success",
				data: {
					tour: newTour,
				},
			});
		}
	);
};

// Topic: Handle Patch requests (Update)
const updateTour = (req, res) => {
	const id = req.params.id * 1;

	const tour = tours.find((el) => el.id === id);
	const updatedTour = req.body;

	res.status(200).json({
		status: "Success",
		data: {
			tour: { ...tour, ...updatedTour },
		},
	});
};

// Topic: Handle Delete requests
const deleteTour = (req, res) => {
	res.status(204).json({
		status: "Success",
		data: null,
	});
};

module.exports = {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	checkId,
	checkBody,
};
