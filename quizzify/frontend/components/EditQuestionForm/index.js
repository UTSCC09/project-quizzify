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
  
export default function EditQuestionForm({
    index,
    onEditQuestion,
    data,
    isOpen,
    onOpen,
    onClose
}) {
    const defaultResponse = {response: '', isAnswer: false};
    const [questionInput, setQuestionInput] = useState(data.question);
    const [typeInput, setTypeInput] = useState(data.type); // Default: SINGLE_CHOICE
    const [responsesListInput, setResponsesListInput] = useState(data.responses);

    const [responseReset, setResponseReset] = useState(false);

    useEffect(() => {
        setQuestionInput(data.question)
        setTypeInput(data.type)
        setResponsesListInput(data.responses)
    }, []);

    const onResponseListChange = (value, isAnswerValue, innerText, index, responseId) => {
        const newResponseList = [...responsesListInput]
        newResponseList[index] = {response: value, isAnswer: isAnswerValue}
        if (responseId) newResponseList[index]._id = responseId
        setResponsesListInput(newResponseList)
    }

    const onTypeChange = (value) => {
        setTypeInput(value)
    }

    const onResetResponseList = () => {
        setResponseReset(!responseReset);
    }

    // useEffect(() => {
    //     onResetResponseList()
    //     setResponsesListInput(typeInput === QUIZ_TYPES.TRUE_OR_FALSE ? 
    //         [
    //             {response: 'True', isAnswer: false},
    //             {response: 'False', isAnswer: false},
    //         ]
    //         : [defaultResponse])
    // }, [typeInput]);

    const handleSubmit = () => {
        onEditQuestion(index, {
            question: questionInput,
            type: typeInput,
            responses: responsesListInput
        }, onClose)
        setResponsesListInput([defaultResponse])
    }

    return (
      <div>
        <Modal
          size={'lg'}
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent py={4}>
            <ModalHeader>Edit a Question</ModalHeader>
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
                                            index={i} response={response} responseReset={responseReset} type={typeInput}
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
              <Button color={'white'} bg='brand.400' onClick={handleSubmit}>Edit Question</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
  }