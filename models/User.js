const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: {
    require: [true, "must provide senderId"],
    type: ObjectId
  },
  reciverId: {
    require: [true, "must provide reciverId"],
    type: mongoose.Types.ObjectId
  },
  content: {
    type: String,
    required: true
  },

}, { timestamps: true })

module.exports = mongoose.model("Message", MessageSchema)