const express = require("express");
const router = require("express").Router();
const Nutrition = require("../models/posts/nutrition");
const User = require("../models/userRegister");
const postValidator = require("../validator/postValidator");
const verifyToken = require("../validator/services");

router.post(
  "/create-nutrition",
  postValidator.nutritionValidator,
  verifyToken,
  async (req, res) => {
    const { user, nutritionname, ingredient, procedure } = req.body;
    const nutrition = await new Nutrition({
      user,
      nutritionname,
      ingredient,
      procedure,
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
        res.status(400).json(err);
      });
  }
);

module.exports = router;
