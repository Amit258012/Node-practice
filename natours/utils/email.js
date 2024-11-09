const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");

const sendEmail = catchAsync(async (options) => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,

		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
		// Activate in gmail "less secure app" option
	});

	// 2) Define the email options
	const mailOptions = {
		from: "Amit <hello@amit.io>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// 3) Actually send the email
	await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
