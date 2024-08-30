const mongoose = require("mongoose");
const validator = require("validator");

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
});

const User = mongoose.model("User", userSchema);
module.exports = User;
