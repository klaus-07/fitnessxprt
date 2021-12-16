const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types;
const nutritionSchema = new mongoose.Schema(
  {
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
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);
