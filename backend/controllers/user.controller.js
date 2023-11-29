const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Listing = require("../models/listing.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const getUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = appError.create("User not found!", 404, httpStatusText.ERROR);
    return next(error);
  }

  const { password: pass, ...rest } = user._doc;

  res.status(200).json({ status: httpStatusText.SUCCESS, data: { rest } });
});

const updateUser = asyncWrapper(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    const error = appError.create(
      "You can only update your own account!",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }

  if (req.body.password) {
    req.body.password = bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
    },
    { new: true }
  );

  const { password, ...user } = updatedUser._doc;

  res.status(200).json({ status: httpStatusText.SUCCESS, data: { user } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    const error = appError.create(
      "You can only delete your own account!",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }

  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("access_token");
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

const getUserListings = asyncWrapper(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    const listings = await Listing.find({ userRef: req.params.id });
    res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { listings } });
  } else {
    const error = appError.create(
      "You can only view your own listings!",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }
});

module.exports = {
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
};
