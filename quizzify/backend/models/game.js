const mongoose = require("mongoose")
const { Quiz } = require("./quiz")

const GameSchema = new mongoose.Schema({
  joinCode: {type: String, required: true, index: true, unique: true},
  active: {type: Boolean, required: true, default: false},
  end: {type: Boolean, required: true, default: false},
  host: {
    userId: {type: String, required: true, index: true},
    socketId: {type: String, required: true},
  },
  quiz: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Quiz"},
  currQuestion: {
    index: {type: Number, required: true, default: 0},
    numPlayersAnswered: {type: Number, required: true, default: 0},
  },
  players: [{
    socketId: {type: String, required: true},
    displayName: {type: String, required: false},
    points: {type: Number, required: true, default: 0},
    currQuestionPoints: {type: Number, required: true, default: 0}, // points received for the current question
  }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
})

GameSchema.methods = {
}

GameSchema.statics = {
  create: async function(socketId, userId, quizId) {
    if (!await Quiz.findById(quizId))
      throw Error(`Quiz ${quizId} does not exist`)

    const joinCode = Math.random().toString(36).slice(2,8) // 6 digit alphanumeric
    const game = new this({ 
      joinCode: joinCode, 
      host: {
        userId: userId, 
        socketId: socketId, 
      },
      quiz: quizId,
      players: [],
    })
    return game.save()
  }
}

module.exports = mongoose.model("Game", GameSchema)