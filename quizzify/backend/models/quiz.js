const mongoose = require("mongoose")

const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"

const QUIZ_TYPES = {SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE}

const QuizSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  description: {type: String, default: ""},
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
        enum: Object.keys(QUIZ_TYPES),
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
  hideResponseAnswers: function() { // Remove `questions.responses.isAnswer` field
     var quiz = this.toObject()
     quiz.questions.forEach((question) => {
      question.responses.forEach((response) => {
        delete response.isAnswer
      })
     })
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
  create: function(userId, name, description, private, questions) {
    const quiz = new this({ userId, name, description, private, questions })
    return quiz.save()
  }
}

const Quiz = mongoose.model("Quiz", QuizSchema)
module.exports = {
  Quiz,
  QUIZ_TYPES
}