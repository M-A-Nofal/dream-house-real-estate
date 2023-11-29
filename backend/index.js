require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const listingRouter = require("./routes/listing.route");
const httpStatusText = require("./utils/httpStatusText");

const app = express();
const port = process.env.PORT || 3001;
const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("mongoDB server started");
});

// Middleware for parsing request body
app.use(express.json());
app.use(cookieParser());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.use("/api/user", userRoute);

app.use("/api/auth", authRoute);

app.use("/api/listing", listingRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This resourse is not avilable",
    code: 404,
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
