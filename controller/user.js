const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/userRegister");
const userValidator = require("../validator/userValiadtor");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/services");

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

module.exports = router;
