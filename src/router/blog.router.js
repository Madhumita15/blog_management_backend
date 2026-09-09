const express = require("express");
const router = express.Router();
const blogController = require("../controller/blog.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/cloudinary");
const httpStatusCode = require("../utils/httpstatuscode");
const blogSchemaValidation = require("../validation/blogSchema");
const validation = require("../validation/index");

const uploadMiddleware = (req, res, next) => {
  upload.single("blog_image")(req, res, (err) => {
    console.log("req file1",req.file)
    console.log("req file2",req.body)
    if (err) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        status: false,
        message: err.message,
      });
    }
   console.log("req file3",req.body)
   
    next();
  });
};

const uploadOnlyForPost = (req, res, next) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return next();
  }
  uploadMiddleware(req, res, next);
};

const ValidateBlogPostOnlyPost = (req, res, next) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return next();
  }
  validation.validate(blogSchemaValidation.blogCreation)(req, res, next);
};

router.all(
  "/blogs{/:id}",
  authMiddleware.verifyToken,
  authMiddleware.roleCheck("admin", "writer"),
  authMiddleware.checkSecretKey,
  uploadOnlyForPost,
  ValidateBlogPostOnlyPost,
  blogController.blogOperation,
);
router.get("/blog", blogController.blogOperation);
router.get("/blog/:id", blogController.blogOperation);

module.exports = router;
