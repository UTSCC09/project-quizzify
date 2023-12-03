import React from 'react';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import CustomIconButton from '../Buttons/CustomIconButton';

export default function LobbyNavBar({
  text
}) {
  return (
    <Box as="nav" position={'fixed'} w="100%" bg="transparent" padding={8}>
      <Flex align="center" justify="space-between">
        <CustomIconButton icon={<ArrowBackIcon />} href='/' isExternal={false}/>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" color={'background.400'}>
          {text}
        </Text>
        <CustomIconButton icon={<ArrowBackIcon />} opacity={0}/> {/* Empty spacer for centering */}
      </Flex>
    </Box>
  );
}
