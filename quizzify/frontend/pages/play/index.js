import { useTheme } from "@emotion/react";
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import JoinLobby from "../../components/Game/JoinLobby";
import PlayerPlay from "../../components/Game/PlayerPlay";
import { LoadingPage } from "@/components/LoadingPage";
import { SOCKET_EVENTS } from "@/constants";

var socket;

export default function Play() {    
    const theme = useTheme();
    const [gameCode, setGameCode] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [connected, setConnected] = useState(false)
    const [gameStart, setGameStart] = useState(false)

    // Set the background color when the component mounts
    useEffect(() => {
        const originalBgColor = document.body.style.background;
        document.body.style.background = 'linear-gradient(45deg, #5fffd4, #6e5cec)';
        document.body.style.backgroundSize = '300% 300%'
        document.body.style.animation = 'gradient 10s ease infinite'
        return () => {
            document.body.style.background = originalBgColor;
        };
    }, [theme.colors.brand]);

    useEffect(() => {
        // Create a socket connection
        socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
        setSocketConnected(true)
        
        socket.on(SOCKET_EVENTS.ROOM.start, () => {
            console.log("Host started game!")
            setGameStart(true)
        })
        socket.on(SOCKET_EVENTS.ROOM.end, () => {
            console.log("Host ended game!")
            setGameStart(false)
            setConnected(false)
            setGameCode("")
        })
        
        // Clean up the socket connection on unmount
        return () => { 
            socket.disconnect() 
            setSocketConnected(true)
        }
    }, []);

    return (!socketConnected ? <LoadingPage/> : 
        (gameStart ? 
            <PlayerPlay
                socket={socket} 
                gameCode={gameCode}
            /> 
            : 
            <JoinLobby
                socket={socket}
                gameCode={gameCode}
                setGameCode={setGameCode}
                connected={connected}
                setConnected={setConnected}
            />
        )
    )
}