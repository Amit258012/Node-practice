const express = require("express");
const fs = require("fs");
const app = express();

// url notaion
// "/api/v1/tours/:page/:optional?"

// Notes:- Middle ware => express.json()
app.use(express.json());
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

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
	console.log(req.params);

	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);

	if (!tour) {
		return res.status(404).json({ status: "fail", message: "Invalid Id" });
	}

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

	if (id > tours.length) {
		return res.status(404).json({ status: "fail", message: "Invalid Id" });
	}
	res.status(200).json({
		status: "Success",
		data: {
			tour: { ...tour, ...updatedTour },
		},
	});
};

// Topic: Handle Delete requests
const deleteTour = (req, res) => {
	const id = req.params.id * 1;

	if (id > tours.length) {
		return res.status(404).json({ status: "fail", message: "Invalid Id" });
	}
	res.status(204).json({
		status: "Success",
		data: null,
	});
};

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Notes: Best Routing Practice

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app.route("/api/v1/tours/:id")
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
