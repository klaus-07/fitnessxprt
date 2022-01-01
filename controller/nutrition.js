const express = require("express");
const mongoose = require("mongoose");

const router = require("express").Router();
const multer = require("multer");
const Nutrition = require("../models/posts/nutrition");
const User = require("../models/userRegister");
const postValidator = require("../validator/postValidator");
const verifyToken = require("../validator/services");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.get("/get-nutrition", verifyToken, async (req, res) => {
  const id = req.body.id;
  const getNutrition = await Nutrition.findById(id).populate("user");
  res.status(202).json({
    success: true,
    message: getNutrition,
  });
});

router.get("/get-all-nutrition", verifyToken, async (req, res) => {
  try {
    const getAllNutrition = await Nutrition.find({ user: req.User.id })
      .populate("user")
      .sort({ createdAt: -1 });
    if (!getAllNutrition) {
      res.status(404).json({
        success: false,
        message: "nutrition data not found",
      });
    }
    res.status(202).json({
      success: true,
      result: getAllNutrition.length,
      message: getAllNutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post(
  "/create-nutrition",
  upload.single("image"),
  postValidator.nutritionValidator,
  verifyToken,
  async (req, res, next) => {
    const { nutritionname, ingredient, procedure } = req.body;
    const nutritionImage = `localhost:5000/${req.file.path}`;
    const nutrition = await new Nutrition({
      nutritionname,
      ingredient,
      procedure,
      nutritionImage,
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

router.post(
  "/update-nutrition",
  upload.single("image"),
  verifyToken,
  async (req, res) => {
    const nutritionId = req.body.id;
    const { nutritionname, ingredient, procedure } = req.body;
    const nutritionImage = `localhost:5000/${req.file.path}`;
    const option = { new: true };
    const updateNutrition = await Nutrition.findByIdAndUpdate(
      nutritionId,
      { nutritionname, ingredient, procedure, nutritionImage },
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
  }
);

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
        message: "this is filed not deleted",
      });
    }
  }).populate("user");
});

// following data
router.get("/following-nutrition", verifyToken, async (req, res) => {
  try {
    const userId = req.User.id;
    const userData = await User.findOne({ _id: userId });

    const userFollowing = userData.followings;
    console.log(userFollowing);
    const response = userFollowing.map((element) =>
      mongoose.Types.ObjectId(element)
    );

    const nutrition = await Nutrition.find({
      user: { $in: response },
    })

      .populate("user")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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

// router.get("/get-following-nutrition", verifyToken, async (req, res) => {
//   // let nutritionArray = [];
//   try {
//     const currentUser = await User.findById(req.User.id);
//     const userNutrition = await Nutrition.find({ user: currentUser.id });
//     // console.log(userNutrition);
//     const followingNutrition = await Promise.all(
//       currentUser.followings.map((followingId) => {
//         return Nutrition.find({ user: followingId }).populate("user");
//       })
//     );

//     res.json(userNutrition.concat(...followingNutrition));
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

module.exports = router;
