import React, { useEffect, useRef } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import { TRUE_OR_FALSE } from '@/constants';

export default function CustomResponseInput({
    type,
    response,
    index,
    responseReset,
    onChange
}) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.value = response.response;
  }, [responseReset]);

  return (
    <Box as={Button} 
        h={'75px'} w={'100%'}
        border={'1px solid #cacfdb'}
        bg={'white'}
        borderRadius={'15px'}
        onClick={()=>ref.current.focus()}>
        <Input
          ref={ref}
          isDisabled={type===TRUE_OR_FALSE}
          value={response.response}
          onChange={(e)=>{onChange(e.target.value, index)}}
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
  );
}
