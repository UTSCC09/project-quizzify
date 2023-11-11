import LoginButton from "@/components/Buttons/Auth/LoginButton";
import LogoutButton from "@/components/Buttons/Auth/LogoutButton";
import { Button } from "@chakra-ui/react";

import { 
  useCallback,
  useEffect, 
  useState, 
} from "react";
import { useAuth0 } from '@auth0/auth0-react';

import * as QUIZ_API from "@/api/quizzes";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const [quizzes, setQuizzes] = useState([])
  useEffect(() => {
    const getQuizzes = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await QUIZ_API.getQuizzes(accessToken)
      setQuizzes(response[1])
    }
    if (isAuthenticated)
      getQuizzes()
  }, [isAuthenticated, getAccessTokenSilently])
  
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
        setQuizzes([...quizzes, response[1]])
      }
    }
    createNewQuiz()
  }, [quizzes])

  return (
    <>
      <Button>Quizzify</Button>
      {!isAuthenticated ? <LoginButton/> :
        <>
          <LogoutButton/>
          <h1>Signed in as {user.name}</h1>
          <h2>Quizzes:</h2>
          {quizzes.map(quiz => 
            <div>
              Quiz name: {quiz.name} /
              Creator: {quiz.userId}
            </div>
          )}
          <Button onClick={createQuiz}>Create Quiz</Button>
        </>
      }
    </>
  )
}