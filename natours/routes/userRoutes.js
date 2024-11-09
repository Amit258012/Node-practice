const express = require("express");
const {
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/forgotPassword", authController.forgotPassword);
router.patch(
	"/updateMyPassword/",
	authController.protect,
	authController.updatePassword
);

router
	.route("/")
	.get(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		getAllUsers
	)
	.post(createUser);

router
	.route("/:id")
	.get(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		getUser
	)
	.patch(authController.protect, updateUser)
	.delete(authController.protect, deleteUser);

module.exports = router;
