const express = require("express");

const authController = require("../controllers/auth.controller");
const router = express.Router();

router.route("/signup").post(authController.signup);

router.route("/signin").post(authController.signin);

router.route("/google").post(authController.google);

router.route("/signout").get(authController.signOut);

module.exports = router;
