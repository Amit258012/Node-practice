const path = require("path");
const express = require("express");
const morgan = require("morgan"); // HTTP request logger middleware
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Set security HTTP headers
app.use(helmet());

// Chapter: Middleware
// url notaion
// "/api/v1/tours/:page/:optional?"

// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
	max: 100, // 100 requests / hr
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Notes:- Middle ware => express.json()
// used for parsing incoming requests with JSON payload
// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use(cookieParser());

// serve the static files
app.use(express.static(path.join(__dirname, "public")));

// Notes : Create own Middleware
// It will log for every rout because the route are defined later
// app.use((req, res, next) => {
// 	console.log("Hello from MiddleWare😁");
// 	next();
// });

// Chapter: Routing

app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"script-src 'self' https://unpkg.com https://cdnjs.cloudflare.com blob:; worker-src 'self' blob:;"
	);
	next();
});

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter); //Middleware
app.use("/api/v1/users", userRouter); //Middleware
app.use("/api/v1/reviews", reviewRouter); //Middleware

//  Handle wrong urls
app.all("*", (req, res, next) => {
	next(new AppError(` Can't find ${req.originalUrl} on the server! `, 400));
});

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

// Error handling Middleware
app.use(globalErrorHandler);

module.exports = app;
