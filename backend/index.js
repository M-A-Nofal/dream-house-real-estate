require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("node:path");

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

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRouter);

const __dirName = path.resolve();
const staticPath = path.join(__dirName, "/frontend/dist");

app.use(express.static(staticPath));

app.get("*", (req, res) => {
  const indexPath = path.join(__dirName, "frontend", "dist", "index.html");
  res.sendFile(indexPath);
});

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
