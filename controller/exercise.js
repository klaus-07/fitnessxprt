const express = require("express");
const router = require("express").Router();
const Exercise = require("../models/posts/exercise");
const User = require("../models/userRegister");
const verifyToken = require("../validator/services");

router.get("/get-exercise", verifyToken, async (req, res) => {
  const id = req.body.id;
  try {
    const getExercise = await Exercise.findById(id).populate("user");
    if (!getExercise) {
      return res.status(400).json({
        success: fasle,
        message: "this post must be invalid",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: getExercise,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "this post not available",
    });
  }
});

router.get("/get-all-exercise", verifyToken, async (req, res) => {
  try {
    const getAllExercise = await Exercise.find();
    res.status(200).json({
      success: true,
      data: getAllExercise,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "something is wrong",
    });
  }
});

router.post("/create-exercise", verifyToken, async (req, res) => {
  const {
    posttitle,
    description,
    exercise,
    exerciseName,
    sets,
    reps,
    isCompleted,
  } = req.body;

  const createExercise = await new Exercise({
    posttitle,
    description,
    exercise: [
      {
        exerciseName,
        sets,
        reps,
      },
    ],
    progress: [{ exerciseName, sets: 0, reps: 0 }],
    user: req.User.id,
    isCompleted,
  }).save();
  const savedExercise = await Exercise.findById(createExercise._id)

    // const setsPerform = savedExercise.exercise;
    // for (let i = 0; i < setsPerform.length; i++) {
    //   let obj = setsPerform[i];
    //   // console.log("obj:", obj);
    // }

    // const setscount = savedExercise.exercise[0].reps;
    // console.log(setscount);

    // const len = setscount.length - 1;
    // console.log(setscount.at(len));

    // const store = setss.at(len);
    .populate("user")
    .then((result) => {
      res.status(202).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    });
});

router.post("/update-exercise", verifyToken, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.body.exerciseId,
      "progress.exerciseName": req.body.exerciseName,
    });

    if (!exercise) console.log("exercise not found!");

    if (exercise.exercise[0].sets <= exercise.progress[0].sets)
      return res.status(400).json({
        success: false,
        message: "sets limit reached!",
        // data: exercise,
      });

    const update = await Exercise.findOneAndUpdate(
      {
        _id: req.body.exerciseId,
        "progress.exerciseName": req.body.exerciseName,
      },
      {
        $inc: { "progress.$.sets": 1 },
      }
    ); //linting

    res.status(200).json({
      success: true,
      message: "The sets updated!",
      data: update,
    });
  } catch (error) {
    console.log("err : update-exercise : ", error);

    res.status(500).json({
      success: false,
      message: "internal-error",
      error: error,
    });
  }
});

router.post("/delete-exercise", verifyToken, async (req, res) => {
  const id = req.body.id;
  try {
    const deleteExercise = await Exercise.findByIdAndDelete(id).populate(
      "user"
    );
    if (!deleteExercise) {
      return res.status(404).json({
        success: false,
        message: "please add proper id",
      });
    }
    return res.status(202).json({
      success: false,
      message: "delete this post",
      data: deleteExercise,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "something went wrong",
    });
  }
});

module.exports = router;
