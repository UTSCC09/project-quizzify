import { Box, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text } from "@chakra-ui/react";
import React from "react";
import CustomPointTag from "./CustomPointTag";

export const Leaderboard = ({
    socket,
    isOpen,
    onClose,
    players
}) => {
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent color={'white'} bg={'brand.400'}>
            <ModalHeader mt={12} textAlign={'center'}>Leaderboard</ModalHeader>
            <ModalCloseButton mt={12} mr={8}/>
            <ModalBody>
                <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                    {players.map((player, i) =>
                        <Box key={i} py={4} width={{base: '100%', md: '500px'}}>
                            <Flex alignItems={'center'} justifyContent={'space-between'}>
                                <Flex alignItems={'center'} justifyContent={'center'} gap={4}>
                                    <CustomPointTag text={i+1} />
                                    {/* Avatars from https://github.com/boringdesigners/boring-avatars */}
                                    <Image src={`https://source.boringavatars.com/beam/50/${player.displayName}499?colors=264653,2a9d8f,f4a261,e76f51`}/>
                                    <Text>{player.displayName}</Text>
                                </Flex>
                                <CustomPointTag text={player.points}/>
                            </Flex>
                        </Box>
                    )}
                </Flex>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
};