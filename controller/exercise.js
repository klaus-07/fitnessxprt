const express = require("express");
const router = require("express").Router();
const Exercise = require("../models/posts/exercise");
const User = require("../models/userRegister");
const verifyToken = require("../validator/services");

router.post("/create-exercise", verifyToken, async (req, res) => {
  const {
    posttitle,
    description,
    posttype,
    weeks,
    days,
    exercise,
    name,
    sets,
    reps,
  } = req.body;
  if (posttype === "workout") {
    const exercise = await new Exercise({
      posttitle,
      description,
      posttype,
      exercise: [
        {
          name,
          sets,
          reps,
        },
      ],
      user: req.User.id,
    });
    exercise
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err.message);
      });
  } else if (posttype === "schedule") {
    const exercise = await new Exercise({
      posttitle,
      description,
      posttype,
      weeks,
      days,
      name,
      sets,
      reps,
      user: req.User.id,
    });
    exercise
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err.message);
      });
  } else {
    res.json("no other filed");
  }
});

module.exports = router;
