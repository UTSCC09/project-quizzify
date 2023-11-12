import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { Box } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  return (
    <>
      {!isAuthenticated ? <LoginButton/> :
        <MainNavBar>
          <Box>This is the home page. Can put featured quizzes and other stuff</Box>
        </MainNavBar>
      }
    </>
  )
}