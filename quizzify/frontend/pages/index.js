import { Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";
import LoginButton from "@/components/Buttons/Auth/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import Link from "next/link";
import ButtonLinkWrapper from "@/components/Buttons/ButtonLinkWrapper";
// import { NextLink } from "next/link";

export default function Home() {
  const {
    isAuthenticated,
  } = useAuth0();
  const router = useRouter()

  return (
    <MainNavBar>
      <Flex height={'100vh'} flexDirection={'column'}>
        <Flex
          height={'100vh'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={6}>
          <Text fontSize="7xl" fontWeight="bold">
            Quizzify
          </Text>

          <VStack>
            <Text>
              An immersive, real-time quiz platform crafted to infuse interactivity into classrooms, gatherings, and informal assemblies.
            </Text>
            <Text>
              There are endless possibilities for everybody to create, host, and play fun quiz sessions in real-time with exciting features like quiz templates and special game modes!
            </Text>
          </VStack>

          <VStack mt={16}>
            <Text fontSize={'32px'} fontWeight={700}>Ready to play?</Text>
            <HStack>
              <ButtonLinkWrapper href={'/play'}>
                <Button size="lg" colorScheme={'brand'}>Join a Quiz</Button>
              </ButtonLinkWrapper>
            </HStack>
          </VStack>
          
          <VStack mt={32}>
            <Text>Want to create and host your own quizzes?</Text>
            {!isAuthenticated ? <LoginButton signUp={true} /> :
              <HStack>
                <ButtonLinkWrapper href={'/create'}>
                  <Button>Create Quiz</Button>
                </ButtonLinkWrapper>
                <ButtonLinkWrapper href={'/host'}>
                  <Button>Host Game</Button>
                </ButtonLinkWrapper>
              </HStack>
            }
            <HStack>
              Create Quiz
              Host
            </HStack>
          </VStack></Flex>
      </Flex>
    </MainNavBar>
  )
}