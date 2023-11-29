const express = require("express");

const listeningController = require("../controllers/listing.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/create").post(verifyToken, listeningController.createListing);

router
  .route("/delete/:id")
  .delete(verifyToken, listeningController.deleteListing);

router
  .route("/update/:id")
  .post(verifyToken, listeningController.updateListing);

router.route("/get/:id").get(listeningController.getListing);

router.route("/get").get(listeningController.getListings);

module.exports = router;
