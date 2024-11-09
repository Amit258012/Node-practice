const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
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
	createSendToken(newUser, 201, res);
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
	createSendToken(user, 200, res);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError("There is no user with email address", 404));
	}

	// 2) Generate the random token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) Save token and send it via email
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new Password and password confirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!. `;

	try {
		await sendEmail({
			email: user.email,
			subject: "Your password reset token (valid for 10 min)",
			message,
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				"There was an error sending the email. Try Again Later!",
				500
			)
		);
	}

	res.status(200).json({
		status: "success",
		message: "Token sent to email!",
	});
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	// console.log(hashedToken, user);

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get User from the collection
	const user = await User.findById(req.user.id).select("+password");

	// 2) Check if posted current password is correct
	if (
		!(await user.correctPassword(req.body.passwordCurrent, user.password))
	) {
		return next(new AppError("Your current password is wrong", 401));
	}

	// 3) If so, update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	// 4) Log user in, send JWT
	createSendToken(user, 200, res);
});
