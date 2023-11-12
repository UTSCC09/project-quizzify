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

        socket.on("host:updatePlayers", (players) => {
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
                    quizId: "654ef5432afff2206ac21a99" 
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
                if (response.success) // Created game
                    console.log("Starting game!")
                else // Failed to create game
                    console.log("Failed to start game!")
            })
        }
    }

    return (
        <>
            Game code: {gameCode}
            {gameCode ? <>
                Players: {players.map(player => player.socketId)}
                <Button onClick={startGame} isDisabled={players.length <= 0}>Start Game</Button>
            </> : null}
        </>
    )
}