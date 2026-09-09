const express = require("express");
const userRequestController = require("../controller/userRequest.controller");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


router.get(
  "/admin/writer-request",
  authMiddleware.verifyToken,
  authMiddleware.roleCheck("admin"),
  userRequestController.getAllPendingRequest,
);
router.put(
  "/admin/manageRequest/:id",
  authMiddleware.verifyToken,
  authMiddleware.roleCheck("admin"),
  userRequestController.manageWriterRequest,
);

router.get("/user/profile", authMiddleware.verifyToken, userRequestController.getProfile)

router.post(
  "/user/writer-request",
  authMiddleware.verifyToken,
  authMiddleware.roleCheck("user"),
  userRequestController.userRequest,
);


module.exports = router