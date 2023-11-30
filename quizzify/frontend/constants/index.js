// Quiz constants
const SINGLE_CHOICE = "SINGLE_CHOICE"
const MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
const TRUE_OR_FALSE= "TRUE_OR_FALSE"

export const QUIZ_TYPES = {SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE}

export const PUBLIC = "PUBLIC"
export const PRIVATE = "PRIVATE"

const DEFAULT = "DEFAULT"
const RAPID_FIRE = "RAPID_FIRE"
const LAST_MAN = "LAST_MAN"

export const QUIZ_MODES = {
    DEFAULT:{
        FE: "Classic ⭐",
        BE: DEFAULT
    }, 
    RAPID_FIRE: {
        FE: "Last Man Standing 🧍‍♂️",
        BE: RAPID_FIRE
    }, 
    LAST_MAN: {
        FE: "Rapid fire 🔥",
        BE: LAST_MAN
    }, 
}

export function convertBEtoFEMode(beMode) {
    for (const mode in QUIZ_MODES) {
        if (QUIZ_MODES[mode].BE === beMode) {
            return QUIZ_MODES[mode].FE;
        }
    }
    return "Unknown mode"; // Return this if the mode is not found
}

// in seconds
const RAPID = 5
const SHORT = 10
const MEDIUM = 25
const LONG = 90
export const QUIZ_TIMERS = {RAPID, SHORT, MEDIUM, LONG}

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
        questionEnd: `${eventNamePrefixes.ROOM}:question-end`,
        questionNext: `${eventNamePrefixes.ROOM}:question-next`,
    }
}