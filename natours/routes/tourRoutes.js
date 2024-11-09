const express = require("express");
const {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	aliasTopTours,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
} = require("../controllers/tourController");
const authController = require("../controllers/authController");


const router = express.Router();

// [ ]: Tour Route Functions

// router.param("id", checkId);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
	.route("/")
	.get(authController.protect, getAllTours)
	.post(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		createTour
	);

router
	.route("/:id")
	.get(authController.protect, getTour)
	.patch(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		deleteTour
	);

module.exports = router;
