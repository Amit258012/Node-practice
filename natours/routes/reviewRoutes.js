const reviewController = require("../controllers/reviewController");
const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

// Post /tour/:tourId/reviews/
// Get /tour/:tourId/reviews
// Get /tour/:tourId/reviews/:reviewId
router
	.route("/") // "/tour/:tourId/reviews" +  "/" (merge params)
	.get(reviewController.getAllReviews)
	.post(
		authController.protect,
		authController.restrictTo("user"),
		reviewController.setTourUserIds,
		reviewController.createReview
	);

router
	.route("/:id")
	.get(reviewController.getReview)
	.patch(reviewController.updateReview)
	.delete(reviewController.deleteReview);

module.exports = router;