const Game = require("../models/game");

const eventNamePrefixes = {
    UTILS: "utils",
    HOST: "host",
    PLAYER: "player",
    ROOM: "room",
}
const eventNames = {
    UTILS: {
        disconnecting: "disconnecting",
        disconnect: "disconnect",
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
    },
    ROOM: {
        updatePlayers: `${eventNamePrefixes.ROOM}:updatePlayers`,
        start: `${eventNamePrefixes.ROOM}:start`,
        end: `${eventNamePrefixes.ROOM}:end`,
        nextQuestion: `${eventNamePrefixes.ROOM}:nextQuestion`,
    }
}
const PLAYER_QUESTION_SEND_DELAY = 2000 // 2s

const socketLog = (socket, message, joinCode="") => {
    var socketIdentifier = `id=${socket.id}`
    if (joinCode !== "")
        socketIdentifier = `code=${joinCode}, ` + socketIdentifier
    console.log(`[SOCKET] (${socketIdentifier}): ${message}`)
}

module.exports = (io) => {
    // Utils
    const utils = {
        disconnecting: function () {
            const socket = this
            socket.rooms.forEach(async (joinCode) => {
                const game = await Game.findOne({joinCode: joinCode})
                if (game) {
                    try { 
                        if (!game.active) { // Only end/leave when game not started
                            if (game.host.socketId == socket.id) { // Host (end game)
                                await Game.deleteOne({joinCode: joinCode})
                                io.to(joinCode).emit(eventNames.ROOM.end)
                                socketLog(socket, "Host ended game", joinCode)
                            } else { // Player (leave game)
                                game.players = game.players.filter(player => player.socketId !== socket.id)
                                await game.save()
                                io.to(joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
                                socketLog(socket, "Player left game", joinCode)
                            }
                        }
                    } catch (error) {
                        console.log(error)
                        socketLog(socket, "Failed to end/leave game")
                    }
                }
            })
        },
        disconnect: async function () {
            const socket = this
            socketLog(socket, "Disconnect")
        }
    }

    // Host
    const host = {
        create: async function (payload, callback) {
            const socket = this
            const { userId, quizId } = payload
            // TODO: Validate IDs
            try {
                const existingGame = await Game.findOne({
                    "host.userId": userId, 
                    quiz: {_id: quizId}, 
                    active: false,
                    end: false
                })
                const game = (existingGame ?? await Game.create(socket.id, userId, quizId))
                if (!game) 
                    throw Error("Game not found")
                
                if (existingGame) { // Clear previously connected players
                    game.players = []
                    await game.save()
                    io.to(game.joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
                }

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
                var game = await Game.findOne({
                    "host.userId": userId, 
                    joinCode: joinCode, 
                    active: false,
                    end: false
                }).populate("quiz")
                if (!game) 
                    throw Error("Game not found")
                
                game.active = true
                await game.save()
                io.to(joinCode).emit(eventNames.ROOM.start)
                callback({ 
                    success: true,
                    question: game.quiz.questions[game.currQuestion.index] 
                })
                socketLog(this, `Host started game`, joinCode)
                
                setTimeout(() => { // Send first question after 5s
                    const quizHiddenAnswers = game.quiz.hideResponseAnswers()
                    io.to(joinCode).emit(eventNames.ROOM.nextQuestion, quizHiddenAnswers.questions[game.currQuestion.index])
                }, PLAYER_QUESTION_SEND_DELAY)
                socketLog(this, `Host sent first question`, joinCode)

            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Host failed to start game", joinCode)
            }
        },
        nextQuestion: async function (callback) {
            const socket = this
            try {
                var game = await Game.findOne({
                    "host.socketId": socket.id, 
                    active: true, 
                    end: false
                }).populate("quiz")
                if (!game) 
                    throw Error("Game not found")
                
                const numQuestions = game.quiz.questions.length
                if (numQuestions <= game.currQuestion.index+1) { // No more questions
                    game.active = false
                    game.end = true
                    await game.save()
                    callback({ 
                        success: true,
                        gameOver: true 
                    })
                    io.to(game.joinCode).emit(eventNames.ROOM.end)
                    socketLog(this, `Host sent game over`, game.joinCode)
                } else { // Send next question
                    game.currQuestion.index++
                    game.currQuestion.numPlayersAnswered = 0
                    await game.save()
                    
                    const quizHiddenAnswers = game.quiz.hideResponseAnswers()
                    callback({ 
                        success: true,
                        question: quizHiddenAnswers.questions[game.currQuestion.index],
                        gameOver: false
                    })
                    setTimeout(() => { // Send next question after 2s
                        io.to(game.joinCode).emit(eventNames.ROOM.nextQuestion, quizHiddenAnswers.questions[game.currQuestion.index])
                    }, PLAYER_QUESTION_SEND_DELAY)
                    socketLog(this, `Host sent next question`, game.joinCode)
                }
                io.to(game.joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Host failed to send next question")
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
                    throw Error("Game not found")
                
                // Update players in game
                socket.join(joinCode)
                if (!game.players.some(player => player.socketId == socket.id)) {
                    game.players.push({ socketId: socket.id })
                    await game.save()
                }
                io.to(joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
                callback({ success: true })

                socketLog(socket, "Player connected to game", joinCode)
            } catch (error) {
                console.log(error)
                callback({ success: false })
                socketLog(this, "Player failed to join game", joinCode)
            }
        },
        answer: async function (payload) {
            const socket = this
            const { joinCode, selectedAnswers } = payload
            try {
                var game = await Game.findOne({
                    joinCode: joinCode, 
                    active: true, 
                    end: false
                }).populate("quiz")
                if (!game)
                    throw Error("Game not found")
                
                var playerIndex = game.players.findIndex(player => player.socketId == socket.id)
                if (playerIndex == -1)
                    throw Error("Player not found in game")
                
                const responses = game.quiz.questions[game.currQuestion.index].responses
                let numCorrect = 0
                const totalNumAnswers = responses.filter(response => response.isAnswer).length
                selectedAnswers.forEach(selectedIndex => {
                    if (responses[selectedIndex].isAnswer)
                        numCorrect++
                })
            
                // Calculate points (max 100)
                const points = Math.floor(100 * (numCorrect / totalNumAnswers))
                game.quiz.questions[game.currQuestion.index].responses
                game.players[playerIndex].points += points

                game.currQuestion.numPlayersAnswered++
                await game.save()

                socketLog(socket, "Player answered to game", joinCode)

                // TODO: If all players answered, call nextQuestion()
            } catch (error) {
                console.log(error)
                // callback({ success: false })
                socketLog(this, "Player failed to answer", joinCode)
            }
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