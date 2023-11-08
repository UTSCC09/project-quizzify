import React from 'react';
import {
  Box, Input, PinInputField,
} from '@chakra-ui/react';

export default function CustomPinInput() {
  return (
    <Input as={PinInputField} width={12} height={12} fontSize={24} 
           borderRadius={0} 
           color={'white'} border={'2px solid white'}
           borderTop={'none'}
           borderLeft={'none'}
           borderRight={'none'}
           bg={'transparent'}
           _focus={{borderColor: 'unset', boxShadow: 'unset'}}
           />
  );
}
