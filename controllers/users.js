const { BadRequestError } = require("../errors");
const User = require("../models/User")


const getAllUsers = async (req, res) => {
    User.createIndexes({ _id: 1 })
    const { userID } = req.user
    const Users = await User.find({ _id: { $not: { $eq: userID } } }).select("-password");
    // const Users = await User.deleteMany({})
    res.status(200).json(Users);
}

const getUserById = async (req, res) => {
    const { id: userId } = req.params;
    console.log("find by id");
    if (!userId) {
        throw new BadRequestError("provide userId");
    }

    const user = await User.findOne({ _id: userId }).select("-password");
    res.status(200).json(user);
}


module.exports = { getAllUsers, getUserById }