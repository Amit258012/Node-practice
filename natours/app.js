const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Chapter: Middleware
// url notaion
// "/api/v1/tours/:page/:optional?"

app.use(morgan("dev"));

// Notes:- Middle ware => express.json()
app.use(express.json());

// Notes : Create own Middleware
// It will log for every rout because the route are defined later
app.use((req, res, next) => {
	console.log("Hello from MiddleWare😁");
	next();
});

// Chapter: Routing

app.use("/api/v1/tours", tourRouter); //Middleware
app.use("/api/v1/users", userRouter); //Middleware

module.exports = app;
