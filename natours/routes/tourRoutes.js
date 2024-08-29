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
const router = express.Router();

// [ ]: Tour Route Functions

// router.param("id", checkId);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
