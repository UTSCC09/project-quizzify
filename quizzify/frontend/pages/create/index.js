import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { Box, Button, Flex, Text, Container, GridItem, Grid } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import { 
  useCallback, useState,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as QUIZ_API from "@/api/quizzes";
import ShortInput from "@/components/Forms/ShortInput";
import FormSelect from "@/components/Forms/FormSelect";
import QuizCard from "@/components/QuizCard";
import AddQuestionForm from "@/components/AddQuestionForm";
import { SAMPLE_QUIZ } from "@/constants/testingConstants";
import { PRIVATE, PUBLIC } from "@/constants";

export default function Home() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [permissionsInput, setPermissionsInput] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const createQuiz = useCallback(() => {
    const createNewQuiz = async () => {
      if (isAuthenticated) {
        const quiz = {
          name: titleInput,
          // description: descriptionInput,
          private: permissionsInput === PRIVATE,
          questions: questionsList,
        }

        const accessToken = await getAccessTokenSilently();
        const response = await QUIZ_API.createQuiz(accessToken, quiz);
        console.log("quiz created: ", response)
      }
    }
    if (questionsList.length !== 0) createNewQuiz();
  }, [questionsList])

  const onAddQuestion = (questionToBeAdded, callback) =>{
    setQuestionsList([...questionsList, questionToBeAdded]);
    callback();
  }

  return (
    <>
      {!isAuthenticated ? <LoginButton/> :
        <MainNavBar>
          <Flex px={4} py={2} flexDirection={'column'} gap={8}>
            <Box gap={4}>
              <Text fontWeight={700} fontSize={24}>Create a New Quiz</Text>
              <Text fontSize={16} color={'secondary.400'}>Choose from a selection of templates or create one from scratch!</Text>
            </Box>
            <Flex flexDirection={'column'} gap={2}>
              <ShortInput label='Title' placeholder='Enter Title' inputValue={titleInput} handleInputChange={setTitleInput} />
              <Flex flexDirection={'row'} gap={4}>
                <ShortInput label='Description' placeholder='Enter Description' inputValue={descriptionInput} handleInputChange={setDescriptionInput} />
                <FormSelect label='Visibility of Quiz' inputValue={permissionsInput} handleInputChange={setPermissionsInput}>
                  <option value={PUBLIC}>Public</option>
                  <option value={PRIVATE}>Private</option>
                </FormSelect>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} gap={2}>
              <Text fontWeight={700} fontSize={20}>Questions</Text>
              <Grid gridGap={'20px'} templateColumns='repeat(2, 1fr)'>
                {
                  questionsList.map((question, i) => (
                    <GridItem key={i}>
                      <QuizCard
                        index={i}
                        question={question}
                        // TODO: random image, will change
                        img={`https://picsum.photos/id/${Math.floor(Math.random() * (100 - 1) ) + 1}/200/200`} 
                        />
                    </GridItem>
                  ))
                }
                <GridItem>
                  <AddQuestionForm onAddQuestion={onAddQuestion}/>
                </GridItem>
              </Grid>
            </Flex>
            <Button onClick={createQuiz}>Create Quiz</Button>
          </Flex>
        </MainNavBar>
      }
    </>
  )
}