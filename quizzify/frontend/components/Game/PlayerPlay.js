import QuizButton from "@/components/Buttons/QuizButton";
import TextButton from "@/components/Buttons/TextButton";
import { QUIZ_TYPES, SOCKET_EVENTS } from "@/constants";
import { Box, Container, Flex, Grid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PlayerPlay({
    socket,
    gameCode
}) {
    const [showAns, setShowAns] = useState(false); // TODO: sync with timer
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [actualAnswer, setActualAnswer] = useState([]); // TODO: this is just internal logic, will be enforced with api calls
    
    const onSelect = (response, index) => {
        if (currQuestion) {
            let maxSelection = 1
            switch (currQuestion.type) {
                case QUIZ_TYPES.MULTIPLE_CHOICE:
                    maxSelection = Math.min(6, Math.max(maxSelection, currQuestion.responses.length)) // [2, x] where 1 <= currQuestion.responses.length <= x <= 6
                    break
            }

            if (!selectedAnswers.includes(index)) { // Add to selected answers
                if (maxSelection <= 2) // Toggle other selected answer
                    setSelectedAnswers([index])
                else if (selectedAnswers.length >= maxSelection) 
                    return;
                else
                    setSelectedAnswers([...selectedAnswers, index]);
            } else // Remove from selected answers
                setSelectedAnswers(selectedAnswers.filter(e => e !== index))
        } else {
            console.log("No current question; cannot select response")
        }
    }

    const resetQuizQuestion = () =>{
        setSelectedAnswers([])
        setShowAns(false)
        setSubmitted(false)
    }

    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = () => {
        socket.emit(SOCKET_EVENTS.PLAYER.answer, {
            joinCode: gameCode, 
            selectedAnswers: selectedAnswers
        }, (response) => {
            if (response.success) { // Submitted answer
                setSubmitted(true)
                console.log("Submitted answer!")
            } else { // Failed to submit game
                setSubmitted(false)
                console.log("Failed to submit answer!")
            }
        })
    }

    const [questionLive, setQuestionLive] = useState(false)
    const [currQuestion, setCurrQuestion] = useState({})
    useEffect(() => {
        if (!socket)
            console.log("Socket not connected")
        else {
            socket.on(SOCKET_EVENTS.ROOM.questionEnd, (question) => {
                setQuestionLive(false)
            })
            socket.on(SOCKET_EVENTS.ROOM.questionNext, (question) => {
                resetQuizQuestion()
                setCurrQuestion(question)
                setQuestionLive(true)
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
        <>
            <Container w={'600px'}>
            <Flex flexDirection={'column'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
                {!questionLive ? 
                    <Text color={'background.400'} fontSize={'md'}>Waiting for next question...</Text> 
                    : <>
                        <Box>
                            <Text color={'background.400'} fontWeight="bold">{questionTypeToDisplayString(currQuestion.type)}:</Text>
                            <Text color={'background.400'} fontSize="2xl">{currQuestion.question}</Text>
                        </Box>
                        <Grid
                            padding={5}
                            h={'500px'}
                            w={'600px'}
                            gridGap={'25px'}
                            templateColumns='repeat(2, 1fr)'>
                            {currQuestion.responses.map((response, index) => (
                                    <QuizButton 
                                        key={index} 
                                        showAns={submitted}//{showAns} 
                                        response={response}
                                        index={index} 
                                        selectedAnswers={selectedAnswers}
                                        onSelect={onSelect}
                                        />
                                ))
                            }
                        </Grid>
                        <Flex gap={'10px'}>
                            <TextButton text={'Submit'} isDisabled={submitted} onClick={handleSubmit} />
                        </Flex>
                    </>
                }
            </Flex>
        </Container>
        </>
        
    )
}