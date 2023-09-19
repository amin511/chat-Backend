const express = require('express')
const router = express.Router()
const { login, register } = require("../controllers/auth")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../upload"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.filename + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });



router.post("/login", login)
router.post("/register", upload.single('userImage'), register)

module.exports = router
