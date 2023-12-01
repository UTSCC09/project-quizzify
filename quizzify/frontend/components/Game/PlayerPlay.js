import QuizButton from "@/components/Buttons/QuizButton";
import TextButton from "@/components/Buttons/TextButton";
import { QUIZ_MODES, QUIZ_TYPES, SOCKET_EVENTS } from "@/constants";
import { Alert, Box, Container, Drawer, DrawerContent, Flex, Grid, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomPointTag from "../CustomPointTag";
import GameOver from "./GameOver";

export default function PlayerPlay({
    socket,
    quizInfo,
    gameCode
}) {
    const [showAns, setShowAns] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [actualAnswers, setActualAnswers] = useState([]);
    const [pointsEarned, setPointsEarned] = useState(0)
    const [userCorrect, setUserCorrect] = useState(false);
    const [playerOut, setPlayerOut] = useState(false);
    const [triesLeft, setTriesLeft] = useState(3);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [submitted, setSubmitted] = useState(false)
    
    const onSelect = (response, index) => {
        if (submitted) return
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
        if (submitted) return;
        setSubmitted(true)
        socket.emit(SOCKET_EVENTS.PLAYER.answer, {
            joinCode: gameCode.toLowerCase(), 
            selectedAnswers: selectedAnswers
        }, (response) => {
            if (response.success) { // Submitted answer
                console.log("Submitted answer!")
            } 
            else if (response.playerOutOfGame){
                setPlayerOut(true)
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
                setUserCorrect(players[playerIndex].currQuestionResult)
                setTriesLeft(players[playerIndex].tries)
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
    
    useEffect(() => {
        const keyDownHandler = event => {
            if (submitted || !questionLive) return;
            if (event.key === 'Enter') {
                handleSubmit();
            }

            // Check if the key is a number and within the range of responses
            const numberKeyPressed = parseInt(event.key);
            if (!isNaN(numberKeyPressed) && numberKeyPressed >= 1 && numberKeyPressed <= currQuestion.responses.length) {
                onSelect(null, numberKeyPressed - 1); // number pressed will start at 1
            }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
      }, [selectedAnswers, currQuestion.responses, submitted, questionLive]);

    if (triesLeft <= 0 && playerOut)
      return <GameOver />

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
                <Drawer closeOnOverlayClick={false} placement={'bottom'} onClose={onClose} isOpen={isOpen}>
                    <DrawerContent>
                        <Alert
                            status={userCorrect ? 'success' : 'error'}
                            variant='subtle'
                            flexDirection='column'
                            alignItems='center'
                            paddingTop={12}
                            textAlign='center'
                            height='200px'
                            color={'white'}
                            bg={userCorrect ? 
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
                                    userCorrect ? <Text>Good job!</Text> : <Text>Sorry, Your answer is not correct</Text>
                                }
                                <CustomPointTag text={`+${pointsEarned}`} />
                            </Flex>
                            <Box as={Flex} gap={2} alignItems={'center'} justifyContent={'center'} 
                                fontWeight={600} color={'white'} bg={'whiteAlpha.500'} padding={4} borderRadius={'15px'}>
                                
                                {
                                    userCorrect ?
                                        'Amazing! Waiting for the next question' : 
                                        `${quizInfo.mode === QUIZ_MODES.LAST_MAN.BE ?  `${triesLeft} attempts left` : 'Aw'}, better luck next time!`
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