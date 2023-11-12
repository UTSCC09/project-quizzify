import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { Box, Button } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import { 
  useCallback,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as QUIZ_API from "@/api/quizzes";

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
          questions: [
            {
                question: 'What mammal has the most powerful bite?',
                type: QUIZ_API.QUIZ_TYPES.SINGLE_CHOICE,
                responses: [{response: 'Your mom', isAnswer: false }, {response: 'Gorilla', isAnswer: false }, 
                            {response: 'Hippopotamus', isAnswer: true }, {response: 'Grizzly Bear', isAnswer: false }]
            }],
        }

        const accessToken = await getAccessTokenSilently();
        const response = await QUIZ_API.createQuiz(accessToken, quiz);
        console.log("quiz created: ", response)
      }
    }
    createNewQuiz()
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <>
      {!isAuthenticated ? <LoginButton/> :
        <MainNavBar>
          <Box>This is the create page. The user will create quizzes here. Templates will be added in the future.</Box>
          <Button onClick={createQuiz}>Create Quiz</Button>
        </MainNavBar>
      }
    </>
  )
}