const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  nutritionname: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  procedure: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Nutrition", nutritionSchema);
