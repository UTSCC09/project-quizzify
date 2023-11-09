const mongoose = require("mongoose")
const Quiz = require("./quiz")

const userSchema = new mongoose.Schema({
  displayName: {type: String, required: true},
  avatar: {
    data: Buffer,
    contentType: String
  },
  quizzes: {type: [Quiz.schema], required: true, index: true} // reference
})


module.exports = mongoose.model("User", userSchema)
