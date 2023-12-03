const express = require("express");
const fs = require("fs");
const app = express();

// Notes:- Middle ware => express.json()
app.use(express.json());
// app.get("/", (req, res) => {
// 	res.status(400).json({ message: "Hello World!", app: "Natour" });
// });

// app.post("/", (req, res) => {
// 	res.send("Send your message to this endpoint");
// });

// Topic: Handle Get requests

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
});

//  Topic: Getting specific tour
// "/api/v1/tours/:page/:optional?"
app.get("/api/v1/tours/:id", (req, res) => {
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
});

// Topic: Handle Post requests
app.post("/api/v1/tours", (req, res) => {
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
});

const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
