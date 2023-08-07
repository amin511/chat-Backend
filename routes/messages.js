const express = require('express');
const { getAllmessages, sendMessage } = require('../controllers/messages');
const router = express.Router();

router.route("/get").post(getAllmessages)
router.route("/").post(sendMessage)


module.exports = router