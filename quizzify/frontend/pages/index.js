import LoginButton from "@/components/Buttons/Auth/LoginButton";
import LogoutButton from "@/components/Buttons/Auth/LogoutButton";
import { Button } from "@chakra-ui/react";
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  return (
    <>
      <Button>Quizzify</Button>
      {!isAuthenticated ? <LoginButton/> :
        <>
          <LogoutButton/>
          <h1>Signed in as {user.name}</h1>
        </>
      }
    </>
  )
}