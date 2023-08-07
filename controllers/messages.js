const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const Message = require("../models/messages")

const getAllmessages = async (req, res) => {
    const { userID } = req.user
    const { userIdRoom } = req.body;

    if (!userIdRoom) {
        throw new BadRequestError("please provide the usersId")
    }
    const messages = await Message.find({
        $or: [{ senderId: userID, reciverId: userIdRoom }, { senderId: userIdRoom, reciverId: userID }]
    }
    ).sort("createdAt");
    res.status(StatusCodes.OK).json({ messages })
}

const sendMessage = async (req, res) => {
    const { userID } = req.user
    const { userIdRoom, content } = req.body;

    if (!userIdRoom) {
        throw new BadRequestError("please provide the usersId")
    }
    const message = await Message.create({
        senderId: userID,
        reciverId: userIdRoom,
        content: content
    })

    res.status(StatusCodes.CREATED).json({
        sucsess: true,
        message
    })
}


module.exports = { getAllmessages, sendMessage }

// first user 