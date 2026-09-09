const httpStatusCode = require("../utils/httpstatuscode");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcryptjs = require('bcryptjs')

class AuthMidlleware {
  static async verifyToken(req, res, next) {
    try {
      const accessToken = req.headers.authorization;
      // console.log("headers",req.cookies)
      if (!accessToken || !accessToken.split("Bearer ")) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          status: false,
          message: "Token is not provided",
        });
      }
      const cleanToken = accessToken.split(" ")[1];
      const decode = await jwt.verify(
        cleanToken,
        process.env.JWT_ACCESS_SECRET_KEY,
      );
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }
      console.log("user", user)
      req.user = {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        secretKey: user.secretKey,
      };
      next();
    } catch (error) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        status: false,
        message: "Invalid or expire token",
      });
    }
  }

  static roleCheck(...values) {
    return (req, res, next) => {
      console.log("rolecheck done");
      if (!values.includes(req.user.role)) {
        return res.status(httpStatusCode.FORBIDDEN).json({
          status: false,
          message: "Access Denied",
        });
      }
      next();
    };
  }

  static async checkSecretKey(req, res, next) {
    const secretKey = req.headers["x-secret-key"];
    console.log("secretkey", secretKey);
    if (!secretKey) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Secret key is not provided",
      });
    }

   const isMatch = await bcryptjs.compare(secretKey, req.user.secretKey)
    if(!isMatch){
      return res.status(httpStatusCode.FORBIDDEN).json({
        status: false,
        message: "Invalid secret key",
      });

    }

    next();
  }
}
module.exports = AuthMidlleware;
