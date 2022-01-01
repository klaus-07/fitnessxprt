const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/userRegister");
const userValidator = require("../validator/userValiadtor");
const jwt = require("jsonwebtoken");
const verifyToken = require("../validator/services");
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.get("/get-default-user", verifyToken, async (req, res) => {
  const user = await User.find({}).limit(10);
  if (!user) return res.json("error accureed");
  res.json({
    success: true,
    data: user,
  });
});

router.get("/get-user", verifyToken, async (req, res, next) => {
  try {
    const id = req.User.id;

    const ab = await User.findById(id);
    res.json(ab);
  } catch (err) {
    res.status(200).json("no user is here");
  }
});

router.get("/get-all-user", async (req, res, next) => {
  const getAllUser = await User.find({}).select("-password");
  res.status(202).json(getAllUser);
});

router.post("/register", userValidator.userValidator, async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // hash password
  if (password.length >= 4) {
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
        data: savedUser,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        err,
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "password must be 4 character",
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
        {
          id: user._id,
          followers: user.followers,
          followings: user.followings,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "250d",
        }
      );
      let userResponse = user.toObject();
      delete userResponse.password;
      res.json({
        success: true,
        data: userResponse,
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

router.post("/update-user", verifyToken, async (req, res, next) => {
  // const user = await req.body;
  const { name, email, password } = req.body;
  // const ab = delete req.User.password;
  // console.log(ab);
  const id = req.User.id;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, password: hashedPassword },
    { new: true }
  )
    .select("-password")
    .then((result) => {
      res.status(200).json({
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
router.post("/delete-user", verifyToken, async (req, res) => {
  const id = req.User.id;
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
router.post(
  "/upload-image",
  upload.single("image"),
  verifyToken,
  async (req, res) => {
    const id = req.User.id;
    console.log;

    const userImage = `localhost:5000/${req.file.path}`;
    const options = { new: true };
    const updateImage = await User.findByIdAndUpdate(id, { userImage }, options)
      .then((result) => {
        res.status(202).json({
          success: true,
          message: result,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      });
  }
);

router.post("/follow", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ _id: req.body.id, followers: req.User.id });
    if (user.length > 0) {
      return res.status(500).json({
        success: false,
        message: "you already followed this user",
      });
    }
    const userFollow = await User.findByIdAndUpdate(
      req.body.id,
      { $push: { followers: req.User.id } },
      { new: true }
    );

    const userfollowing = await User.findByIdAndUpdate(
      req.User.id,
      { $push: { followings: req.body.id } },
      { new: true }
    );
    res.json({
      success: true,
      data: { userFollow, userfollowing },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//unfollow user
router.post("/unfollow", verifyToken, async (req, res) => {
  const userFollow = await User.findByIdAndUpdate(
    req.body.id,
    { $pull: { followers: req.User.id } },
    { new: true }
  );

  const userfollowing = await User.findByIdAndUpdate(
    req.User.id,
    { $pull: { followings: req.body.id } },
    { new: true }
  );
  res.json({
    success: true,
    data: { userFollow, userfollowing },
  });
});

module.exports = router;
