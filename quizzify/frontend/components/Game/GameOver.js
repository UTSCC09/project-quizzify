import { Container, Flex, Text, useTheme } from "@chakra-ui/react";
import { useEffect } from "react";


export default function GameOver() {
    const theme = useTheme();

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

    return (
        <>
            <Container w={'600px'}>
                <Flex flexDirection={'column'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
                    <Text color={'background.400'} fontSize={'md'}>You have ran out of tries. Continue spectating through the host screen!</Text>
                </Flex>
            </Container>
        </>
    )
}