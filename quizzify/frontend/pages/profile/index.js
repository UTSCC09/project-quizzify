import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { Box } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import {
    useEffect, 
    useState, 
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as QUIZ_API from "@/api/quizzes";

export default function Home() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [quizzes, setQuizzes] = useState([])
  useEffect(() => {
    const getQuizzes = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await QUIZ_API.getQuizzes(accessToken) // TODO: get logged in user's quizzes
      setQuizzes(response[1])
    }
    if (isAuthenticated)
      getQuizzes()
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <>
      {!isAuthenticated ? <LoginButton/> :
        <MainNavBar>
          <Box>This is the profile page. Can put list of user quizzes and other stuff</Box>
          <h2>Quizzes:</h2>
          {quizzes.map(quiz => 
            <div>
              Quiz name: {quiz.name} /
              Creator: {quiz.userId}
            </div>
          )}
        </MainNavBar>
      }
    </>
  )
}