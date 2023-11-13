import React from 'react';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import CustomIconButton from '../Buttons/CustomIconButton';

export default function JoinNavBar() {
  return (
    <Box as="nav" position={'fixed'} w="100%" bg="transparent" padding={8}>
      <Flex align="center" justify="space-between">
        <CustomIconButton icon={<CloseIcon />} href='/' isExternal={false}/>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" color={'background.400'}>
          Join Game
        </Text>
        <CustomIconButton icon={<AddIcon />} href='/' isExternal={false}/>
      </Flex>
    </Box>
  );
}
