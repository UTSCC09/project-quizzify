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
        nextQuestion: `${eventNamePrefixes.ROOM}:nextQuestion`,
    }
}