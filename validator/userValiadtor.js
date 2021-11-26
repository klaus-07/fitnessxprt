const User = require("../models/userRegister");

const userValidator = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (name && email && password && confirmPassword) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(emailRegex)) {
      if (password === confirmPassword) {
        const emailExist = await User.findOne({ email });
        if (emailExist) {
          return res.status(404).json({
            message: "email does exist",
          });
        } else {
          next();
        }
      } else {
        res.status(404).json({
          success: false,
          message: "confirm password not matching",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "please enter  valid email!!",
      });
    }
  } else if (!name) {
    res.status(404).json({
      success: false,
      message: "name is required",
    });
  } else if (!email) {
    res.status(404).json({
      success: false,
      message: "email is required",
    });
  } else if (!password) {
    res.status(404).json({
      success: false,
      message: "password is required",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "confirm password is required",
    });
  }
};
const loginValidator = async (req, res, next) => {
  const { email, password } = req.body;
  if (email) {
    if (password) {
      next();
    } else {
      res.status(404).json({
        success: false,
        message: "password is required",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "email is required",
    });
  }
};

module.exports = {
  userValidator,
  loginValidator,
};
