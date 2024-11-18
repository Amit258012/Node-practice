const reviewController = require("../controllers/reviewController");
const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

// Post /tour/:tourId/reviews/
// Get /tour/:tourId/reviews
// Get /tour/:tourId/reviews/:reviewId

router.use(authController.protect);

router
	.route("/") // "/tour/:tourId/reviews" +  "/" (merge params)
	.get(reviewController.getAllReviews)
	.post(
		authController.restrictTo("user"),
		reviewController.setTourUserIds,
		reviewController.createReview
	);

router
	.route("/:id")
	.get(reviewController.getReview)
	.patch(
		authController.restrictTo("user", "admin"),
		reviewController.updateReview
	)
	.delete(
		authController.restrictTo("user", "admin"),
		reviewController.deleteReview
	);

module.exports = router;
