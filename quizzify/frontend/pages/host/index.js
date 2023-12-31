import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

import * as USER_API from "@/api/users";
import * as QUIZ_API from "@/api/quizzes";
import { SOCKET_EVENTS, getToast } from "@/constants";
import HostGameWaitingRoom from "./HostGameWaitingRoom";
import HostGameLive from "./HostGameLive";
import { Leaderboard } from "@/components/Leaderboard";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { useToast } from "@chakra-ui/react";

var socket;
const PLAYER_LOADING_TIME = 3;
const DEFAULT_TIMER = 25;

export default function Host() {
    const {
        user,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0();

    const theme = useTheme();
    const [gameCode, setGameCode] = useState("")
    const [quizInfo, setQuizInfo] = useState({})
    const [players, setPlayers] = useState([])
    const toast = useToast();

    useEffect(() => {
        // Create a socket connection
        socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

        socket.on(SOCKET_EVENTS.ROOM.updatePlayers, (players) => {
            setPlayers(players.sort(sortPlayersByScore))
        })
        socket.on(SOCKET_EVENTS.ROOM.questionEnd, (answerResponses) => {
            setQuestionLive(false)
            setAnswerResponses(answerResponses)
        })
        socket.on(SOCKET_EVENTS.ROOM.allPlayersAnswered, () => {
            endTimer()
            moveNextQuestion()
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
                if (response[0].status == 200)
                    setQuizzes(response.length > 1 ? response[1] : [])
                else
                    toast(getToast('Failed to get user quizzes', false))
            }
        }
        getUserQuizzes()
    }, [user, isAuthenticated, getAccessTokenSilently])

    useEffect(() => {
        const getQuiz = async () => {
            if (isAuthenticated){
                const accessToken = await getAccessTokenSilently();
                const response = await QUIZ_API.getQuizById(accessToken, selectedQuizId)
                if (response[0].status == 200 && response.length > 1) {
                    setQuizInfo(response[1])
                    setTimerDefaultSeconds(response[1].defaultTimer + PLAYER_LOADING_TIME || DEFAULT_TIMER + PLAYER_LOADING_TIME);
                } else
                    toast(getToast('Failed to get quiz', false))
            }
        }
        getQuiz()
    }, [selectedQuizId]);

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
                        setPlayers(response.players.sort(sortPlayersByScore))
                    } else // Failed to create game
                        toast(getToast('Failed to create game!', false))
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
                    toast(getToast('Starting game!', true))
                } else // Failed to create game
                    toast(getToast('Failed to start game!', false))
            })
        }
    }

    // TODO: Move to another file
    // Source: https://stackoverflow.com/a/62110789
    const [question, setQuestion] = useState({})
    const [answerResponses, setAnswerResponses] = useState([])
    const [questionLive, setQuestionLive] = useState(false)
    const [gameEnd, setGameEnd] = useState(false)

    // DEFAULT_TIMER + PLAYER_LOADING_TIME for 2s loading time for players
    const [timerDefaultSeconds, setTimerDefaultSeconds] = useState(DEFAULT_TIMER + PLAYER_LOADING_TIME);
    const [timerSeconds, setTimerSeconds] = useState(timerDefaultSeconds)
    const [timerPause, setTimerPause] = useState(false);

    const startQuestion = (question) => {
        setQuestion(question)
        setQuestionLive(true)
        setAnswerResponses([])
        setTimerSeconds(timerDefaultSeconds)
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
                    setTimerPause(false)
                }
            } else // Failed to create game
                toast(getToast('Failed to get next question!', false))
        })
        console.log("Timer expired; next question");
    }

    const intervalTick = () => {
        if (!timerPause) setTimerSeconds(t => Math.max(t - 0.01, 0))
    }

    useEffect(() => {
        setTimerSeconds(timerDefaultSeconds)
    }, [timerDefaultSeconds]);

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

    const sortPlayersByScore = (a, b) => { b.points - a.points }

    return (
        <>
            {!isAuthenticated ? <AuthenticationGuard/> :
                question && Object.keys(question).length === 0 ?
                    <HostGameWaitingRoom
                        quizInfo={quizInfo}
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
                                    socket={socket}
                                    question={question}
                                    questionLive={questionLive}
                                    timerSeconds={timerSeconds}
                                    timerPause={timerPause}
                                    toggleTimer={toggleTimer}
                                    endTimer={endTimer}
                                    moveNextQuestion={moveNextQuestion}
                                    answerResponses={answerResponses}
                                    gameDefaultTimer={timerDefaultSeconds}
                                    players={players}
                                /> : <>
                                    <Leaderboard socket={socket} isOpen={true} onClose={()=>{setQuestion([]);setPlayers([])}} players={players}/>
                                </>
                        }
                    </>
            }
        </>
    )
}