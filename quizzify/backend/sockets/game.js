const Game = require("../models/game");
const { Quiz } = require("../models/quiz");

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
    },
    PLAYER: {
        join: `${eventNamePrefixes.PLAYER}:join`,
        answer: `${eventNamePrefixes.PLAYER}:answer`,
    },
    ROOM: {
        updatePlayers: `${eventNamePrefixes.ROOM}:updatePlayers`,
        start: `${eventNamePrefixes.ROOM}:start`,
        end: `${eventNamePrefixes.ROOM}:end`,
        questionEnd: `${eventNamePrefixes.ROOM}:question-end`,
        questionNext: `${eventNamePrefixes.ROOM}:question-next`,
    }
}
const PLAYER_QUESTION_SEND_DELAY = 1500 // ms

const socketLog = (socket, message, joinCode="") => {
    var socketIdentifier = `id=${socket.id}`
    if (joinCode !== "")
        socketIdentifier = `code=${joinCode}, ` + socketIdentifier
    console.log(`[SOCKET] (${socketIdentifier}): ${message}`)
}

/* ------------------------------------------------------------------------- */
// Utils
const disconnecting = async function (socket, io) {
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
}

/* ------------------------------------------------------------------------- */
// Host
const create = async function (socket, io, payload, callback) {
    const { userId, quizId } = payload
    // TODO: Validate userID
    try {
        if (!await Quiz.findById(quizId))
            throw Error("Quiz ID not found")
        
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
        socketLog(socket, `Host created ${existingGame ? "existing " : "" }game`, game.joinCode)
    } catch (error) {
        console.log(error)
        callback({ success: false })
        socketLog(socket, "Host failed to create game")
    }
}

const start = async function (socket, io, payload, callback) {
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
        socketLog(socket, `Host started game`, joinCode)
        
        setTimeout(() => { // Send first question after 2s
            const quizHiddenAnswers = game.quiz.hideResponseAnswers()
            io.to(joinCode).emit(eventNames.ROOM.questionNext, quizHiddenAnswers.questions[game.currQuestion.index])
        }, PLAYER_QUESTION_SEND_DELAY)
        socketLog(socket, `Host sent first question`, joinCode)

    } catch (error) {
        console.log(error)
        callback({ success: false })
        socketLog(socket, "Host failed to start game", joinCode)
    }
}

const hostNextQuestion = async function (socket, io, callback) {
    try {
        var game = await Game.findOne({
            "host.socketId": socket.id, 
            active: true, 
            end: false
        }).populate("quiz")
        if (!game) 
            throw Error("Game not found")
        
        // End question
        const answerResponses = game.quiz.questions[game.currQuestion.index].responses
            .map((resp, index) => {
                return {
                    response: resp.response,
                    isAnswer: resp.isAnswer,
                    index: index
                }
            })
            .filter(response => response.isAnswer)
        io.to(game.joinCode).emit(eventNames.ROOM.questionEnd, answerResponses)
        io.to(game.joinCode).emit(eventNames.ROOM.updatePlayers, game.players)

        const numQuestions = game.quiz.questions.length
        setTimeout(async () => { // Wait 6s after question end to send next question
            if (numQuestions <= game.currQuestion.index+1) { // No more questions
                game.active = false
                game.end = true
                await game.save()
                callback({ 
                    success: true,
                    gameOver: true 
                })
                io.to(game.joinCode).emit(eventNames.ROOM.end)
                socketLog(socket, `Host sent game over`, game.joinCode)
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
                
                setTimeout(() => { // Send question to player after PLAYER_QUESTION_SEND_DELAY seconds
                    io.to(game.joinCode).emit(eventNames.ROOM.questionNext, quizHiddenAnswers.questions[game.currQuestion.index])
                }, PLAYER_QUESTION_SEND_DELAY)
                
                socketLog(socket, `Host sent next question`, game.joinCode)
            }
        }, 6000)
        io.to(game.joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
    } catch (error) {
        console.log(error)
        callback({ success: false })
        socketLog(socket, "Host failed to send next question")
    }
}

/* ------------------------------------------------------------------------- */
// Player

const join = async function (socket, io, joinCode, displayName, callback) {
    try {
        const game = await Game.findOne({joinCode: joinCode})
        if (!game)
            throw Error("Game not found")
        
        if (game.players.some(player => player.displayName == displayName)) {
            callback({success: false})
            socketLog(socket, "Player failed to join game: display name taken", joinCode)
            return;
        }

        // Update players in game
        socket.join(joinCode)
        if (!game.players.some(player => player.socketId == socket.id)) {
            game.players.push({ socketId: socket.id, displayName: displayName })
            await game.save()
        }
        io.to(joinCode).emit(eventNames.ROOM.updatePlayers, game.players)
        callback({ success: true })
        
        socketLog(socket, "Player connected to game", joinCode)
    } catch (error) {
        console.log(error)
        callback({ success: false })
        socketLog(socket, "Player failed to join game", joinCode)
    }
}

const answer = async function (socket, io, payload, callback) {
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
        responses.forEach((response, index) => {
            const isSelectedResponse = selectedAnswers.includes(index)
            if ((response.isAnswer && isSelectedResponse) || (!response.isAnswer && !isSelectedResponse))
                numCorrect++
        })
    
        // Calculate points (max 100)
        const points = Math.floor(100 * (numCorrect / responses.length))
        game.quiz.questions[game.currQuestion.index].responses
        game.players[playerIndex].points += points

        game.currQuestion.numPlayersAnswered++
        await game.save()

        callback({ success: true })
        socketLog(socket, "Player answered to game", joinCode)
    } catch (error) {
        console.log(error)
        callback({ success: false })
        socketLog(socket, "Player failed to answer", joinCode)
    }
}

/* ------------------------------------------------------------------------- */

module.exports = (io) => {
    // Utils
    const utils = {
        disconnecting: function () { disconnecting(this, io) },
        disconnect: function () { socketLog(this, "Disconnect") }
    }

    // Host
    const host = {
        create: function (payload, callback) { create(this, io, payload, callback) },
        start: function (payload, callback) { start(this, io, payload, callback) },
        nextQuestion:  function (callback) { hostNextQuestion(this, io, callback) },
    }
    
    // Player
    const player = {
        join: function (joinCode, displayName, callback) { join(this, io, joinCode, displayName, callback) },
        answer: function (payload, callback) { answer(this, io, payload, callback) },
    }

    return {
        socketLog,
        eventNames,
        utils,
        host,
        player
    }
}