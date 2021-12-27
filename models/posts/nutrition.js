const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types;
const nutritionSchema = new mongoose.Schema(
  {
    nutritionname: {
      type: String,
      required: true,
    },
    ingredient: {
      type: Array,
      required: true,
    },
    procedure: {
      type: Array,
      required: true,
    },
    nutritionImage: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);
