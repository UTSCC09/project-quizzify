const Game = require("../models/game");

const eventNamePrefixes = {
    UTILS: "utils",
    HOST: "host",
    PLAYER: "player",
}
const eventNames = {
    UTILS: {
        disconnect: "disconnect",
        getTimer: `${eventNamePrefixes.HOST}:getTimer`,
    },
    HOST: {
        create: `${eventNamePrefixes.HOST}:create`,
        start: `${eventNamePrefixes.HOST}:start`,
        nextQuestion: `${eventNamePrefixes.HOST}:nextQuestion`,
        questionTimerExpired: `${eventNamePrefixes.HOST}:questionTimerExpired`,
    },
    PLAYER: {
        join: `${eventNamePrefixes.PLAYER}:join`,
        answer: `${eventNamePrefixes.PLAYER}:answer`,
        getScore: `${eventNamePrefixes.PLAYER}:getScore`,
    }
}

const socketLog = (socket, message, joinCode="") => {
    var socketIdentifier = `id=${socket.id}`
    if (joinCode !== "")
        socketIdentifier += `, code=${joinCode}`
    console.log(`[SOCKET] (${socketIdentifier}): ${message}`)
}

module.exports = (io) => {
    // Utils
    const utils = {
        disconnect: function () {
            const socket = this
            socketLog(socket, "Disconnect")
            // Handle host & player logic
        },
        getTimer: function () {

        },
    }

    // Host
    const host = {
        create: async function (payload, callback) {
            const socket = this
            const { userId, quizId } = payload
            // TODO: Validate IDs
            try {
                const existingGame = await Game.findOne({
                    hostId: userId, 
                    quiz: {_id: quizId}, 
                    active: false
                })
                const game = (existingGame ?? await Game.create(userId, quizId))
                if (!game) 
                    throw Error

                socket.join(game.joinCode)
                callback({ 
                    success: true,
                    joinCode: game.joinCode,
                    players: game.players
                })
                socketLog(this, `Host created ${existingGame ? "existing " : "" }game`, game.joinCode)
            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Host failed to create game")
            }
        },
        start: async function (payload, callback) {
            const socket = this
            const { userId, joinCode } = payload
            // TODO: Validate userId
            try {
                var game = await Game.findOne({hostId: userId, joinCode: joinCode, active: false}).populate("quiz")
                if (!game) 
                    throw Error
                
                game.active = true
                await game.save()
                io.to(joinCode).emit("host:gameStart")
                callback({ 
                    success: true,
                    question: game.quiz.questions[game.currQuestion.index] 
                })
                socketLog(this, `Host started game`, joinCode)

            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Host failed to start game", joinCode)
            }
        },
        nextQuestion: async function (payload, callback) {
            const socket = this
            const { userId, joinCode } = payload
            try {
                var game = await Game.findOne({hostId: userId, joinCode: joinCode, active: false})
                if (!game) 
                    throw Error
                
                const numQuestions = game.quiz.questions.length
                if (numQuestions <= game.currQuestionIndex+1) { // No more questions
                    callback({ 
                        success: true,
                        gameOver: true 
                    })
                    socketLog(this, `Host sent game over`, joinCode)
                } else { // Send next question
                    game.currQuestion.index++
                    game.currQuestion.numPlayersAnswered = 0
                    await game.save()

                    callback({ 
                        success: true,
                        question: game.quiz.questions[game.currQuestion.index],
                        gameOver: false
                    })
                    socketLog(this, `Host sent next question`, joinCode)
                }
            } catch (error) {
                callback({ success: false })
                socketLog(this, "Host failed to send next question", joinCode)
            }
        },
        questionTimerExpired: function () {

        },
    }
    
    // Player
    const player = {
        join: async function (joinCode, callback) {
            const socket = this
            try {
                const game = await Game.findOne({joinCode: joinCode})
                if (!game)
                    throw Error
                
                // Update players in game
                socket.join(joinCode)
                if (!game.players.some(player => player.socketId == socket.id)) {
                    game.players.push({socketId: socket.id})
                    await game.save()
                }
                io.to(joinCode).emit("host:updatePlayers", game.players)
                callback({ success: true })

                socketLog(socket, "Player connected to game", joinCode)
            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Player failed to join game", joinCode)
            }
        },
        answer: function (payload) {

        },
        getScore: function (payload) {

        },
    }

    return {
        socketLog,
        eventNames,
        utils,
        host,
        player
    }
}