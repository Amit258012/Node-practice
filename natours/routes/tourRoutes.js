const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// Post /tour/:tourId/reviews
// Get /tour/:tourId/reviews
// Get /tour/:tourId/reviews/:reviewId

// router
// 	.route("/:tourId/reviews")
// 	.post(
// 		authController.protect,
// 		authController.restrictTo("user"),
// 		reviewController.createReview
// 	);

// [ ]: Tour Route Functions

// router.param("id", checkId);

router.use("/:tourId/reviews", reviewRouter);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
	.route("/top-5-cheap")
	.get(tourController.aliasTopTours, tourController.getAllTours);

router
	.route("/")
	.get(authController.protect, tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		tourController.createTour
	);

router
	.route("/:id")
	.get(authController.protect, tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		tourController.updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		tourController.deleteTour
	);

module.exports = router;
