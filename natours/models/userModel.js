const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name,email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide your name"],
	},

	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowerCase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
		trim: true,
	},

	photo: String,
	role: {
		type: String,
		enum: ["user", "admin", "guide", "lead-guide"],
		default: "user",
	},

	password: {
		type: String,
		required: [true, "Please provide your password"],
		minlength: 8,
		select: false,
	},

	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			// this only works on CREATE and SAVE
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same",
		},
	},
	passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
	// only run this function if password was actually modified
	if (!this.isModified("password")) return next();

	// hash the password in asyncronus version
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm first
	this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	// this == current doc
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}
	// not changed
	return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
