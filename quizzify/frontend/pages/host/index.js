import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import JoinNavBar from "@/components/JoinNavBar";
import { useAuth0 } from "@auth0/auth0-react";
import { PinInput, Flex, HStack, Text, Button, MenuItem, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

import * as USER_API from "@/api/users";
import { SOCKET_EVENTS } from "@/constants";

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
                    quizId: selectedQuizId // "655178c500eefa1cf8c1c5b9" // TODO: Select quizId
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
                joinCode: gameCode
            }, (response) => {
                if (response.success) { // Created game
                    setQuestion(response.question)
                    setQuestionStart(true)
                    console.log("Starting game!", question)
                } else // Failed to create game
                    console.log("Failed to start game!")
            })
        }
    }

    // TODO: Move to another file
    // Source: https://stackoverflow.com/a/62110789
    const [question, setQuestion] = useState({})
    const [questionStart, setQuestionStart] = useState(false)
    const [gameEnd, setGameEnd] = useState(false)
    const TIMER_DEFAULT_SECONDS = 20+3 // TODO: Short/medium/long (+3 for 2s loading time for players)
    const [timerSeconds, setTimerSeconds] = useState(TIMER_DEFAULT_SECONDS)
    const startQuestion = (question) => {
        setQuestion(question)
        setQuestionStart(true)
        setTimerSeconds(TIMER_DEFAULT_SECONDS)
    }
    const intervalRef = useRef()
    useEffect(() => {
        if (questionStart) {
            const tick = () => setTimerSeconds(t => Math.max(t-1, 0));
            intervalRef.current = setInterval(tick, 1000)
        } else {
            clearInterval(intervalRef.current)
        }
        
        return () => clearInterval(intervalRef.current)
    }, [questionStart])
    useEffect(() => {
        if (timerSeconds === 0) {
            clearInterval(intervalRef.current);
            setQuestionStart(false);
            socket.emit(SOCKET_EVENTS.HOST.nextQuestion, (response) => {
                if (response.success) {
                    if (response.gameOver) { // No more questions
                        console.log("No more questions")
                        setQuestionStart(false)
                        setGameEnd(true)
                    } else { // Next question
                        console.log("Updated next question")
                        startQuestion(response.question)
                    }
                } else // Failed to create game
                    console.log("Failed to get next quesiton!")
          })
          console.log("Timer expired; next question");
        }
    }, [timerSeconds]);
    
    const sortPlayersByScore = (a, b) => { b.score - a.score }

    return (
        <>
            <Menu>
                <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                    Click to select quiz
                </MenuButton>
                <MenuList
                    bg={'white'}
                    borderColor={'gray.200'}>
                    {quizzes.map(quiz => <MenuItem onClick={() => setSelectedQuizId(quiz._id)}>{quiz.name}</MenuItem>)}
                </MenuList>
            </Menu>

            <div>Game code: {gameCode}</div>

            {gameCode ? <>
                <h1>Players:</h1>
                {players.map(player => 
                    <div>
                        - {player.socketId} ({player.points} points)
                    </div>
                    )}
                <Button onClick={startGame} isDisabled={players.length <= 0}>Start Game</Button>
            </> : null}
            
            {Object.keys(question).length > 0 ? <>
                <h1>Question: {question.question}</h1>
                {question.responses.map(response => <div>- {response.response}</div>)}
                
                {!gameEnd ? <h2>Timer: {timerSeconds} seconds left</h2> :
                    <>
                        <h2>Game over!</h2>
                        <div>{players[0]?.socketId} won with {players[0]?.points} points</div>
                    </>
                 }
            </> : null}
        </>
    )
}