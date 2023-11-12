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

export default function Home() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const createQuiz = useCallback(() => {
    const createNewQuiz = async () => {
      if (isAuthenticated) {
        const quiz = {
          name: "New Quiz",
          private: false,
          questions: [],
        }

        const accessToken = await getAccessTokenSilently();
        const response = await QUIZ_API.createQuiz(accessToken, quiz);
        console.log("quiz created: ", response)
      }
    }
    createNewQuiz()
  }, [])

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [permissionsInput, setPermissionsInput] = useState('');
  const [questionsList, setQuestionsList] = useState([
      {
          question: 'What mammal has the most powerful bite?',
          type: 'SINGLE_CHOICE',
          responses: [{response: 'Your mom', isAnswer: false }, {response: 'Gorilla', isAnswer: false }, 
                      {response: 'Hippopotamus', isAnswer: true }, {response: 'Grizzly Bear', isAnswer: false }],
      },
      {
          question: 'What is a group of cats called?',
          type: 'SINGLE_CHOICE',
          responses: [{response: 'A Clowder', isAnswer: true }, {response: 'A Pandemonium', isAnswer: false }, 
                      {response: 'A Spawnage', isAnswer: false }, {response: 'A Clover', isAnswer: false }],
      },
      {
          question: 'How many legs does a lobster have?',
          type: 'SINGLE_CHOICE',
          responses: [{response: '10', isAnswer: true }, {response: '8', isAnswer: false }, 
                      {response: '12', isAnswer: false }, {response: '6', isAnswer: false }],
      },
      {
          question: 'What is the deadliest creature in the world?',
          type: 'SINGLE_CHOICE',
          responses: [{response: 'Snake', isAnswer: false }, {response: 'Shark', isAnswer: false }, 
                      {response: 'Grizzly Bear', isAnswer: false }, {response: 'Mosquito', isAnswer: true }],
      },
      {
          question: 'The ostrich lays the smallest egg compared to all animals.',
          type: 'TRUE_OR_FALSE',
          responses: [{response: 'True', isAnswer: false }, {response: 'False', isAnswer: true }],
      },
    ]);

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
                  <option>Public</option>
                  <option>Private</option>
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
                  <AddQuestionForm />
                </GridItem>
              </Grid>
            </Flex>
            {/* <Button onClick={createQuiz}>Create Quiz</Button> */}
          </Flex>
        </MainNavBar>
      }
    </>
  )
}