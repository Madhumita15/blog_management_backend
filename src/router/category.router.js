const express = require('express')
const AuthMidlleware = require('../middleware/authMiddleware')
const categoryController = require('../controller/category.controller')
const router = express.Router()

router.get("/category", categoryController.categoryCreation)
router.all("/categories{/:id}", AuthMidlleware.verifyToken, AuthMidlleware.roleCheck("admin"), AuthMidlleware.checkSecretKey, categoryController.categoryCreation)

module.exports = router