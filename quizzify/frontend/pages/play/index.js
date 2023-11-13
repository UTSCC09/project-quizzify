import QuizButton from "@/components/Buttons/QuizButton";
import TextButton from "@/components/Buttons/TextButton";
import { SAMPLE_QUIZ } from "@/constants/testingConstants";
import { Box, Container, Flex, Grid, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function Play() {
    // following values changes with the state of game:
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // TODO: this is just internal logic, will be enforced with api calls
    const [showAns, setShowAns] = useState(false); // TODO: sync with timer
    const [quizReset, setQuizReset] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [actualAnswer, setActualAnswer] = useState([]); // TODO: this is just internal logic, will be enforced with api calls
    
    const onSelect = (selectedResponse, callBack) => {
        const maxSelection = 1; // TODO: number depends on the type of quiz
        if (!selectedAnswers.includes(selectedResponse) && selectedAnswers.length + 1 > maxSelection) return;
        if (!selectedAnswers.includes(selectedResponse)){
            selectedAnswers.push(selectedResponse)
            setSelectedAnswers(selectedAnswers);
            callBack()
        }
        else {
            setSelectedAnswers(selectedAnswers.filter((e)=> e!== selectedResponse))
            callBack()
        }
        console.log(selectedAnswers) // TODO: for debugging purposes, will remove
    }

    const resetQuizQuestion = () =>{
        setSelectedAnswers([])
        setShowAns(false)
        setQuizReset(!quizReset) // reset state of quiz buttons
    }

    const getNextQuestion = () => {
        // TODO: this logic will be changed since we will not have access to the entire quiz
        return SAMPLE_QUIZ.questions[currentQuestionIndex]
    }
    
    const currentQuestion = getNextQuestion()
    const questionChoices = currentQuestion.responses;

    return (
        <Container w={'600px'}>
            <Flex flexDirection={'column'} height={'100vh'} justifyContent={'center'}>
                <Box>
                    <Text>Question Type: {currentQuestion.type}</Text>
                    <Text>Question: {currentQuestion.question}</Text>
                </Box>
                <Grid
                    padding={5}
                    h={'500px'}
                    w={'600px'}
                    gridGap={'25px'}
                    templateColumns='repeat(2, 1fr)'>
                    {
                        questionChoices.map((response, i) => (
                            <QuizButton 
                                key={i} showAns={showAns} quizReset={quizReset}
                                onSelect={onSelect}
                                response={response} />
                        ))
                    }
                </Grid>
                <Flex gap={'10px'}>
                    <TextButton text={'Prev Question'} // TODO: for testing purposes, this will be removed.
                        onClick={()=>{
                            if (currentQuestionIndex > 0){
                                setCurrentQuestionIndex(currentQuestionIndex-1)
                                resetQuizQuestion();
                            }
                        }} />
                    <TextButton text={'Next Question'} // TODO: for testing purposes, this will be removed.
                        onClick={()=>{
                            if (currentQuestionIndex < questionChoices.length){
                                setCurrentQuestionIndex(currentQuestionIndex+1)
                                resetQuizQuestion();
                            }
                        }} />
                    <TextButton text={'Submit'}
                        onClick={()=>{
                            if (!showAns){
                                console.log(selectedAnswers) // TODO: for debugging purposes, will remove
                                setShowAns(!showAns) // TODO: api call/socket logic should be made here to find answer
                            }
                        }} />
                </Flex>
            </Flex>
        </Container>
    )
}