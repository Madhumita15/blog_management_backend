const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const likeController = require('../controller/like.controller')

router.post("/like", authMiddleware.verifyToken, authMiddleware.roleCheck("user"), likeController.createLikeUnlike)
router.get("/like", authMiddleware.verifyToken, authMiddleware.roleCheck("user"), likeController.getMyLike)

module.exports = router