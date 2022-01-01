const express = require("express");
const router = require("express").Router();
const Blogs = require("../models/posts/blogs");
const User = require("../models/userRegister");
const postValidator = require("../validator/postValidator");
const verifyToken = require("../validator/services");
const multer = require("multer");
const mongoose = require("mongoose");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.get("/get-blog", verifyToken, async (req, res) => {
  const id = req.body.id;
  const getBlog = await Blogs.findById(id).populate("user");
  res.status(202).json({
    success: true,
    message: getBlog,
  });
});
router.get("/get-all-blog", verifyToken, async (req, res) => {
  try {
    const user = req.User.id;
    const getAllBlog = await Blogs.find({ user })
      .populate("user")
      .sort({ createdAt: -1 });
    if (!getAllBlog) {
      res.status(404).json({
        success: false,
        message: "blog data not found",
      });
    }
    res.status(202).json({
      success: true,
      data: getAllBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post(
  "/create-blog",
  upload.single("image"),
  verifyToken,
  postValidator.blogsValidator,
  async (req, res, next) => {
    console.log(req.file);
    const { blogname, description } = req.body;
    const blogimage = `localhost:5000/${req.file.path}`;
    const blog = await new Blogs({
      blogname,
      description,
      blogimage,
      user: req.User.id,
    }).save();
    const savedData = await Blogs.findById(blog._id)
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
  "/update-blog",

  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const { blogname, description } = req.body;
    const blogimage = `localhost:5000/${req.files.path}`;
    const option = { new: true };
    const updateBlogs = await Blogs.findByIdAndUpdate(
      req.body.id,
      { blogname, description, blogimage },
      option
    )
      .populate("user")

      .then((result) => {
        res.status(202).json({
          success: true,
          message: result,
        });
      })
      .catch(() => {
        res.status(404).json({
          success: false,
          message: "please correct this ID",
        });
      });
    console.log(updateBlogs);
  }
);
router.post("/delete-blog", verifyToken, async (req, res) => {
  const id = req.body.id;
  const deleteBlog = await Blogs.findByIdAndDelete(id, (err, docs) => {
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
  }).populate("user");
});

router.get("/following-blog", verifyToken, async (req, res) => {
  try {
    const userId = req.User.id;
    const user = await User.findOne({ _id: userId });
    const followingUser = user.followings;
    const response = followingUser.map((element) =>
      mongoose.Types.ObjectId(element)
    );
    const blog = await Blogs.find({ user: { $in: response } })
      .populate("user")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.log(error, ":error");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// saved post
router.post("/saved-blog", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ saved: req.body.id, _id: req.User.id });
    if (user.length > 0) {
      return res.status(500).json({
        success: false,
        message: "you save  this user",
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
        message: "this user doee's not exists",
      });
    }
    res.status(200).json({
      success: true,
      message: save,
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
router.post("/unsaved-blog", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ unsaved: req.body.id, _id: req.User.id });
    const unsave = await User.findByIdAndUpdate(
      req.User.id,
      { $pull: { unsaved: req.body.id } },
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

module.exports = router;
