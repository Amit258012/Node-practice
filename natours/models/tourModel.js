const mongoose = require("mongoose");
const slugify = require("slugify");
// Mongoose Model
// tour model (blue print)
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A tour must have a name"],
			unique: true,
		},
		duration: {
			type: Number,
			required: [true, "A tour must have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A tour must have a group size"],
		},
		difficulty: {
			type: String,
			required: [true, "A tour must have a difficulty"],
		},
		ratingAvarage: {
			type: Number,
			default: 4.5,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: Number,
		summary: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, "A tour must have a cover image"],
		},
		images: {
			type: [String],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: {
			type: [Date],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// Document Middleware
// It runs before save and create cmd
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
// tourSchema.post("save", function (doc, next) {
// 	console.log(doc);
// 	next();
// });

// create model using schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
