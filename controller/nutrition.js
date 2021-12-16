const express = require("express");
const mongoose = require("mongoose");

const router = require("express").Router();
const Nutrition = require("../models/posts/nutrition");
const User = require("../models/userRegister");
const postValidator = require("../validator/postValidator");
const verifyToken = require("../validator/services");

router.get("/get-nutrition", verifyToken, async (req, res) => {
  const id = req.body.id;
  const getNutrition = await Nutrition.findById(id).populate("user");
  res.status(202).json({
    success: true,
    message: getNutrition,
  });
});

router.get("/get-all-nutrition", verifyToken, async (req, res) => {
  const getAllNutrition = await Nutrition.find({ user: req.User.id })
    .populate("user")
    .sort({ createdAt: -1 });
  res.status(202).json({
    success: true,
    result: getAllNutrition.length,
    message: getAllNutrition,
  });
});

router.post(
  "/create-nutrition",
  postValidator.nutritionValidator,
  verifyToken,
  async (req, res, next) => {
    const { nutritionname, ingredient, procedure } = req.body;
    const nutrition = await new Nutrition({
      nutritionname,
      ingredient,
      procedure,
      user: req.User.id,
    }).save();
    const savedData = await Nutrition.findById(nutrition._id)
      .populate("user")
      .then((result) => {
        res.status(202).json({
          success: true,
          message: result,
        });
      })
      .catch((err) => {
        res.status(501).json({
          success: false,
          message: err,
        });
      });
  }
);

router.post("/update-nutrition", verifyToken, async (req, res) => {
  const nutritionId = req.body.id;
  const nutrition = await req.body;
  const option = { new: true };
  const updateNutrition = await Nutrition.findByIdAndUpdate(
    nutritionId,
    nutrition,
    option
  )
    .populate("user")
    .then((result) => {
      res.status(202).json({
        success: true,
        message: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: "this filed did not update",
      });
    });
});

router.post("/delete-nutrition", verifyToken, async (req, res) => {
  const id = req.body.id;
  const deleteNutrition = await Nutrition.findByIdAndDelete(id, (err, data) => {
    if (data) {
      res.status(200).json({
        success: true,
        message: data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  }).populate("user");
});

// following data
router.get("/following-nutrition", verifyToken, async (req, res) => {
  // const posts = await Nutrition.find({
  //   user: { $in: [...req.User.followings, req.User.id] },
  // }).populate("user");
  // console.log(posts);
  // res.json(posts);
  const ab = req.User;
  console.log("ab:", ab);

  // const currentUser = await User.findById(req.User.id);
  const nutrition = await Nutrition.find(
    {
      user: { $in: req.User.followings },
    },
    (err, docs) => {
      if (err) {
        res.status(404).json({ err });
      } else {
        res.json({
          success: true,
          data: docs,
        });
      }
    }
  )
    .populate("user")
    .sort({ createdAt: -1 });
});
// saved post
router.post("/saved-nutrition", verifyToken, async (req, res) => {
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
router.post("/unsaved-nutrition", verifyToken, async (req, res) => {
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

router.get("/get-following-nutrition", verifyToken, async (req, res) => {
  // let nutritionArray = [];
  try {
    const currentUser = await User.findById(req.User.id);
    const userNutrition = await Nutrition.find({ user: currentUser.id });
    // console.log(userNutrition);
    const followingNutrition = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Nutrition.find({ user: followingId }).populate("user");
      })
    );

    res.json(userNutrition.concat(...followingNutrition));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
