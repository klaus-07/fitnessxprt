const Blogs = require("../models/posts/blogs");
const User = require("../models/userRegister");
const Nutrition = require("../models/posts/nutrition");
const mongoose = require("mongoose");

const blogsValidator = async (req, res, next) => {
  const { blogname, description, user } = req.body;
  if (mongoose.Types.ObjectId.isValid(user)) {
    const exists = await User.findById(user);
    if (!exists) {
      res.status(400).json({
        success: false,
        message: "user id is not proper",
      });
    } else {
      next();
    }
  } else {
    res.status(403).json({
      success: false,
      message: "user id is not defined",
      data: null,
    });
  }
};

const nutritionValidator = async (req, res, next) => {
  const { user, nutritionname, ingredient, procedure } = req.body;
  if (mongoose.Types.ObjectId.isValid(user)) {
    const exists = await User.findById(user);
    if (!exists) {
      res.status(400).json({
        success: false,
        message: "user id is not proper",
      });
    } else {
      next();
    }
  } else {
    res.status(403).json({
      success: false,
      message: "user id is not defined",
      data: null,
    });
  }
};

module.exports = {
  blogsValidator,
  nutritionValidator,
};
