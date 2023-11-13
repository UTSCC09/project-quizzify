const mongoose = require("mongoose")

const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"
const FILL_BLANK = "FILL_BLANK"

const QUIZ_TYPES = [SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE, FILL_BLANK]

const QuizSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  private: {
    type: Boolean, 
    required: true, 
    default: false
  },
  questions: {
    type: [{
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
    validate: [(val) => val.length > 0 && val.length <= 6, "Must have minimum one and maximum six questions"]
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
})

QuizSchema.methods = {
  hideQuestionsFromNonOwner: function(authedUserId) { // Remove `questions` field from non-owned quizzes
     var quiz = this.toObject()
     if (quiz.userId !== authedUserId)
         delete quiz.questions
     return quiz
  },

  addQuestion: function(question, responses) {

  },
  updateQuestion: function(questionId, question, responses) {

  },
  deleteQuestion: function(questionId) {
    
  }
}

QuizSchema.statics = {
  create: function(userId, name, private, questions) {
    const quiz = new this({ userId, name, private, questions })
    return quiz.save()
  }
}

const Quiz = mongoose.model("Quiz", QuizSchema)
module.exports = {
  Quiz,
  QUIZ_TYPES
}