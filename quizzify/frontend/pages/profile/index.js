import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { Box } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import {
    useEffect, 
    useState, 
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as USER_API from "@/api/users";
import * as QUIZ_API from "@/api/quizzes";

export default function Home() {
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [quizzes, setQuizzes] = useState([])
  useEffect(() => {
    const getUserQuizzes = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        const response = await USER_API.getQuizzesByUserId(accessToken, user.sub)
        setQuizzes(response[1])
      }
    }
    getUserQuizzes()
  }, [user, isAuthenticated, getAccessTokenSilently])

  return (
    <>
      {!isAuthenticated ? <LoginButton/> :
        <MainNavBar>
          <Box>This is the profile page. Can put list of user quizzes and other stuff</Box>
          <h2>Quizzes:</h2>
          {quizzes.map(quiz => 
            <div>{JSON.stringify(quiz)}</div>
          )}
        </MainNavBar>
      }
    </>
  )
}