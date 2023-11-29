const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const generateJWT = require("../utils/generateJWT");

const signup = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create(
      "User is already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const signin = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) {
    const error = appError.create("User not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  const validPassword = await bcrypt.compare(password, validUser.password);
  if (!validPassword) {
    const error = appError.create(
      "Wrong credentials!",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const token = await generateJWT({
    id: validUser._id,
    email: validUser.email,
  });

  const { password: pass, ...user } = validUser._doc;

  res.cookie("access_token", token, { httpOnly: true }).status(200).json({
    status: httpStatusText.SUCCESS,
    data: { user },
  });
});

const google = asyncWrapper(async (req, res, next) => {
  const googleUser = await User.findOne({ email: req.body.email });
  if (googleUser) {
    const token = await generateJWT({
      id: googleUser._id,
      email: googleUser.email,
    });

    const { password: pass, ...user } = googleUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: httpStatusText.SUCCESS,
      data: { user },
    });
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();

    const token = await generateJWT({
      id: newUser._id,
      email: newUser.email,
    });

    const { password: pass, ...user } = newUser._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      status: httpStatusText.SUCCESS,
      data: { user },
    });
  }
});

const signOut = asyncWrapper(async (req, res, next) => {
  res.clearCookie("access_token");
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  signup,
  signin,
  google,
  signOut,
};
