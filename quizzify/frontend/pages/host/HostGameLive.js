import { Button, MenuItem, Menu, MenuButton, MenuList, Text, Grid, GridItem, Flex, Box, IconButton } from "@chakra-ui/react";

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
        <>
            <h1>Question: {question.question}</h1>
            {question.responses.map((resp, i) => <Box key={i}>- {resp.response}</Box>)}

            {questionLive ?
                <>
                    <h2>Timer: {timerSeconds} seconds left</h2>
                    <Button onClick={toggleTimer}>Toggle Timer</Button>
                    <Button onClick={() => { endTimer(); moveNextQuestion(); }}>End Timer</Button>
                </>
                :
                <>
                    <h1>Answers:</h1>
                    {answerResponses.map((resp, i) => <Box key={i}>- {resp.response}</Box>)}
                </>
            }
        </>
    )
}