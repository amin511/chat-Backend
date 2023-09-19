
const { BadRequestError, UnauthenticatedError } = require("../errors/index")
const bcrypt = require('bcryptjs');
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const path = require("path")
const fs = require("fs")

const register = async (req, res) => {

    const { email, name, password } = req.body
    console.log(req.file, "req.file")


    if (!email || !name || !password) {
        throw new BadRequestError("Please provide email password name")
    }

    const newUser = await User.create({ ...req.body, userImage: req.file.filename })
    const token = newUser.createJWT()

    res.status(StatusCodes.CREATED).json({
        sucesess: "true", user: {
            token: token,
            userId: newUser._id,
            name: newUser.name,
            email: newUser.email,
            userImage: newUser.userImage
        }
    })

}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("provide email password ")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError("not found user with login with this email , please sign Up")
    }

    const iscorrecPassword = await user.comparePassword(password)
    if (!iscorrecPassword) {
        throw new UnauthenticatedError("the passowrd is invalid")
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({

        user: {
            token,
            name: user.name,
            email: user.email,
            userId: user._id
        }
    })
}

module.exports = { register, login }




