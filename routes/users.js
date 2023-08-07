const express = require("express");
const router = express();

const { getAllUsers, getUserById } = require('../controllers/users');

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById)


module.exports = router