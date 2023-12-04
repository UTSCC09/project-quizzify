import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { QUIZ_TYPES } from '@/constants';

export default function CustomResponseInput({
    type,
    responsesListInput,
    response,
    index,
    responseReset,
    onChange
}) {
  const ref = useRef(null);
  const isAnswerRef = useRef(null);
  const [isAnswerSelect, setIsAnswerSelect] = useState(response.isAnswer);

  useEffect(() => {
    ref.current.value = response.response;
  }, [responseReset]);

  const setIsAnswer = () => {
    let count = 0;
    responsesListInput?.forEach(response => {
      if (response.isAnswer) count++
    })

    // only allow one answer to be selected if type is not MULTIPLE_CHOICE
    if (type !== QUIZ_TYPES.MULTIPLE_CHOICE && !isAnswerSelect && count + 1 >= 2) return;
    setIsAnswerSelect(!isAnswerSelect)
  }

  useEffect(() =>{
    onChange(ref.current.value, isAnswerSelect, isAnswerRef.current.innerText, index, response._id)
  }, [isAnswerSelect])

  return (
    <Box w={'100%'} position={'relative'}>
    <Flex
      ref={isAnswerRef}
      bg={isAnswerSelect ? 'correctAccent.100' : 'wrongAccent.100'}
      borderRadius={'full'}
      position={'absolute'}
      w={'25px'} h={'25px'}
      fontSize={'xs'}
      justifyContent={'center'} alignItems={'center'}
      zIndex={2}
      mt={'5px'} mr={'6px'}
      top={0} right= {0}
      cursor={'pointer'}
      onClick={setIsAnswer} onDoubleClick={setIsAnswer}
    >
      {isAnswerSelect ? '✅' : '❌'}
    </Flex>
    <Box as={Button}
        h={'75px'}
        w={'100%'}
        bg={'white'}
        borderRadius={'15px'} border={'1px solid #cacfdb'}
        _hover={{bg: 'none', opacity: 0.7}}
        _focusVisible={{boxShadow: '0px 0px 0px 2px #6e5cec5c'}}
        onClick={()=>{ref.current.focus()}}
        onDoubleClick={setIsAnswer}>
        <Input
          ref={ref}
          isDisabled={type===QUIZ_TYPES.TRUE_OR_FALSE}
          value={response.response}
          onChange={(e)=>{onChange(e.target.value, false, isAnswerRef.current.innerText, index)}}
          fontSize={14}
          padding={2}
          cursor={'pointer'}
          placeholder='Click to add a Response'
          textAlign={'center'}
          borderRadius={0} 
          color={'secondary.400'}
          border={'none'}
          bg={'transparent'}
          _focus={{borderColor: 'unset', boxShadow: 'unset'}}
        />
    </Box>
    </Box>
  );
}
