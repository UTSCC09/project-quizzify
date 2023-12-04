import CustomPinInput from "@/components/CustomPinInput";
import LobbyNavBar from "@/components/Game/LobbyNavBar";
import { SOCKET_EVENTS, getToast } from "@/constants";
import { PinInput, Flex, HStack, Text, Input, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const randomDisplayName = () => [
        'Adorable', 'Bouncy', 'Cuddly', 'Dazzling', 'Enchanting',
        'Fluffy', 'Giggly', 'Happy', 'Iridescent', 'Jolly',
        'Kooky', 'Lively', 'Merry', 'Nifty', 'Perky',
        'Quirky', 'Rosy', 'Sunny', 'Twinkly', 'Upbeat'
    ][Math.floor(Math.random() * 20)] + [
        'Snugglepuff', 'Wobblewing', 'Squishytail', 'Nibblekins', 'Fuzzywhisker',
        'Twinkletoes', 'Puddlejumper', 'Whiskerfritz', 'Bumblefluff', 'Sparklebeak',
        'Gigglesnout', 'Puffysnore', 'Jollyhopper', 'Munchkinpaws', 'Twirltail',
        'Fluffernutter', 'Wigglebuns', 'Squeakymuffin', 'Doodlebug', 'Blinkyboo'
    ][Math.floor(Math.random() * 20)]

export default function JoinLobby({
    socket,
    gameCode,
    setGameCode,
    connected,
    setConnected,
}) {

    const [displayName, setDisplayName] = useState(randomDisplayName())
    const handleChange = (value) => {
        setGameCode(value.toLowerCase())
    }

    const toast = useToast();
    const router = useRouter();

    const handleComplete = (gameCode) => {
        if (!socket) {
            toast(getToast('Socket not connected', false))
            router.reload()
        } else if (connected)
            toast(getToast('Already connected to a game', false))
        else if (displayName === '')
            toast(getToast('Invalid display name', false))
        else {
            // Call WebSocket; move to waiting screen if correct code
            socket.emit(SOCKET_EVENTS.PLAYER.join, gameCode.toLowerCase(), displayName, (response) => {
                if (response.success) { // Joined game
                    setConnected(true)
                    toast(getToast('Successfully joined game', true))
                } else { // Failed to join game
                    setConnected(false)
                    toast(getToast('Failed to join game', false))
                }
            })
        }
    }

    return (
        <>
            <Flex height={'100vh'} flexDirection={'column'}>
                <LobbyNavBar text={'Join Game'} />
                <Flex 
                    height={'100vh'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    color={'background.400'}
                    gap={4}>
                    {!connected ? <>
                        <Text fontSize={'md'}>Enter the 6 digit code to join  🎉</Text>
                        <HStack padding={'20px'} borderRadius={'15px'} bg={'#ffffff38'} w={'365px'}>
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
                        <Text fontSize={'md'}>Display name</Text>
                        <Input value={displayName} onChange={(e)=>setDisplayName(e.target.value)}
                            isInvalid={displayName === ''}
                            textAlign={'center'} border={'none'} _hover={{border: 'none'}} 
                            _focusVisible={{borderColor:'none', boxShadow: 'none'}}
                            padding={'20px'} borderRadius={'15px'} bg={'#ffffff38'} w={'365px'}/>
                    </> : <>
                        <Text fontSize={'md'}>Connected to {gameCode.toUpperCase()}</Text>
                        <Text fontSize={'md'}>Waiting for host to start...</Text>
                    </>}
                </Flex>
            </Flex>
        </>
    )
}