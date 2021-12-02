const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blogname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Blogs", blogSchema);
