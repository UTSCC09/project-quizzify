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

const socketLog = (socket, message) => {
    console.log(`[SOCKET] (id=${socket.id}): ${message}`)
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
                const existingGame = await Game.findOne({hostId: userId, quizId: quizId, active: false})
                const game = existingGame ?? await Game.create(userId, quizId)
                if (!game) 
                    throw Error
                
                socket.join(game.joinCode)
                callback({ joinCode: game.joinCode })
                socketLog(this, `Host created ${existingGame == game ? "existing " : "" }game ${game.joinCode}`)
            } catch (error) {
                callback({ success: false })
                socketLog(this, "Host failed to create game")
            }
        },
        start: function (payload) {

        },
        nextQuestion: function (payload) {

        },
        questionTimerExpired: function () {

        },
    }
    
    // Player
    const player = {
        join: async function (gameCode, callback) {
            const socket = this
            try {
                const foundGame = await Game.exists({joinCode: gameCode})
                if (!foundGame)
                    throw Error
                
                socket.join(gameCode)
                callback({ success: true })
                socketLog(socket, `Player connected to game ${gameCode}`)
                // TODO: Update players in game
            } catch (error) {
                callback({ success: false })
                socketLog(this, `Player failed to join game ${gameCode}`)
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