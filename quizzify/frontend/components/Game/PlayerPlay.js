import QuizButton from "@/components/Buttons/QuizButton";
import TextButton from "@/components/Buttons/TextButton";
import { QUIZ_TYPES, SOCKET_EVENTS } from "@/constants";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Container, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PlayerPlay({
    socket,
    gameCode
}) {
    const [showAns, setShowAns] = useState(false); // TODO: sync with timer
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [actualAnswers, setActualAnswers] = useState([]); // TODO: this is just internal logic, will be enforced with api calls
    const [pointsEarned, setPointsEarned] = useState(0)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [submitted, setSubmitted] = useState(false)
    
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

    const resetQuizQuestion = () => {
        setSelectedAnswers([])
        setShowAns(false)
        setSubmitted(false)
    }

    const handleSubmit = () => {
        setSubmitted2(true);
        socket.emit(SOCKET_EVENTS.PLAYER.answer, {
            joinCode: gameCode.toLowerCase(), 
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
            socket.on(SOCKET_EVENTS.ROOM.questionEnd, (answerResponses) => {
                setShowAns(true)
                setActualAnswers(answerResponses.map(answer => answer.index))
                setQuestionLive(false)
                onOpen();
            })
            socket.on(SOCKET_EVENTS.ROOM.updatePlayers, (players) => {
                const playerIndex = players.findIndex(p => p.socketId == socket.id);
                const pointsEarned = players[playerIndex].currQuestionPoints
                setPointsEarned(pointsEarned)
            })
            socket.on(SOCKET_EVENTS.ROOM.questionNext, (question) => {
                onClose();
                resetQuizQuestion()
                setCurrQuestion(question)
                setQuestionLive(true)
            })
        }
    }, [])

    const questionTypeToDisplayString = (type) => {
        switch (type) {
            case QUIZ_TYPES.SINGLE_CHOICE:
                return "Select an answer"
            case QUIZ_TYPES.MULTIPLE_CHOICE:
                return "Select one or more answers"
            case QUIZ_TYPES.TRUE_OR_FALSE:
                return "True or False?"
        }
    }
    
    return (
        <>
            <Container w={'600px'}>
                <Flex flexDirection={'column'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
                    {
                        !currQuestion.responses ? <Text color={'background.400'} fontSize={'md'}>Waiting for question...</Text>
                        : <>
                            <Box>
                                <Text color={'background.400'} fontWeight="bold">{questionTypeToDisplayString(currQuestion.type)}:</Text>
                                <Text color={'background.400'} fontSize="2xl">{currQuestion.question}</Text>
                            </Box>
                            <Grid
                                padding={5}
                                h={'500px'}
                                w={'600px'}
                                gridGap={'20px'}
                                templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)'}}>
                                {currQuestion.responses && currQuestion.responses.map((response, index) => (
                                        <QuizButton 
                                            key={index} 
                                            showAns={showAns} 
                                            response={response}
                                            index={index} 
                                            actualAnswers={actualAnswers}
                                            selectedAnswers={selectedAnswers}
                                            onSelect={onSelect}
                                            />
                                    ))
                                }
                            </Grid>
                            <Flex gap={'10px'}>
                                <TextButton text={'Submit'} isDisabled={submitted || !questionLive} onClick={handleSubmit} />
                            </Flex>
                        </>
                    }
                </Flex>
                <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
                    <DrawerContent>
                        <Alert
                            status={pointsEarned === 100 ? 'success' : 'error'}
                            variant='subtle'
                            flexDirection='column'
                            alignItems='center'
                            paddingTop={12}
                            textAlign='center'
                            height='200px'
                            color={'white'}
                            bg={pointsEarned === 100 ? 
                                'linear-gradient(0deg, #4ABA57 0%, #58cb65 100%)' : 
                                'linear-gradient(0deg, #f56767 0%, #EA3839 100%)'
                            }
                            gap={4}
                        >
                            <Flex 
                                alignItems='center'
                                justifyContent='center'
                                gap={4}
                                fontSize={24}
                                fontWeight={700}>
                                {
                                    pointsEarned === 100 ? <Text>Good job!</Text> : <Text>Sorry, Your answer is not correct</Text>
                                }
                                <Text fontSize={20} fontWeight={900} px={2}
                                    py={'1px'} bg={'white'} borderRadius={'10px'} color={'brand.400' }>
                                    +{pointsEarned}
                                </Text> 
                            </Flex>
                            <Box as={Flex} gap={2} alignItems={'center'} justifyContent={'center'} 
                                fontWeight={600} color={'white'} bg={'whiteAlpha.500'} padding={4} borderRadius={'15px'}>
                                
                                {
                                    pointsEarned === 100 ? 
                                        'Amazing! Waiting for the next question' : 'Aw, better luck next time'
                                }
                                <Spinner />
                            </Box>
                        </Alert>
                    </DrawerContent>
                </Drawer>
            </Container>
        </>
        
    )
}