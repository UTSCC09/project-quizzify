import { useAuth0 } from "@auth0/auth0-react";
import { Button, MenuItem, Menu, MenuButton, MenuList, Text, Grid, GridItem, Flex, Box, IconButton } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

import * as USER_API from "@/api/users";
import { SOCKET_EVENTS } from "@/constants";
import HostGameWaitingRoom from "./HostGameWaitingRoom";
import HostGameLive from "./HostGameLive";

var socket;

export default function Host() {
    const {
        user,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0();

    const theme = useTheme();
    const [gameCode, setGameCode] = useState("")
    const [players, setPlayers] = useState([])

    useEffect(() => {
        // Create a socket connection
        socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

        socket.on(SOCKET_EVENTS.ROOM.updatePlayers, (players) => {
            setPlayers(players.sort(sortPlayersByScore))
        })
        socket.on(SOCKET_EVENTS.ROOM.questionEnd, (answerResponses) => {
            setQuestionLive(false)
            console.log(answerResponses)
            setAnswerResponses(answerResponses)
        })

        // Clean up the socket connection on unmount
        return () => {
            socket.disconnect()
        }
    }, []);

    // Select Quiz
    const [quizzes, setQuizzes] = useState([])
    const [selectedQuizId, setSelectedQuizId] = useState("")
    useEffect(() => {
        const getUserQuizzes = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const response = await USER_API.getQuizzesByUserId(accessToken, user.sub)
                setQuizzes(response[1])
            }
        }
        getUserQuizzes()
    }, [user, isAuthenticated, getAccessTokenSilently])

    // Create Game
    useEffect(() => {
        const createNewGame = async () => {
            if (isAuthenticated && socket && selectedQuizId) {
                socket.emit(SOCKET_EVENTS.HOST.create, {
                    userId: user.sub,
                    quizId: selectedQuizId
                }, (response) => {
                    if (response.success) {// Created game
                        setGameCode(response.joinCode)
                        setPlayers(response.players)
                    } else // Failed to create game
                        console.log("Failed to create game!")
                })
            }
        }
        createNewGame()
    }, [selectedQuizId, isAuthenticated]);

    const startGame = async () => {
        if (isAuthenticated && gameCode && players.length > 0) {
            socket.emit(SOCKET_EVENTS.HOST.start, {
                userId: user.sub,
                joinCode: gameCode.toLowerCase()
            }, (response) => {
                if (response.success) { // Created game
                    setQuestion(response.question)
                    setQuestionLive(true)
                    console.log("Starting game!")
                } else // Failed to create game
                    console.log("Failed to start game!")
            })
        }
    }

    // TODO: Move to another file
    // Source: https://stackoverflow.com/a/62110789
    const [question, setQuestion] = useState({})
    const [answerResponses, setAnswerResponses] = useState([])
    const [questionLive, setQuestionLive] = useState(false)
    const [gameEnd, setGameEnd] = useState(false)
    const TIMER_DEFAULT_SECONDS = 25 + 3 // TODO: Short/medium/long (+3 for 2s loading time for players)
    const [timerSeconds, setTimerSeconds] = useState(TIMER_DEFAULT_SECONDS)
    const [timerPause, setTimerPause] = useState(false);

    const startQuestion = (question) => {
        setQuestion(question)
        setQuestionLive(true)
        setAnswerResponses([])
        setTimerSeconds(TIMER_DEFAULT_SECONDS)
    }
    const intervalRef = useRef()

    const endTimer = () => clearInterval(intervalRef.current)

    const toggleTimer = () => setTimerPause(!timerPause)

    const moveNextQuestion = () => {
        socket.emit(SOCKET_EVENTS.HOST.nextQuestion, (response) => {
            if (response.success) {
                if (response.gameOver) { // No more questions
                    console.log("No more questions")
                    setQuestionLive(false)
                    setGameEnd(true)
                } else { // Next question
                    console.log("Updated next question")
                    startQuestion(response.question)
                }
            } else // Failed to create game
                console.log("Failed to get next question!")
        })
        console.log("Timer expired; next question");
    }

    const intervalTick = () => {
        if (!timerPause) setTimerSeconds(t => Math.max(t - 0.01, 0))
    }

    useEffect(() => {
        if (questionLive) {
            intervalRef.current = setInterval(intervalTick, 10)
        } else {
            endTimer();
        }

        return () => endTimer();
    }, [timerPause, questionLive])

    useEffect(() => {
        if (timerSeconds === 0) {
            endTimer();
            setQuestionLive(false);
            moveNextQuestion();
        }
    }, [timerSeconds]);

    const sortPlayersByScore = (a, b) => { b.score - a.score }

    return (
        <>
            {
                Object.keys(question).length === 0 ?
                    <HostGameWaitingRoom
                        question={question}
                        selectedQuizId={selectedQuizId}
                        setSelectedQuizId={setSelectedQuizId}
                        quizzes={quizzes}
                        gameCode={gameCode}
                        startGame={startGame}
                        players={players}
                    /> :
                    <>
                        {
                            !gameEnd ? 
                                <HostGameLive
                                    question={question}
                                    questionLive={questionLive}
                                    timerSeconds={timerSeconds}
                                    toggleTimer={toggleTimer}
                                    endTimer={endTimer}
                                    moveNextQuestion={moveNextQuestion}
                                    answerResponses={answerResponses}
                                /> : <>
                                    <h2>Game over!</h2>
                                    <div>{players[0]?.displayName} won with {players[0]?.points} points</div>
                                </>
                        }
                    </>
            }
        </>
    )
}