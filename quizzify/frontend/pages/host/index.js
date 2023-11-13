import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import JoinNavBar from "@/components/JoinNavBar";
import { useAuth0 } from "@auth0/auth0-react";
import { PinInput, Flex, HStack, Text, Button } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

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

        socket.on("room:updatePlayers", (players) => {
            setPlayers(players)
        })

        // Clean up the socket connection on unmount
        return () => { 
            socket.disconnect() 
        }
    }, []);

    useEffect(() => {
        const createNewGame = async () => {
            if (isAuthenticated && socket) {
                socket.emit("host:create", { 
                    userId: user.sub, 
                    quizId: "65515a97355daad172dbd5d0" // TODO: Select quizId
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
    }, [isAuthenticated]);

    const startGame = async () => {
        if (isAuthenticated && gameCode && players.length > 0) {
            socket.emit("host:start", { 
                userId: user.sub, 
                joinCode: gameCode
            }, (response) => {
                if (response.success) { // Created game
                    setQuestion(response.question)
                    console.log("Starting game!", question)
                } else // Failed to create game
                    console.log("Failed to start game!")
            })
        }
    }

    // TODO: Move to another file
    const [question, setQuestion] = useState({})

    return (
        <>
            Game code: {gameCode}

            {gameCode ? <>
                <h1>Players:</h1>
                {players.map(player => <div>- {player.socketId}</div>)}
                <Button onClick={startGame} isDisabled={players.length <= 0}>Start Game</Button>
            </> : null}
            
            {Object.keys(question).length > 0 ? <>
                <h1>Question: {question.question}</h1>
                {/* {players.map(player => <div>- {player.socketId}</div>)} */}
                {/* <Button onClick={nextQuestion}>Next Question</Button> */}
            </> : null}
        </>
    )
}