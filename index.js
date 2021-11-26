const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const ab = require("./defaultUser");
const app = express();
const userRouter = require("./controller/user");

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/user", userRouter);

// listen to the port 3000
app.listen(process.env.APP_PORT, (err) => {
  if (!err) {
    console.log(`connected to this ${process.env.APP_PORT} port`);
  } else {
    res.end(err);
    console.log(err);
  }
});
