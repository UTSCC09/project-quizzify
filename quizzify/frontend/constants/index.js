// Quiz constants
const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"
const FILL_BLANK = "FILL_BLANK"

export const QUIZ_TYPES = {SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE, FILL_BLANK}

export const PUBLIC = "PUBLIC"
export const PRIVATE = "PRIVATE"

// Socket events
const eventNamePrefixes = {
    UTILS: "utils",
    HOST: "host",
    PLAYER: "player",
    ROOM: "room",
}
export const SOCKET_EVENTS = {
    UTILS: {
        disconnecting: "disconnecting",
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
    },
    ROOM: {
        updatePlayers: `${eventNamePrefixes.ROOM}:updatePlayers`,
        start: `${eventNamePrefixes.ROOM}:start`,
        end: `${eventNamePrefixes.ROOM}:end`,
    }
}