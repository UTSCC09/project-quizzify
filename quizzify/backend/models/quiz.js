const mongoose = require("mongoose")

const QuizSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  private: {type: Boolean, required: true},
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
})


QuizSchema.statics = {
  create: function(userId, name, private, questions) {
    const quiz = new this({ userId, name, private, questions })
    return quiz.save()
  }
}

module.exports = mongoose.model("Quiz", QuizSchema)