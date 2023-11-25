
const { BadRequestError, UnauthenticatedError } = require("../errors/index")
const bcrypt = require('bcryptjs');
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const path = require("path")
const fs = require("fs")
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'dh8hvr4i9',
    api_key: '314417351436837',
    api_secret: 'PlinDJvd0juqrOwXC9dgkvt-CPc',
    secure: true,
});






const register = async (req, res) => {


    console.log(req.file);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const { email, name, password } = req.body
    if (!email || !name || !password) {
        throw new BadRequestError("Please provide email password name")
    }

    const result = await cloudinary.uploader.upload(dataURI)
    const newUser = await User.create({ ...req.body, userImage: result.url })
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




