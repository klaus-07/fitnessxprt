const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/userRegister");
const userValidator = require("../validator/userValiadtor");
const jwt = require("jsonwebtoken");
const verifyToken = require("../validator/services");

router.get("/get-user", async (req, res, next) => {
  try {
    const id = req.body.id;

    const ab = await User.findById(id);
    res.json(ab);
    console.log(ab);
  } catch (err) {
    res.status(200).json("no user is here");
  }
});

router.get("/get-all-user", async (req, res, next) => {
  const getAllUser = await User.find({});
  res.status(202).json(getAllUser);
});

router.post("/register", userValidator.userValidator, async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // create a new user
  const user = await new User({
    name,
    email,
    password: hashPassword,
  });
  // save the filed
  try {
    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      savedUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err,
    });
  }
});

router.post("/login", userValidator.loginValidator, async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {
      const access_token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "25d",
        }
      );
      res.json({
        success: true,
        user,
        access_token,
      });
    } else {
      res.json({
        success: false,
        message: "password not matching",
      });
    }
  } else {
    res.json({
      success: false,
      message: "you are not registerd please sign up",
    });
  }
});

router.post("/update-user", async (req, res, next) => {
  const user = await req.body;
  User.updateOne({ _id: req.body.id }, user)
    .then(() => {
      res.status(202).json({
        success: true,
        message: user,
      });
    })
    .catch(() => {
      res.status(404).json({
        success: false,
        message: "please correct this ID",
      });
    });
});
router.post("/delete-user", async (req, res) => {
  const id = req.body.id;
  const deleteUser = await User.findByIdAndDelete(id, (err, docs) => {
    if (docs) {
      res.status(202).json({
        success: true,
        message: docs,
      });
    } else {
      res.status(404).json({
        success: false,
        message: (err, "Id is incorrect"),
      });
    }
  });
});

// follow user
router.post("/:id/follow", verifyToken, async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (!user.followers.includes(req.body.id)) {
        await user.updateOne({ $push: { followers: req.body.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({
          success: true,
          message: "user has been followed",
        });
      } else {
        res.status(403).json({
          success: false,
          message: "you already followed this user",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({
      success: false,
      message: "you  follow yourself",
    });
  }
});

// unfollow user
router.post("/:id/unfollow", verifyToken, async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (user.followers.includes(req.body.id)) {
        await user.updateOne({ $pull: { followers: req.body.id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({
          success: true,
          message: "user has been Unfollowed",
        });
      } else {
        res.status(403).json({
          success: false,
          message: `you don't follow this user`,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({
      success: false,
      message: "you  unfollow yourself",
    });
  }
});

module.exports = router;
