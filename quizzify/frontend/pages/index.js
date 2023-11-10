import LoginButton from "@/components/Buttons/Auth/LoginButton";
import LogoutButton from "@/components/Buttons/Auth/LogoutButton";
import { Button } from "@chakra-ui/react";

import { 
  useEffect, 
  useState, 
} from "react";
import { useAuth0 } from '@auth0/auth0-react';

import { getQuizzes } from "@/api/quizzes";

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const [quizzes, setQuizzes] = useState([])
  useEffect(() => {
    let isMounted = true;
    const loadQuizzes = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await getQuizzes(accessToken)
      setQuizzes(response[1].quizzes)
    }
    if (isAuthenticated)
      loadQuizzes()
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, getAccessTokenSilently])
  
  return (
    <>
      <Button>Quizzify</Button>
      {!isAuthenticated ? <LoginButton/> :
        <>
          <LogoutButton/>
          <h1>Signed in as {user.name}</h1>
          <h2>Quizzes: {quizzes}</h2>
        </>
      }
    </>
  )
}