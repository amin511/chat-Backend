const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require("path")
// Function to convert an image file to Base64
function imageToBase64(imagePath) {
  try {
    // Read the image file as a Buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the Buffer to a Base64 string
    const imageBase64 = imageBuffer.toString('base64');

    return imageBase64;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
}

// Example usage
const imagePath = path.join(__dirname, "user.png"); // Replace with the actual path to your image file
const UserImage = "https://i.stack.imgur.com/l60Hf.png";





const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  userImage: {
    type: String,
  }
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LYFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
