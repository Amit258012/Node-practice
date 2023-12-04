const express = require("express");
const {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
} = require("../contollers/tourController");
const router = express.Router();

// [ ]: Tour Route Functions
router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;