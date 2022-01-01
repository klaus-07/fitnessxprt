const express = require("express");
const router = require("express").Router();
const Exercise = require("../models/posts/exercise");
const User = require("../models/userRegister");
const verifyToken = require("../validator/services");
const mongoose = require("mongoose");

router.get("/get-exercise", verifyToken, async (req, res) => {
  const id = req.body.id;
  try {
    const getExercise = await Exercise.findById(id).populate("user");
    if (!getExercise) {
      return res.status(400).json({
        success: fasle,
        message: "there is no exercise",
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
    const user = req.User.id;
    const getAllExercise = await Exercise.find({ user }).sort({ _id: -1 });
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
    progress: [{ exerciseName }],
    user: req.User.id,
    isCompleted,
  }).save();
  const savedExercise = await Exercise.findById(createExercise._id)
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
    return res.status(200).json({
      success: true,
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

// saved post
router.post("/saved-exercise", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ saved: req.body.id, _id: req.User.id });
    if (user.length > 0) {
      return res.status(500).json({
        success: false,
        message: "you save this posts",
      });
    }
    const save = await User.findByIdAndUpdate(
      req.User.id,
      { $push: { saved: req.body.id } },
      { new: true }
    );
    if (!save) {
      return res.status(400).json({
        success: false,
        message: "this user doesn't not exists",
      });
    }
    res.status(200).json({
      success: true,
      data: save,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// unsaved post
router.post("/unsaved-exercise", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ unsaved: req.body.id, _id: req.User.id });
    const unsave = await User.findByIdAndUpdate(
      req.User.id,
      { $pull: { saved: req.body.id } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: unsave,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/following-exercise", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.User.id });
    const followingUser = user.followings;
    const followingExercise = followingUser.map((element) => {
      return mongoose.Types.ObjectId(element);
    });
    const exercise = await Exercise.find({
      user: { $in: followingExercise },
    })
      .populate("user")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
