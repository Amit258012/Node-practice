const express = require("express");
const {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	checkId,
} = require("../contollers/tourController");
const router = express.Router();

// [ ]: Tour Route Functions

router.param("id", checkId);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
