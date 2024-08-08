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
			trim: true,
			maxlength: [
				40,
				"A tour name must have less or equal then 40 charecter",
			],
			minlength: [
				10,
				"A tour name must have more or equal then 10 charecter",
			],
		},
		slug: String,
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
			enum: {
				values: ["easy", "medium", "hard"],
				message: "Difficult must be either easy, medium, hard",
			},
		},
		ratingAvarage: {
			type: Number,
			default: 4.5,
			min: [1, "min rating must be 1.0"],
			max: [5, "max rating must be below 5.0"],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val) {
					// this only points to current doc on NEW Document Creation
					return val < this.price;
				},
				message:
					"Discount price ({VALUE}) must be less then regular price",
			},
		},
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
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//  If you can easliy derive tthen dont store use virtual, you cannot use in query because we are not storing the virtual data just returning it

tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// Document Middleware
// It runs before .save() and .create()
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
// tourSchema.post("save", function (doc, next) {
// 	console.log(doc);
// 	next();
// });

//  Query Middleware
// all string start with find => apply for find and findOne
// this points to query
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});
tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	next();
});

// Aggregation Middleware
// this points to current aggregation object
tourSchema.pre("aggregate", function (next) {
	this.pipeline().unshift({
		$match: { secretTour: { $ne: true } },
	});
	next();
});

// create model using schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
