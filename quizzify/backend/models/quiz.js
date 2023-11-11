const mongoose = require("mongoose")

const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"
const FILL_BLANK = "FILL_BLANK"

QUIZ_TYPES = [SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE, FILL_BLANK]

const QuizSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  private: {
    type: Boolean, 
    required: true, 
    default: false
  },
  questions: [{
    question: {type: String, required: true},
    type: {
      type: String, 
      required: true, 
      enum: QUIZ_TYPES,
      default: SINGLE_CHOICE
    },
    responses: [{
      response: {type: String, required: true},
      isAnswer: {type: Boolean, required: true}
    }],
  }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
})

QuizSchema.statics = {
  create: function(userId, name, private, questions) {
    const quiz = new this({ userId, name, private, questions })
    return quiz.save()
  }
}

module.exports = mongoose.model("Quiz", QuizSchema)