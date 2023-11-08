import CustomPinInput from "@/components/CustomPinInput";
import JoinNavBar from "@/components/JoinNavBar";
import { PinInput, Flex, HStack, Text } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from 'react';

export default function Join() {    
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

    const handleChange = (value) => {
        setGameCode(value)
    }

    const handleComplete = (gameCode) => {
        // call api, move to game if coorect
        console.log(gameCode)
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