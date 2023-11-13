import QuizButton from "@/components/Buttons/QuizButton";
import TextButton from "@/components/Buttons/TextButton";
import { QUIZ_TYPES, SOCKET_EVENTS } from "@/constants";
import { SAMPLE_QUIZ } from "@/constants/testingConstants";
import { Box, Container, Flex, Grid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PlayerPlay({
    socket,
    gameCode
}) {
    // following values changes with the state of game:
    // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // TODO: this is just internal logic, will be enforced with api calls
    const [showAns, setShowAns] = useState(false); // TODO: sync with timer
    const [quizReset, setQuizReset] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [actualAnswer, setActualAnswer] = useState([]); // TODO: this is just internal logic, will be enforced with api calls
    
    const onSelect = (selectedResponse, resetSelectCallback) => {
        const { response, index } = selectedResponse
        const maxSelection = 1; // TODO: number depends on the type of quiz
        if (!selectedAnswers.includes(index) && selectedAnswers.length + 1 > maxSelection) return;
        else if (!selectedAnswers.includes(index)) {
            selectedAnswers.push(index)
            setSelectedAnswers(selectedAnswers);
            resetSelectCallback()
        } else {
            setSelectedAnswers(selectedAnswers.filter(e => e !== index))
            resetSelectCallback()
        }
        console.log("Selected answers", selectedAnswers) // TODO: for debugging purposes, will remove
    }

    const resetQuizQuestion = () =>{
        setSelectedAnswers([])
        setShowAns(false)
        setQuizReset(!quizReset) // reset state of quiz buttons
    }

    const handleSubmit = () => {
        // if (!showAns) {
        //     console.log(selectedAnswers) // TODO: for debugging purposes, will remove
        //     setShowAns(!showAns) // TODO: api call/socket logic should be made here to find answer
        // }
        socket.emit(SOCKET_EVENTS.PLAYER.answer, {
            joinCode: gameCode, 
            selectedAnswers: selectedAnswers
        })
    }

    const [currQuestion, setCurrQuestion] = useState({})
    useEffect(() => {
        if (!socket)
            console.log("Socket not connected")
        else {
            socket.on(SOCKET_EVENTS.ROOM.nextQuestion, (question) => {
                setCurrQuestion(question)
                resetQuizQuestion()
                console.log("nextQuestion", question)
            })
        }
    }, [])

    const questionTypeToDisplayString = (type) => {
        switch (type) {
            case QUIZ_TYPES.SINGLE_CHOICE:
                return "Single Choice"
            case QUIZ_TYPES.MULTIPLE_CHOICE:
                return "Multiple Choice"
            case QUIZ_TYPES.TRUE_OR_FALSE:
                return "True/False"
            case QUIZ_TYPES.FILL_BLANK:
                return "Fill in the blank"
        }
    }

    return (
        Object.keys(currQuestion).length <= 0 ? "No question yet" : <>
            <Container w={'600px'}>
            <Flex flexDirection={'column'} height={'100vh'} justifyContent={'center'}>
                <Box>
                    <Text>Question Type: {questionTypeToDisplayString(currQuestion.type)}</Text>
                    <Text>Question: {currQuestion.question}</Text>
                </Box>
                <Grid
                    padding={5}
                    h={'500px'}
                    w={'600px'}
                    gridGap={'25px'}
                    templateColumns='repeat(2, 1fr)'>
                    {
                        currQuestion.responses.map((response, i) => (
                            <QuizButton 
                                key={i} 
                                showAns={showAns} 
                                quizReset={quizReset}
                                onSelect={onSelect}
                                index={i} 
                                response={response} />
                        ))
                    }
                </Grid>
                <Flex gap={'10px'}>
                    <TextButton text={'Submit'} onClick={handleSubmit} />
                </Flex>
            </Flex>
        </Container>
        </>
        
    )
}