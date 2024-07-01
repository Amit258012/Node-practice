const express = require("express");
const {
	getAllTours,
	getTour,
	createTour,
	updateTour,
	aliasTopTours,
	deleteTour,
} = require("../contollers/tourController");
const router = express.Router();

// [ ]: Tour Route Functions

// router.param("id", checkId);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
