import { 
    Box, 
    Button, 
    Flex, 
    Grid, 
    GridItem, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import ShortInput from '../Forms/ShortInput';
import FormSelect from '../Forms/FormSelect';
import CustomResponseInput from '../CustomResponseInput';
import { QUIZ_TYPES } from '@/constants';
  
export default function AddQuestionForm({
    onAddQuestion,
    isOpenQuestionForm,
    onOpenQuestionForm,
    onCloseQuestionForm
}) {
    const defaultResponse = {response: '', isAnswer: false};
    const [questionInput, setQuestionInput] = useState('');
    const [typeInput, setTypeInput] = useState(QUIZ_TYPES.SINGLE_CHOICE); // Default: SINGLE_CHOICE
    const [responsesListInput, setResponsesListInput] = useState([defaultResponse]);

    const [responseReset, setResponseReset] = useState(false);

    const onResponseListChange = (value, isAnswerValue, innerText, index) => {
        const newResponseList = [...responsesListInput]
        newResponseList[index] = {response: value, isAnswer: isAnswerValue}
        setResponsesListInput(newResponseList)
    }

    const onTypeChange = (value) => {
        setTypeInput(value)
    }

    const onResetResponseList = () => {
        setResponseReset(!responseReset);
    }

    useEffect(() => {
        onResetResponseList()
        setResponsesListInput(typeInput === QUIZ_TYPES.TRUE_OR_FALSE ? 
            [
                {response: 'True', isAnswer: false},
                {response: 'False', isAnswer: false},
            ]
            : [defaultResponse])
    }, [typeInput]);

    const handleSubmit = () => {
        onAddQuestion({
            question: questionInput,
            type: typeInput,
            responses: responsesListInput
        }, onCloseQuestionForm)
        setResponsesListInput([defaultResponse])
    }

    return (
      <div>
        <Button onClick={onOpenQuestionForm}>Add a Question</Button>
        <Modal
          size={'lg'}
          isCentered
          onClose={onCloseQuestionForm}
          isOpen={isOpenQuestionForm}
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent py={4}>
            <ModalHeader>Add a Question</ModalHeader>
            <ModalBody>
                {/* TODO: image upload option */}
                <Flex flexDirection={'column'} gap={4}>
                    <ShortInput label='Question' placeholder='Enter Question' inputValue={questionInput} handleInputChange={setQuestionInput} />
                    <FormSelect label='Type' inputValue={typeInput} handleInputChange={onTypeChange}>
                        <option value={QUIZ_TYPES.SINGLE_CHOICE}>Single Choice</option>
                        <option value={QUIZ_TYPES.MULTIPLE_CHOICE}>Multiple Choice</option>
                        <option value={QUIZ_TYPES.TRUE_OR_FALSE}>True/False</option>
                    </FormSelect>
                    <Box maxH={'300px'} overflowY={'scroll'}>
                        <Grid gridGap={'20px'} templateColumns='repeat(2, 1fr)' mt={4}>
                            {
                                responsesListInput.map((response, i) => (
                                    <GridItem key={i}>
                                        <CustomResponseInput
                                            index={i} response={response} responsesListInput={responsesListInput}
                                            responseReset={responseReset} type={typeInput}
                                            onChange={onResponseListChange}/>
                                    </GridItem>
                                ))
                            }
                            {
                                responsesListInput.length <= 5 && typeInput !== QUIZ_TYPES.TRUE_OR_FALSE ? (
                                    <Button onClick={()=>{
                                        if (responsesListInput.length <= 5) setResponsesListInput([...responsesListInput, defaultResponse])
                                    }}>Add a Response</Button>
                                ) : null
                            }
                        </Grid>
                    </Box>
                </Flex>
            </ModalBody>
            <ModalFooter>
              <Button color={'white'} bg='brand.400' 
                isDisabled={responsesListInput.some((resp)=>resp.response === '') ||
                    !responsesListInput.some((resp)=>resp.isAnswer === true)} 
                onClick={handleSubmit}>
                Add Question
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
  }