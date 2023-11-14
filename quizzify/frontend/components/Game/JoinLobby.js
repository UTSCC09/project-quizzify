import CustomPinInput from "@/components/CustomPinInput";
import JoinNavBar from "@/components/JoinNavBar";
import { SOCKET_EVENTS } from "@/constants";
import { PinInput, Flex, HStack, Text } from "@chakra-ui/react";

export default function JoinLobby({
    socket,
    gameCode,
    setGameCode,
    connected,
    setConnected,
}) {
    const handleChange = (value) => {
        setGameCode(value.toLowerCase())
    }

    const handleComplete = (gameCode) => {
        if (!socket)
            console.log("Socket not connected")
        else if (connected)
            console.log("Already connected to a game")
        else {
            // Call WebSocket; move to waiting screen if correct code
            socket.emit(SOCKET_EVENTS.PLAYER.join, gameCode.toLowerCase(), (response) => {
                if (response.success) { // Joined game
                    setConnected(true)
                    console.log("Successfully joined game")
                } else { // Failed to join game
                    setConnected(false)
                    console.log("Failed to join game")
                }
            })
        }
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
                    {!connected ? <>
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
                    </> : <>
                        <Text color={'background.400'} fontSize={'md'}>Connected to {gameCode}</Text>
                        <Text color={'background.400'} fontSize={'md'}>Waiting for host to start...</Text>
                    </>}
                </Flex>
            </Flex>
        </>
    )
}