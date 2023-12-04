const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// Chapter: Middleware
// url notaion
// "/api/v1/tours/:page/:optional?"

app.use(morgan("dev"));

// Notes:- Middle ware => express.json()
app.use(express.json());
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Notes : Create own Middleware
// It will log for every rout because the route are defined later
app.use((req, res, next) => {
	console.log("Hello from MiddleWare😁");
	next();
});

// Chapter: Route Handlers

// [ ]: Tour Route Functions
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

// [ ]: User route Functions

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This is not yet implemented",
	});
};
const getUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This is not yet implemented",
	});
};
const createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This is not yet implemented",
	});
};
const updateUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This is not yet implemented",
	});
};
const deleteUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This is not yet implemented",
	});
};

// Chapter: Routing

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Notes: Best Routing Practice

const tourRouter = express.Router();
const userRouter = express.Router();

// [ ]: Tour Routes

tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

//  [ ]: User Routes

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter); //Middleware
app.use("/api/v1/users", userRouter); //Middleware

// Notes : Create Middleware
// It will not log when previous route are requested because the route are defined before
// app.use((req, res, next) => {
// 	console.log("Hello from MiddleWare😁");
// 	next();
// });

// Chapter: Starting Server
const port = 8000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}....`);
});
