const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  token = token.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.json("token is not valid");
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "you are not autorized to this portion",
    });
  }
}

module.exports = verifyToken;
