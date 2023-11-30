const mongoose = require("mongoose")

const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"

const QUIZ_TYPES = {SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE}

const DEFAULT = "DEFAULT"
const RAPID_FIRE = "RAPID_FIRE"
const LAST_MAN = "LAST_MAN"

const QUIZ_MODES = {DEFAULT, RAPID_FIRE, LAST_MAN}

// in seconds
const RAPID = 5
const SHORT = 10
const MEDIUM = 25
const LONG = 90
const QUIZ_TIMERS = {RAPID, SHORT, MEDIUM, LONG}

const QuizSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  description: {type: String, default: ""},
  defaultTimer: {
    type: Number, 
    required: true,
    // enum: Object.keys(QUIZ_TIMERS), // user can set to any time
    default: MEDIUM
  },
  mode: {
    type: String, 
    required: true, 
    enum: Object.keys(QUIZ_MODES),
    default: DEFAULT
  },
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
  create: function(userId, name, description, private, questions, defaultTimer, mode) {
    const quiz = new this({ userId, name, description, private, questions, defaultTimer, mode })
    return quiz.save()
  }
}

QuizSchema.pre('save', function(next) {
  // If the mode is set to RAPID_FIRE, set the defaultTimer to RAPID
  if (this.mode === RAPID_FIRE) {
    this.defaultTimer = RAPID;
  }
  next();
});

const Quiz = mongoose.model("Quiz", QuizSchema)
module.exports = {
  Quiz,
  QUIZ_TYPES
}