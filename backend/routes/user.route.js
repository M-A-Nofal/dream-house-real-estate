const express = require("express");

const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/:id").get(verifyToken, userController.getUser);

router.route("/update/:id").post(verifyToken, userController.updateUser);

router.route("/delete/:id").delete(verifyToken, userController.deleteUser);

router.route("/listings/:id").get(verifyToken, userController.getUserListings);

module.exports = router;
