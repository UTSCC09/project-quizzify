const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
  name: {type: String, required: true},
  questions: [{
    question: {type: String, required: true},
    type: {type: String, required: true}, // idk if we do indices or string
    responses: [{
      response: {type: String, required: true},
      isAnswer: {type: Boolean, required: true}
    }],
    img: {
      data: Buffer,
      contentType: String
    }
  }],
  private: {type: Boolean, required: true}
})

module.exports = mongoose.model("Quiz", quizSchema)