const express = require("express");
const userController = require("../controller/user.controller");
const router = express.Router();
const validation = require("../validation/index");
const UserSchemaValidation = require("../validation/userSchema");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require('../utils/cloudinary');
const httpStatusCode = require("../utils/httpstatuscode");


const uploadMiddleware = (req, res, next)=>{
  upload.single("profile_image")(req, res, (err)=>{
    if(err){
      return res.status(httpStatusCode.BAD_REQUEST).json({
        stats: false,
        message: err.message
      })
    }
    next()
  })
}

router.post(
  "/register",
  uploadMiddleware,
  validation.validate(UserSchemaValidation.register),
  userController.register,
);

router.post(
  "/login",
  validation.validate(UserSchemaValidation.login),
  userController.login,
);

router.post(
  "/forgot-password/link",
  validation.validate(UserSchemaValidation.forgotPasswordLink),
  userController.forgotPasswordLink,
);
router.post(
  "/forgot-password/:id/:token",
  validation.validate(UserSchemaValidation.forgetPassword),
  userController.forgotPassword,
);
router.post(
  "/verify-email",
  validation.validate(UserSchemaValidation.verifyEmail),
  userController.verify,
);

router.post("/refresh-token",  userController.generaterefreshToken)




router.post("/logout", authMiddleware.verifyToken, userController.logout)

module.exports = router;
