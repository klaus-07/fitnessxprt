const mongoose = require("mongoose");

const userRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 50,
  },
  userImage: {
    type: String,
    default: null,
  },
  followers: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
  followings: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
  saved: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const ab = userRegisterSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userRegisterSchema);
