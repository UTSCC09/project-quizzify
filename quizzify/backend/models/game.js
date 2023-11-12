const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
  joinCode: {type: String, required: true, index: true, unique: true},
  active: {type: Boolean, required: true, default: false},
  hostId: {type: String, required: true, index: true},
  quizId: {type: String, required: true, index: true},
  currQuestion: {
    index: {type: Number, required: true, default: 0},
    numPlayersAnswered: {type: Number, required: true, default: 0},
    active: {type: Number, required: true, default: 0},
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
})

GameSchema.methods = {
}

GameSchema.statics = {
  create: function(userId, quizId) {
    const joinCode = Math.random().toString(36).slice(2,8) // 6 digit alphanumeric
    const game = new this({ 
      joinCode: joinCode, 
      hostId: userId, 
      quizId: quizId,
    })
    return game.save()
  }
}

module.exports = mongoose.model("Game", GameSchema)