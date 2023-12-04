import { Box, Button, Flex, Text, GridItem, Grid, useDisclosure, useToast } from "@chakra-ui/react";
import MainNavBar from "@/components/MainNavBar";

import {
  useCallback, useEffect, useState,
} from "react";
import { useAuth0 } from '@auth0/auth0-react';
import * as QUIZ_API from "@/api/quizzes";
import ShortInput from "@/components/Forms/ShortInput";
import FormSelect from "@/components/Forms/FormSelect";
import QuizCard from "@/components/QuizCard";
import AddQuestionForm from "@/components/AddQuestionForm";
import { PRIVATE, PUBLIC, QUIZ_MODES, QUIZ_TIMERS, getToast } from "@/constants";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { useRouter } from "next/router";
import NumInput from "@/components/Forms/NumberInput";

export default function Edit() {
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [permissionsInput, setPermissionsInput] = useState('');
  const [modeInput, setModeInput] = useState(QUIZ_MODES.DEFAULT.BE);
  const [defaultTimerInput, setDefaultTimerInput] = useState(QUIZ_TIMERS.MEDIUM);
  const [questionsList, setQuestionsList] = useState([]);
  const [quizFound, setQuizFound] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast()

  const router = useRouter()
  const quizId = router.query.quizId

  const editQuiz = useCallback(() => {
    const editQuizAsync = async () => {
      if (isAuthenticated) {
        const quiz = {
          name: titleInput,
          description: descriptionInput,
          private: permissionsInput === PRIVATE,
          questions: questionsList,
          defaultTimer: defaultTimerInput,
          mode: modeInput,
        }

        // call edit endpoint
        const accessToken = await getAccessTokenSilently();
        const response = await QUIZ_API.editQuizById(accessToken, quizId, quiz);
        if (response[0].status == 200) {
          console.log("Edited quiz", response[1])
          toast(getToast('Editted quiz', true))
        } else
          toast(getToast('Failed to edit quiz', false))
      }
    }
    if (questionsList?.length !== 0) editQuizAsync();
  }, [titleInput, descriptionInput, permissionsInput,
    questionsList, defaultTimerInput, modeInput,
    isAuthenticated, getAccessTokenSilently])

  useEffect(() => {
    const getQuizById = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await QUIZ_API.getQuizById(accessToken, quizId);
      if (isAuthenticated && response[0].status == 200 && response.length > 1) {
        const quiz = response[1]
        if (quiz.userId == user.sub) {
          setTitleInput(quiz.name)
          setDescriptionInput(quiz.description)
          setPermissionsInput(quiz.private ? PRIVATE : PUBLIC)
          setQuestionsList(quiz.questions)
          setDefaultTimerInput(quiz.defaultTimer)
          setModeInput(quiz.mode)
          setQuizFound(true)
        } else {
          setQuizFound(false)
          toast(getToast('User does not have permissions to edit this quiz', false))
        }
      } else {
        setQuizFound(false)
        toast(getToast('Failed to get quiz', false))
      }
    }
    if (quizId && isAuthenticated) getQuizById()
  }, [router.query.quizId, user, isAuthenticated, getAccessTokenSilently]);

  const onAddQuestion = (questionToBeAdded, callback) => {
    setQuestionsList([...questionsList, questionToBeAdded]);
    callback();
  }

  const onEditQuestion = (index, data, callback) => {
    let updatedQuestions = [...questionsList];
    updatedQuestions[index] = data;
    setQuestionsList(updatedQuestions);
    callback();
  }

  useEffect(() => {
    if (modeInput === QUIZ_MODES.RAPID_FIRE.BE) {
      setDefaultTimerInput(QUIZ_TIMERS.RAPID)
    }
  }, [modeInput]);

  return (
    <>
      {!isAuthenticated ? <AuthenticationGuard /> :
        <MainNavBar>
          <Flex px={4} py={2} flexDirection={'column'} gap={8}>
            <Box gap={4}>
              <Text fontWeight={700} fontSize={24}>{quizFound ? "Edit Quiz" : "Quiz not found"}</Text>
            </Box>

            {
              quizFound && (
                <>
                  <Flex flexDirection={'column'} gap={2}>
                    <ShortInput label='Title' placeholder='Enter Title' inputValue={titleInput} handleInputChange={setTitleInput} />
                    <Flex gap={4}>
                      <ShortInput label='Description' placeholder='Enter Description' inputValue={descriptionInput} handleInputChange={setDescriptionInput} />
                      <FormSelect label='Visibility of Quiz' inputValue={permissionsInput} handleInputChange={setPermissionsInput}>
                        <option value={PUBLIC}>Public</option>
                        <option value={PRIVATE}>Private</option>
                      </FormSelect>
                    </Flex>
                    <Flex gap={4}>
                      <NumInput
                        isDisabled={modeInput === QUIZ_MODES.RAPID_FIRE.BE} label={'Question Timer (Seconds)'}
                        inputValue={defaultTimerInput} handleInputChange={setDefaultTimerInput} />
                      <FormSelect label='Mode' inputValue={modeInput} handleInputChange={setModeInput}>
                        <option value={QUIZ_MODES.DEFAULT.BE}>{QUIZ_MODES.DEFAULT.FE}</option>
                        <option value={QUIZ_MODES.RAPID_FIRE.BE}>{QUIZ_MODES.RAPID_FIRE.FE}</option>
                        <option value={QUIZ_MODES.LAST_MAN.BE}>{QUIZ_MODES.LAST_MAN.FE}</option>
                      </FormSelect>
                    </Flex>
                  </Flex>
                  <Flex flexDirection={'column'} gap={2}>
                    <Text fontWeight={700} fontSize={20}>Questions</Text>
                    <Grid gridGap={'20px'} templateColumns='repeat(2, 1fr)'>
                      {
                        questionsList?.map((question, i) => (
                          <GridItem key={i}>
                            <QuizCard
                              index={i}
                              question={question}
                              onEditQuestion={onEditQuestion}
                            />
                          </GridItem>
                        ))
                      }
                      <GridItem>
                        <AddQuestionForm
                          isOpenQuestionForm={isOpen}
                          onOpenQuestionForm={onOpen}
                          onCloseQuestionForm={onClose}
                          onAddQuestion={onAddQuestion}
                        />
                      </GridItem>
                    </Grid>
                  </Flex>
                  <Button onClick={editQuiz} isDisabled={questionsList?.length <= 0}>Edit Quiz</Button>
                </>
              )
            }

          </Flex>
        </MainNavBar>
      }
    </>
  )
}