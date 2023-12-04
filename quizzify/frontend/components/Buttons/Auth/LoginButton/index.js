import {
    Button
} from '@chakra-ui/react';

import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({
  signUp = false
}) => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>{signUp ? "Sign Up / " : ""}Log In</Button>;
};

export default LoginButton;