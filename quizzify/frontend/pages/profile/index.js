import { Box, Flex, Grid, HStack, Text, chakra } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import {
    useEffect, 
    useState, 
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as USER_API from "@/api/users";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

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
      {!isAuthenticated ? <AuthenticationGuard/> :
        <MainNavBar>
          <Box>This is the profile page. Can put list of user quizzes and other stuff</Box>
          <Flex flexDirection={'column'} gap={2}>
              <Text fontWeight={700} fontSize={20}>Your Quizzes</Text>
              <Grid gridGap={'20px'} templateColumns='repeat(2, 1fr)'>
                {quizzes.map((quiz, i) => 
                  <Flex
                    key={i}
                    maxW="100%"
                    maxH="200px"
                    bg="white"
                    shadow="sm"
                    rounded="lg"
                    overflow="hidden">
                    <Box w={2 / 3} p={4}>
                      <chakra.h1 fontSize="lg" fontWeight="600">{quiz.name}</chakra.h1>
                      <Box mt={2} fontSize="sm" color="gray.600">
                        <chakra.h2 fontSize="md" fontWeight="500">{quiz.description}</chakra.h2>
                        <HStack spacing={{ base: '1' }}>
                          {quiz.private ? <>
                            <Text>Private</Text>
                            <AiFillLock/>
                          </> : <>
                            <Text>Public</Text>
                            <AiFillUnlock/>
                          </>}
                        </HStack>
                        <Text>Created {new Date(quiz.createdAt).toLocaleDateString()}</Text>
                      </Box>
                    </Box>
                  </Flex>
                )}
              </Grid>
          </Flex>
        </MainNavBar>
      }
    </>
  )
}