const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const categoryRouter = require("../router/category.router");
const blogRouter = require("../router/blog.router");
const userRequestRouter = require("../router/userRequest.router");

router.use("/api/auth", authRouter);
router.use("/api", blogRouter);
router.use("/api", categoryRouter);
router.use("/api", userRequestRouter);

module.exports = router;
