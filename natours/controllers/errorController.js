const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(".\n")}`;
	return new AppError(err.message, 400);
};

const handleJWTError = () => {
	return new AppError("Invalid token. Please log-in again.", 401);
};

const handleJWTExpiredError = () => {
	return new AppError("Your token has expired. Please log-in again.", 401);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// Internal Server Error (Programming error)
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV == "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV == "production") {
		if (err.name == "CastError") {
			err = handleCastErrorDB(err);
		} else if (err.code == 11000) {
			err = handleDuplicateFieldsDB(err);
		} else if (err.name == "ValidationError") {
			err = handleValidationErrorDB(err);
		} else if (err.name == "JsonWebTokenError") {
			err = handleJWTError();
		} else if (err.name == "TokenExpiredError") {
			err = handleJWTExpiredError();
		}
		sendErrorProd(err, res);
	}
};
