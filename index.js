const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const ab = require("./defaultUser");
const app = express();
const userRouter = require("./controller/user");
const blogRouter = require("./controller/blogs");
const nutritionRouter = require("./controller/nutrition");
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/fitnesxprt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    ab();
  })
  .catch((err) => {
    console.log("error:", err);
  });

app.get("/", (req, res, next) => {
  res.end("hello world");
});

// body-parser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/nutrition", nutritionRouter);

// listen to the port 3000
app.listen(process.env.APP_PORT, (err) => {
  if (!err) {
    console.log(`connected to this ${process.env.APP_PORT} port`);
  } else {
    res.end(err);
    console.log(err);
  }
});
