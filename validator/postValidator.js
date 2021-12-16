const Blogs = require("../models/posts/blogs");
const User = require("../models/userRegister");
const Nutrition = require("../models/posts/nutrition");
const mongoose = require("mongoose");

const blogsValidator = async (req, res, next) => {
  const { blogname, description } = req.body;

  if (!blogname) {
    return res.json({
      success: false,
      message: "please add blogname filed",
    });
  } else if (!description) {
    return res.json({
      success: false,
      message: "please add description filed",
    });
  } else {
    next();
  }
};

const nutritionValidator = async (req, res, next) => {
  const { nutritionname, ingredient, procedure } = req.body;
  if (!nutritionname) {
    return res.json({
      success: false,
      message: "please add nutritionname filed",
    });
  } else if (!ingredient) {
    return res.json({
      success: false,
      message: "please add ingredient filed",
    });
  } else if (!procedure) {
    return res.json({
      success: false,
      message: "please add procedure filed",
    });
  } else {
    next();
  }
};
module.exports = {
  blogsValidator,
  nutritionValidator,
};
