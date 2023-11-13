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
    ModalOverlay, 
    useDisclosure 
} from '@chakra-ui/react'
import { useState } from 'react';
import ShortInput from '../Forms/ShortInput';
import FormSelect from '../Forms/FormSelect';
import CustomResponseInput from '../CustomResponseInput';
import { SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_OR_FALSE, FILL_BLANK } from '@/constants';
  
export default function AddQuestionForm({
    onAddQuestion,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const defaultResponse = {response: '', isAnswer: false};
    const [questionInput, setQuestionInput] = useState('');
    const [typeInput, setTypeInput] = useState(SINGLE_CHOICE); // default is SINGLE_CHOICE
    const [responsesListInput, setResponsesListInput] = useState([defaultResponse]);
    const [savedResponseList, setSavedResponseList] = useState([defaultResponse]);

    const [responseReset, setResponseReset] = useState(false);

    const onResponseListChange = (value, index) => {
        const newResponseList = [...responsesListInput]
        newResponseList[index] = {response: value, isAnswer: false}
        setResponsesListInput(newResponseList)
    }

    const onTypeChange = (value) => {
        setTypeInput(value)

        if (value === TRUE_OR_FALSE) setSavedResponseList(responsesListInput)
        onResetResponseList()
        setResponsesListInput(value === TRUE_OR_FALSE ? 
            [
                {response: 'True', isAnswer: false},
                {response: 'False', isAnswer: false},
            ]
            : savedResponseList)
    }

    const onResetResponseList = () => {
        setResponseReset(!responseReset);
    }

    const handleSubmit = () => {
        onAddQuestion({
            question: questionInput,
            type: typeInput,
            responses: responsesListInput
        }, onClose)
    }

    return (
      <div>
        <Button onClick={onOpen}>Add a Question</Button>
        <Modal
          size={'lg'}
          isCentered
          onClose={onClose}
          isOpen={isOpen}
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
                        <option value={SINGLE_CHOICE}>Single Choice</option>
                        <option value={MULTIPLE_CHOICE}>Multiple Choice</option>
                        <option value={TRUE_OR_FALSE}>True/False</option>
                        <option value={FILL_BLANK}>Fill in the blank</option>
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
                                responsesListInput.length <= 5 && typeInput !== TRUE_OR_FALSE ? (
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
              <Button color={'white'} bg='brand.400' onClick={handleSubmit}>Add Question</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
  }