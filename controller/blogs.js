const express = require("express");
const router = require("express").Router();
const Blogs = require("../models/posts/blogs");
const User = require("../models/userRegister");
const postValidator = require("../validator/postValidator");
const verifyToken = require("../validator/services");

router.get("/get-blog", verifyToken, async (req, res) => {
  const id = req.body.id;
  const getBlog = await Blogs.findById(id).populate("user");
  res.json(getBlog);
});
router.get("/get-all-blog", verifyToken, async (req, res) => {
  const getAllBlog = await Blogs.find({}).populate("user");
  res.status(202).json(getAllBlog);
});

router.post(
  "/create-blog",
  verifyToken,
  postValidator.blogsValidator,
  async (req, res, next) => {
    const { blogname, description, user } = req.body;

    const blog = await new Blogs({
      blogname,
      description,
      user,
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

router.post("/update-blog", verifyToken, async (req, res) => {
  const blog = await req.body;
  const updateBlogs = await Blogs.findByIdAndUpdate({ _id: req.body.id }, blog)
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
});
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

module.exports = router;
