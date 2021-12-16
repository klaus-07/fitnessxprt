const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  posttitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posttype: {
    type: String,
    enum: ["workout", "schedule"],
    required: true,
  },
  weeks: {
    type: Number,
    default: null,
  },
  days: {
    type: Number,
    default: null,
  },
  exercise: [
    {
      name: {
        type: String,
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
