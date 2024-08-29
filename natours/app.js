const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Chapter: Middleware
// url notaion
// "/api/v1/tours/:page/:optional?"

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Notes:- Middle ware => express.json()
app.use(express.json());

// serve the static files
app.use(express.static(`${__dirname}/public`));

// Notes : Create own Middleware
// It will log for every rout because the route are defined later
// app.use((req, res, next) => {
// 	console.log("Hello from MiddleWare😁");
// 	next();
// });

// Chapter: Routing

app.use("/api/v1/tours", tourRouter); //Middleware
app.use("/api/v1/users", userRouter); //Middleware

//  Handle wrong urls
app.all("*", (req, res, next) => {
	// res.status(404).json({
	// 	status: "fail",
	// 	message: ` Can't find ${req.originalUrl} on the server! `,
	// });

	// const err = new Error(` Can't find ${req.originalUrl} on the server! `);
	// err.status = "fail";
	// err.statusCode = 404;

	next(new AppError(` Can't find ${req.originalUrl} on the server! `, 400));
});

// Error handling Middleware
app.use(globalErrorHandler);

module.exports = app;
