import { Avatar, Box, Flex, Grid, HStack, Text, VStack, chakra } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import {
  useEffect,
  useState,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as USER_API from "@/api/users";
import * as QUIZ_API from "@/api/quizzes";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { convertBEtoFEMode } from "@/constants";
import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

export default function Home() {
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [quizzes, setQuizzes] = useState([])
  const getUserQuizzes = async () => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      const response = await USER_API.getQuizzesByUserId(accessToken, user.sub)
      if (response[0].status == 200)
        setQuizzes(response.length > 1 ? response[1] : [])
      else
        console.log("Failed to get user quizzes")
    }
  }
  useEffect(() => {
    getUserQuizzes()
  }, [user, isAuthenticated, getAccessTokenSilently])

  const handleCopyQuiz = async (quizId) => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      const response = await QUIZ_API.copyQuizById(accessToken, quizId);
      if (response[0].status == 200) {
        console.log("Copied quiz!", response[1])
        getUserQuizzes()
      } else
        console.log("Failed to copy quiz")
    }
  }

  const handleDeleteQuiz = async (quizId) => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      const response = await QUIZ_API.deleteQuizById(accessToken, quizId);
      if (response[0].status == 200) {
        console.log("Deleted quiz", )
        getUserQuizzes()
      } else
        console.log("Failed to delete quiz")
    }
  }

  const handleEditQuiz = async (quizId) => {
    if (isAuthenticated) {
      window.location = `/quizzes/edit/${quizId}`
    }
  }

  return (
    <>
      {!isAuthenticated ? <AuthenticationGuard /> :
        <MainNavBar>
          <Flex px={4} py={2} flexDirection={'column'} gap={8}>
            <Box gap={4}>
              <Text fontWeight={700} fontSize={24}>Profile</Text>
              <Flex
                maxW="100%"
                maxH="200px"
                bg="white"
                shadow="sm"
                rounded="lg"
                overflow="hidden">
                <Box p={4}>
                  <HStack>
                    <Avatar
                      size={'2xl'}
                      src={user.picture}
                    />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      <Text fontSize="3xl">{user.name}</Text>
                      <Text fontSize="l" color="gray.600">
                        {user.email}
                      </Text>
                      <HStack spacing={{ base: '1' }}>
                        <Text fontSize="xs" color="gray.600" fontWeight="bold">User ID:</Text>
                        <Text fontSize="xs" color="gray.600">
                          {user.sub}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              </Flex>
            </Box>

            <Flex flexDirection={'column'} gap={2}>
              <Text fontWeight={700} fontSize={20}>Quizzes ({quizzes.length})</Text>
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
                    <Box p={4}>
                      <chakra.h1 fontSize="lg" fontWeight="600">{quiz.name}</chakra.h1>
                      <chakra.h2 fontSize="md" fontWeight="500">{quiz.description}</chakra.h2>

                      <HStack py={1} spacing={{ base: '2' }}>
                        <Tooltip label="Copy Template">
                          <CopyIcon cursor={'pointer'} onClick={() => { handleCopyQuiz(quiz._id) }} />
                        </Tooltip>
                        
                        {/* TODO: Update when other user profiles enabled */}
                        {/* {user.sub != profileUser.sub ? null : <> */}
                        {false ? null : <>
                          <Tooltip label="Edit">
                            <EditIcon cursor={'pointer'} onClick={() => { handleEditQuiz(quiz._id) }} />
                          </Tooltip>
                          <Tooltip label="Delete">
                            <DeleteIcon cursor={'pointer'} onClick={() => { handleDeleteQuiz(quiz._id) }} />
                          </Tooltip>
                        </>}
                      </HStack>
                      
                      <Box mt={2} fontSize="sm" color="gray.600">
                        <HStack spacing={{ base: '1' }}>
                          <Text fontWeight="bold">Visibility:</Text>
                          {quiz.private ? <>
                            <Text>Private</Text>
                            <AiFillLock />
                          </> : <>
                            <Text>Public</Text>
                            <AiFillUnlock />
                          </>}
                        </HStack>
                        <HStack spacing={{ base: '1' }}>
                          <Text fontWeight="bold">Mode:</Text>
                          <Text>{convertBEtoFEMode(quiz.mode)}</Text>
                        </HStack>
                        <HStack spacing={{ base: '1' }}>
                          <Text fontWeight="bold">Created</Text>
                          <Text>{new Date(quiz.createdAt).toLocaleDateString()}</Text>
                        </HStack>
                      </Box>
                    </Box>
                  </Flex>
                )}
              </Grid>
            </Flex>
          </Flex>
        </MainNavBar>
      }
    </>
  )
}