const express = require('express')
const router = express.Router()
const { login, register } = require("../controllers/auth")
const multer = require('multer')
const path = require('path')


const storage = new multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", login)
router.post("/register", upload.single('userImage'), register)

module.exports = router
