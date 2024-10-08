const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role,
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError("Please provide email and password!", 400));
	}

	// 2) Check if user exist and pasword is correct
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect Email or Password", 401));
	}

	// 3) If everthing is Ok, send jwt token
	const token = signToken(user._id);
	res.status(200).json({
		status: "success",
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;

	// 1) Getting token and check if it's there
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next(
			new AppError(
				"You are not logged in! Please login to get access",
				401
			)
		);
	}

	// 2) verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const fresh = await User.findById(decoded.id);
	if (!fresh) {
		return next(
			new AppError(
				"The user belonging to this token does not exist.",
				401
			)
		);
	}

	// 4) Check if user changed password after the token was issued
	if (fresh.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				"User recently changed password! Please log in again.",
				401
			)
		);
	}

	// Grant access to protected route
	req.user = fresh;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					"you dont not have permission to perform this action",
					403
				)
			);
		}
		next();
	};
};
