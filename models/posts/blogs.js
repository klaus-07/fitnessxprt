const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    blogImage: {
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

module.exports = mongoose.model("Blogs", blogSchema);
