import CustomIconButton from "@/components/Buttons/CustomIconButton";
import HGQuizButton from "@/components/Buttons/HostGame/HGQuizButton";
import { CloseIcon } from "@chakra-ui/icons";
import { Button, Grid, Flex, Box, Progress } from "@chakra-ui/react";

export default function HostGameLive({
    question,
    questionLive,
    timerSeconds,
    toggleTimer,
    endTimer,
    moveNextQuestion,
    answerResponses
}) {
    return (
        <Flex flexDirection={'column'} padding={8}>
            <Flex gap={4} alignItems={'center'} justifyContent={'center'}>
                <CustomIconButton color={'secondary.400'} icon={<CloseIcon />} href='/' isExternal={false}/>
                <Progress w={'100%'} borderRadius={'full'} height={4} value={(timerSeconds/28)*100} colorScheme={'brand'} bgColor={'#d8dbe2'}/>
            </Flex>
            <h1>{question?.question}</h1>
            <Grid
                marginTop={5}
                h={'400px'}
                w={'600px'}
                gridGap={'25px'}
                templateColumns='repeat(2, 1fr)'>
                {question?.responses.map((resp, i) => (
                    <HGQuizButton key={i} response={resp} answerResponses={answerResponses} />
                ))}
            </Grid>

            {questionLive &&
                <Box>
                    <h2>Timer: {Math.ceil(timerSeconds)} seconds left</h2>
                    <Button onClick={toggleTimer}>Toggle Timer</Button>
                    <Button onClick={() => { endTimer(); moveNextQuestion(); }}>End Timer</Button>
                </Box>
            }
        </Flex>
    )
}