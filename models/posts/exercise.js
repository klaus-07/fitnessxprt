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
  exercise: [
    {
      exerciseName: {
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
  progress: [
    {
      exerciseName: { type: String, required: true },
      sets: { type: Number, default: 0 },
      reps: { type: Number, default: 0 },
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
