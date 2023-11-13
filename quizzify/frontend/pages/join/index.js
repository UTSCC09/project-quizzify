import CustomPinInput from "@/components/CustomPinInput";
import JoinNavBar from "@/components/JoinNavBar";
import { PinInput, Flex, HStack, Text } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

var socket;

export default function Join() {    
    const router = useRouter()
    const theme = useTheme();
    const [gameCode, setGameCode] = useState("")

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

        socket.on("room:start", () => {
            console.log("Host started game!")
            router.push("/play")
        })
        socket.on("room:end", () => {
            console.log("Host ended game!")
            setGameCode("")
        })

        // Clean up the socket connection on unmount
        return () => { 
            socket.disconnect() 
        }
    }, []);

    const handleChange = (value) => {
        setGameCode(value)
    }

    const handleComplete = (gameCode) => {
        // Call api, move to game if coorect
        socket.emit("player:join", gameCode, (response) => {
            if (response.success) { // Joined game
                console.log("Successfully joined game!")
            } else { // Failed to join game
                console.log("Failed to join game!")
            }
        })
    }

    return (
        <>
            <Flex height={'100vh'} flexDirection={'column'}>
                <JoinNavBar />
                <Flex 
                    height={'100vh'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    gap={4}>
                    <Text color={'background.400'} fontSize={'md'}>Enter the 6 digit Code to join  🎉</Text>
                    <HStack padding={'20px'} borderRadius={'15px'} bg={'#ffffff38'}>
                        <PinInput 
                            type="alphanumeric"
                            autoFocus
                            value={gameCode} 
                            onChange={handleChange} onComplete={handleComplete}
                        >
                            <CustomPinInput />
                            <CustomPinInput />
                            <CustomPinInput />
                            <CustomPinInput />
                            <CustomPinInput />
                            <CustomPinInput />
                        </PinInput>
                    </HStack>
                </Flex>
            </Flex>
        </>
    )
}