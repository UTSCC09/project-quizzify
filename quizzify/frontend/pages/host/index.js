import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import JoinNavBar from "@/components/JoinNavBar";
import { useAuth0 } from "@auth0/auth0-react";
import { PinInput, Flex, HStack, Text } from "@chakra-ui/react";
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

    useEffect(() => {
        // Create a socket connection
        socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

        const createNewGame = async () => {
            if (isAuthenticated) {
                socket.emit("host:create", { 
                    userId: user.sub, 
                    quizId: "654ef5432afff2206ac21a99" 
                }, (response) => {
                    if (response.success) // Created game
                        setGameCode(response.joinCode)
                    else // Failed to create game
                        console.log("Failed to create game!")
                })
            }
        }
        createNewGame()
        
        // Clean up the socket connection on unmount
        return () => { 
            socket.disconnect() 
        }
    }, [isAuthenticated]);

    return (
        <>
            Game code: {gameCode}
        </>
    )
}