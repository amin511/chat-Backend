const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const auth = async (req, res, next) => {
  // check header

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("authentication invalid")
  }

  const token = authHeader.split(" ")[1]

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (!payload) {
    throw new UnauthenticatedError("authentication invalid")
  }

  req.user = {
    userID: payload.userId,
    name: payload.name
  }
  next();

}

module.exports = auth
